import {Request, RequestHandler, Response} from 'express';
import {CharacterService} from "../services/database/characterService.js";
import {StorageService} from "../services/storageService.js";
import {MediaService} from "../services/database/mediaService.js";

import {ParamsIdDTO} from "../interfaces/dtos/params/common.js";
import {CharacterDTO} from "../interfaces/dtos/body/character_dto.js";

const service = new CharacterService();

const storage_service = new StorageService();
const media_service = new MediaService();

export class CharacterController {

    create: RequestHandler<{}, any, CharacterDTO> = async (req, res) => {
        try {
            const character = await service.createCharacter(req.body);
            return res.status(201).json(character);
        } catch (error) {
            console.error("Error creating characters:", error);
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

            return res.status(200).json(character);

        } catch(error) {
            console.error("Error getting character by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findAll: RequestHandler = async (req, res) => {
        try {
            const character = await service.getAllCharacters();
            return res.status(200).json(character);
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

            return res.status(200).json(updated_character);

        } catch (error) {
            console.error("Error uploading character medias:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}