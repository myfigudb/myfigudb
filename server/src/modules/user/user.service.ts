import bcrypt from 'bcrypt';
import { UserRepository } from "./user.repository.js";
import { User } from "../../generated/prisma/client.js";
import {CreateUserDTO} from "./user.dto.js";

export class UserService {

    private repo = new UserRepository();

    /**
     * Create a new user.
     * Handles password hashing and duplicate checks.
     */
    async createUser(dto: CreateUserDTO): Promise<User> {
        const existingEmail = await this.repo.getByEmail(dto.email);
        if (existingEmail) {
            throw new Error(`Email '${dto.email}' is already registered.`);
        }

        const existingSlug = await this.repo.getBySlug(dto.slug);
        if (existingSlug) {
            throw new Error(`Handle '@${dto.slug}' is already taken.`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        return this.repo.create({
            email: dto.email,
            slug: dto.slug,
            displayName: dto.displayName,
            password: hashedPassword,
        });
    }

    /**
     * Get a user by ID.
     */
    async getUserById(id: string): Promise<User | null> {
        return this.repo.getById(id);
    }

    /**
     * Get a user by their slug (handle).
     */
    async getUserBySlug(slug: string): Promise<User | null> {
        const cleanSlug = slug.startsWith('@') ? slug.substring(1) : slug;
        return this.repo.getBySlug(cleanSlug);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.repo.getByEmail(email);
    }

    /**
     * Get just the experience points of a user.
     */
    async getUserExp(userId: string): Promise<number> {
        return this.repo.getExp(userId);
    }
}