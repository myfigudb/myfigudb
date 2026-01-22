import {Prisma, User} from "../generated/prisma/client.js";
import {pclient} from "../config/prisma.js";
import bcrypt from "bcrypt";


export class UserService {

    async getUserById(id: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { id }
        });
    }
    async getUserBySlug(slug: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { slug }
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return pclient.user.findUnique({
            where: { email }
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const salt_rounds = 10;
        const hash = await bcrypt.hash(data.password, salt_rounds);

        return pclient.user.create({
            data: {
                ...data,
                password: hash
            }
        });
    }
}