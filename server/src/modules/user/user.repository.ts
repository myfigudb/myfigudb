import {Prisma, User} from "../../generated/prisma/client.js";
import {pclient} from "@core/config/prisma.js";

export class UserRepository {

    /**
     * Retrieve a User by their unique ID (UUID).
     *
     * @param id    The user's UUID
     * @returns     The User object or null if not found
     */
    async getById(id: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: {id}
        });
    }

    /**
     * Retrieve a User by their unique slug.
     * The slug is usually the public handle (e.g., "@solare").
     *
     * @param slug  The unique string identifier
     * @returns     The User object or null if not found
     */
    async getBySlug(slug: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: {slug}
        });
    }

    /**
     * Retrieve a User by their email address.
     * Useful for authentication logic or checking for duplicates.
     *
     * @param email The email address to search
     * @returns     The User object or null if not found
     */
    async getByEmail(email: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: {email}
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return pclient.user.create({data});
    }


    async getExp(user_id: string): Promise<number> {
        const user = await pclient.user.findUnique({
            where: { id: user_id },
            select: { exp: true }
        });

        if (!user) throw new Error("User not found");

        return user.exp;
    }
}