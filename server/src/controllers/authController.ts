import {Request, RequestHandler, Response} from 'express';
import {AuthService} from "../services/database/user/authService.js";
import {AuthDTO} from "../interfaces/dtos/auth_dto.js";

const service = new AuthService();

export class AuthController {

    login: RequestHandler<{}, any, AuthDTO> = async (req, res) => {
        try {
            let access_token: string | null = null;

            if (req.body.email) {
                access_token = await service.loginWithEmail(req.body.email, req.body.password);
            } else if (req.body.slug) {
                access_token = await service.loginWithSlug(req.body.slug, req.body.password);
            }

            if (!access_token) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            return res.status(200).json({ access_token });

        } catch (error) {
            console.error("Error logging in:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}