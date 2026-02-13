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
    licenseId: z.uuid(),
})
export type CreateCharacterDTO = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = createCharacterSchema.partial();
export type UpdateCharacterDTO = z.infer<typeof updateCharacterSchema>;

/**
 * OUTPUT DTO: Character response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toCharacterDTO
 */

export const characterResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    licenseId: z.uuid(),
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
        licenseId: source.licenseId,

        medias: source.medias?.map((media) =>
            StorageService.getPublicUrl(media.hash, media.extension, media.folder)
        ) ?? [],
    };
};