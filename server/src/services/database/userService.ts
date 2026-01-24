import {Prisma, User} from "../../generated/prisma/client.js";
import {pclient} from "../../config/prisma.js";
import bcrypt from "bcrypt";


export class UserService {

    /**
     * Retrieve a User by their unique ID (UUID).
     *
     * @param id    The user's UUID
     * @returns     The User object or null if not found
     */
    async getUserById(id: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve a User by their unique slug.
     * The slug is usually the public handle (e.g., "@solare").
     *
     * @param slug  The unique string identifier
     * @returns     The User object or null if not found
     */
    async getUserBySlug(slug: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { slug }
        });
    }

    /**
     * Retrieve a User by their email address.
     * Useful for authentication logic or checking for duplicates.
     *
     * @param email The email address to search
     * @returns     The User object or null if not found
     */
    async getUserByEmail(email: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { email }
        });
    }

    /**
     * Create a new User in the database.
     *
     * SECURITY NOTE: This method automatically handles password hashing using bcrypt.
     * It salts and hashes the raw password provided in 'data' before saving it.
     *
     * @param data  The user creation input (must include raw password)
     * @returns     The created User object with the hashed password
     */
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const salt_rounds = 10;
        const hash = await bcrypt.hash(data.password, salt_rounds);

        return pclient.user.create({
            data: {
                ...data,
                password: hash // Replace raw password with hash
            }
        });
    }
}