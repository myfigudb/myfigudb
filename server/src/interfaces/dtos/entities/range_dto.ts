import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Range, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "./character_dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Range
 */
export const createRangeSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateRangeDTO = z.infer<typeof createRangeSchema>;


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
