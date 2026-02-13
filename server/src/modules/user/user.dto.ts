import {z} from "zod";

import {User} from "../../generated/prisma/client.js";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new User
 */
export const createUserSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    email: z.email("Invalid email address"),

    displayName: z.string().optional(),

    password: z.string().min(8, "Password must be at least 8 characters long"),
})
export type CreateUserDTO = z.infer<typeof createUserSchema>;


/**
 * OUTPUT DTO: User response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toCharacterDTO
 */

export const userResponseSchema = z.object({
    id: z.uuid(),
    slug: z.string(),
    email: z.email(),
})

export type UserResponse = z.infer<typeof userResponseSchema>;


/**
 * OUTPUT toDTO: Character response
 */
export type UserInput = User;

export const toCharacterDTO = (source: UserInput): UserResponse => {
    return {
        id: source.id,
        slug: source.slug,
        email: source.email,
    };
};