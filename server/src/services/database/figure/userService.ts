import {pclient} from "../../../config/prisma.js";

export class UserService {

    async getUserExp(user_id: string): Promise<number> {
        const user = await pclient.user.findUnique({
            where: { id: user_id },
            select: { exp: true }
        });

        if (!user) throw new Error("User not found");

        return user.exp;
    }
}