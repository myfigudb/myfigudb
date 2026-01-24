import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Reseller, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "./character_dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Reseller
 */
export const createResellerSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateResellerDTO = z.infer<typeof createResellerSchema>;


/**
 * OUTPUT DTO: Reseller response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toResellerDTO
 */
export const resellerResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

export type ResellerResponse = z.infer<typeof resellerResponseSchema>;


/**
 * OUTPUT toDTO: Reseller response
 */
export type ResellerInput = Reseller;

export const toResellerDTO = (source: ResellerInput): ResellerResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
