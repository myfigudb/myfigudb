import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserService } from "./userService.js";
import { User } from "../../generated/prisma/client.js";

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export class AuthService {
    private user_service: UserService;

    constructor() {
        this.user_service = new UserService();
    }

    loginWithEmail = async (email: string, password_input: string) => {
        const user_found = await this.user_service.getUserByEmail(email);

        if (!user_found) {
            console.warn(`Auth Service: Login failed, user not found for email ${email}`);
            return null;
        }

        return this.login(user_found, password_input);
    };

    loginWithSlug = async (slug: string, password_input: string) => {
        const user_found = await this.user_service.getUserBySlug(slug);

        if (!user_found) {
            console.warn(`Auth Service: Login failed, user not found for slug ${slug}`);
            return null;
        }

        return this.login(user_found, password_input);
    };

    private login = async (user: User, password_input: string) => {
        const is_password_valid = await bcrypt.compare(password_input, user.password);

        if (!is_password_valid) {
            console.warn(`Auth Service: Invalid password for user_id ${user.id}`);
            return null;
        }

        const payload = {
            user_id: user.id,
            role: user.role,
        };

        const access_token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

        console.log(`Auth Service: User ${user.slug} logged in successfully`);

        return access_token;
    };
}