import {z} from "zod";

export const userCreateSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    email: z.email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters long"),
})

