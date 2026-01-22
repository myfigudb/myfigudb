import { Request, Response } from 'express';
import {AuthService} from "../services/authService.js";

const service = new AuthService();

export class AuthController {

    async login(req: Request, res: Response) {
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