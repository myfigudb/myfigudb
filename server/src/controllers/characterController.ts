import { Request, Response } from 'express';
import {CharacterService} from "../services/CharacterService.js";

const service = new CharacterService();

export class CharacterController {

    async create(req: Request, res: Response) {
        try {
            const character = await service.createCharacter(req.body);
            return res.status(201).json(character);
        } catch (error) {
            console.error("Error creating characters:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async findById(req: Request<{ id: string }>, res: Response) {
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

    async findAll(req: Request, res: Response) {
        try {
            const character = await service.getAllCharacters();
            return res.status(200).json(character);
        } catch (error) {
            console.error("Error getting all character with error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}