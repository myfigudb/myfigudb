import {Request, RequestHandler, Response} from 'express';
import {AuthService} from "./auth.service.js";
import {AuthDTO} from "./auth.dto.js";

const service = new AuthService();

export class AuthController {

    login: RequestHandler<{}, any, AuthDTO> = async (req, res) => {
        try {
            let accessToken: string | null = null;

            if (req.body.email) {
                accessToken = await service.loginWithEmail(req.body.email, req.body.password);
            } else if (req.body.slug) {
                accessToken = await service.loginWithSlug(req.body.slug, req.body.password);
            }

            if (!accessToken) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            return res.status(200).json({ accessToken });

        } catch (error) {
            console.error("Error logging in:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}