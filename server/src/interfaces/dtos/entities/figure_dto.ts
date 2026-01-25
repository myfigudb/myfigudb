import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Figure, Media} from "../../../generated/prisma/client.js";

extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Figure
 */
export const createFigureSchema = z.object({
    name: z.string().min(1).trim(),
    range_id: z.string().uuid().optional(), // Correction parenthèses + string
    editor_id: z.string().uuid().optional(), // Décommenté pour la cohérence

    scale: z.string().optional(),
    height: z.number().optional(),
    release_date: z.coerce.date().optional(),
    commentary: z.string().optional(),
})

export type CreateFigureDTO = z.infer<typeof createFigureSchema>;


/**
 * OUTPUT DTO: Figure response
 */
export const figureResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    range_id: z.string().uuid().nullable(),
    editor_id: z.string().uuid().nullable(),
    scale: z.string().nullable().optional(),
})

export type FigureResponse = z.infer<typeof figureResponseSchema>;

/**
 * OUTPUT toDTO: Figure response
 */
export type FigureInput = Figure & { images?: Media[]};

export const toFigureDTO = (source: FigureInput): FigureResponse => {
    return {
        id: source.id,
        name: source.name,
        range_id: source.range_id,
        editor_id: source.editor_id,
        scale: source.scale,
    };
};
