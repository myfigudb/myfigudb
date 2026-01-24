import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Figure, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "./character_dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Figure
 */
export const createFigureSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateFigureDTO = z.infer<typeof createFigureSchema>;


/**
 * OUTPUT DTO: Figure response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toFigureDTO
 */
export const figureResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

export type FigureResponse = z.infer<typeof figureResponseSchema>;


/**
 * OUTPUT toDTO: Figure response
 */
export type FigureInput = Figure;

export const toFigureDTO = (source: FigureInput): FigureResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
