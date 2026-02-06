import {Request, RequestHandler, Response} from 'express';
import {CharacterService} from "../services/database/figure/characterService.js";
import {StorageService} from "../services/storageService.js";
import {MediaService} from "../services/database/mediaService.js";

import {ParamsIdDTO} from "../interfaces/dtos/params_dto.js";
import {
    CharacterInput,
    CreateCharacterDTO,
    toCharacterDTO
} from "../interfaces/dtos/entities/character_dto.js";

const service = new CharacterService();

const storage_service = new StorageService();
const media_service = new MediaService();

export class CharacterController {

    create: RequestHandler<{}, any, CreateCharacterDTO> = async (req, res) => {
        try {
            const character = await service.createCharacter(req.body);
            return res.status(201).json(toCharacterDTO(character as CharacterInput));
        } catch (error) {
            console.error("Error creating characters:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    update: RequestHandler<ParamsIdDTO, any, CreateCharacterDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            const character = await service.updateCharacter(id, req.body);

            return res.status(200).json(toCharacterDTO(character as CharacterInput));
        } catch(error) {
            console.error("Error update character:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    delete: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            await service.deleteCharacter(id);

            return res.status(204).send();

        } catch(error) {
            console.error("Error deleting character:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findById: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            const character = await service.getCharacterById(id);

            if (!character) {
                return res.status(404).json({ message: "Character not found" });
            }

            const response_data = toCharacterDTO(character as CharacterInput);
            return res.status(200).json(response_data);

        } catch(error) {
            console.error("Error getting character by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findAll: RequestHandler = async (req, res) => {
        try {
            const characters = await service.getAllCharacters();
            const response_data = characters.map(c => toCharacterDTO(c as CharacterInput));
            return res.status(200).json(response_data);
        } catch (error) {
            console.error("Error getting all character with error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    uploadMedias: RequestHandler<ParamsIdDTO> = async (req, res, next) => {
        try {
            // 1. Character ID
            const { id } = req.params;

            if(!(await service.existsCharacter(id))) {
                return res.status(404).json({ message: "Character not found" });
            }

            // 2. Files
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const media_hashes: string[] = [];

            for (const file of files) {
                const uploaded = await storage_service.uploadFile(file.buffer, file.mimetype, 'characters');

                await media_service.ensureMediaExists(uploaded.hash, file.mimetype, 'characters');
                media_hashes.push(uploaded.hash);
            }

            const updated_character = await service.attachMedias(id, media_hashes);

            return res.status(200).json(toCharacterDTO(updated_character as CharacterInput));

        } catch (error) {
            console.error("Error uploading character medias:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}