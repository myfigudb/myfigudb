import {Request, Response} from 'express';
import {UserService} from "../services/userService.js";

const service = new UserService();

export class UserController {

    async create(req: Request, res: Response) {
        try {
            const character = await service.createUser(req.body);
            return res.status(201).json(character);
        } catch (error) {
            console.error("Error creating characters:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
}