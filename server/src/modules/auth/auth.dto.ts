import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z)

export const authSchema = z.object({
    password: z.string().min(1, "Password is required"),

    email: z.email().optional(),
    slug: z.string().min(3).optional(),
})

    .refine((data) => data.email || data.slug, {
        message: "You must provide either an email or a slug",
        path: ["email"],
    });

export type AuthDTO = z.infer<typeof authSchema>;