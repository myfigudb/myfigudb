import {Request, RequestHandler, Response} from 'express';
import {UserService} from "./user.service.js";
import {CreateUserDTO} from "./user.dto.js";
import {ParamsIdDTO} from "../../interfaces/dtos/params_dto.js";

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

    findById: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            const user = await service.getUserById(id);


            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json(user);

        } catch(error) {
            console.error("Error getting user by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}