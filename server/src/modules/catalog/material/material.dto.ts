import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Material, Media} from "@db/client.js";

import {CharacterInput} from "../character/character.dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Material
 */
export const createMaterialSchema = z.object({
    name: z.string().min(1).trim(),
})
export type CreateMaterialDTO = z.infer<typeof createMaterialSchema>;


export const updateMaterialSchema = createMaterialSchema.partial();
export type UpdateMaterialDTO = z.infer<typeof updateMaterialSchema>;

/**
 * OUTPUT DTO: Material response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toMaterialDTO
 */
export const materialResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

export type MaterialResponse = z.infer<typeof materialResponseSchema>;


/**
 * OUTPUT toDTO: Material response
 */
export type MaterialInput = Material;

export const toMaterialDTO = (source: MaterialInput): MaterialResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
