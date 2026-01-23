import {Request, RequestHandler, Response} from 'express';
import {UserService} from "../services/database/userService.js";
import {CreateUserDTO} from "../interfaces/dtos/entities/user_dto.js";

const service = new UserService();

export class UserController {

    create: RequestHandler<{}, any, CreateUserDTO> = async (req, res) => {
        try {
            const character = await service.createUser(req.body);
            return res.status(201).json(character);
        } catch (error) {
            console.error("Error creating characters:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
}