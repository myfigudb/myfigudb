import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Range, Media} from "@db/client.js";

import {CharacterInput} from "../character/character.dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Range
 */
export const createRangeSchema = z.object({
    name: z.string().min(1).trim(),
    editorId: z.uuid()
})

export type CreateRangeDTO = z.infer<typeof createRangeSchema>;


export const updateRangeSchema = createRangeSchema.partial();
export type UpdateRangeDTO = z.infer<typeof updateRangeSchema>;

/**
 * OUTPUT DTO: Range response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toRangeDTO
 */
export const rangeResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

export type RangeResponse = z.infer<typeof rangeResponseSchema>;


/**
 * OUTPUT toDTO: Range response
 */
export type RangeInput = Range;

export const toRangeDTO = (source: RangeInput): RangeResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
