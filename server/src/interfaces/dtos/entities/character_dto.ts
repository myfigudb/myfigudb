import {z} from "zod";

import {Character, Media} from "../../../generated/prisma/client.js";
import {StorageService} from "../../../services/storageService.js";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Character
 */
export const createCharacterSchema = z.object({
    name: z.string().min(1).trim(),
    license_id: z.uuid(),
})

export type CreateCharacterDTO = z.infer<typeof createCharacterSchema>;

/**
 * OUTPUT DTO: Character response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toCharacterDTO
 */

export const characterResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    license_id: z.uuid(),
    medias: z.array(z.url())
})

export type CharacterResponse = z.infer<typeof characterResponseSchema>;


/**
 * OUTPUT toDTO: Character response
 */
export type CharacterInput = Character & { medias: Media[] };

export const toCharacterDTO = (source: CharacterInput): CharacterResponse => {
    return {
        id: source.id,
        name: source.name,
        license_id: source.license_id,

        medias: source.medias.map((media) =>
            StorageService.getPublicUrl(media.hash, media.extension, media.folder)
        ),
    };
};