import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserService } from "../user/user.service.js";
import { User } from "../../generated/prisma/client.js";

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

export class AuthService {

    private userService = new UserService();

    loginWithEmail = async (email: string, passwordInput: string) => {
        const foundUser = await this.userService.getUserByEmail(email);

        if (!foundUser) {
            console.warn(`Auth Service: Login failed, user not found for email ${email}`);
            return null;
        }

        return this.login(foundUser, passwordInput);
    };

    loginWithSlug = async (slug: string, passwordInput: string) => {
        const foundUser = await this.userService.getUserBySlug(slug);

        if (!foundUser) {
            console.warn(`Auth Service: Login failed, user not found for slug ${slug}`);
            return null;
        }

        return this.login(foundUser, passwordInput);
    };

    private login = async (user: User, passwordInput: string) => {
        const isPasswordValid = await bcrypt.compare(passwordInput, user.password);

        if (!isPasswordValid) {
            console.warn(`Auth Service: Invalid password for user_id ${user.id}`);
            return null;
        }

        const payload: Express.User = {
            id: user.id,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

        console.log(`Auth Service: User ${user.slug} logged in successfully`);

        return accessToken;
    };
}