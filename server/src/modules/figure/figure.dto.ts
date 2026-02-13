import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Figure, Media} from "../../generated/prisma/client.js";

extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Figure
 */
export const createFigureSchema = z.object({
    name: z.string().min(1).trim(),

    scale: z.string().optional(),
    height: z.number().optional(),

    rangeId: z.uuid().optional(),
    editorId: z.uuid(),

    gtin13: z.string().optional(),

    releaseDate: z.coerce.date().optional(),
    //color
    commentary: z.string().optional()
})
export type CreateFigureDTO = z.infer<typeof createFigureSchema>;

export const updateFigureSchema = createFigureSchema.partial();
export type UpdateFigureDTO = z.infer<typeof updateFigureSchema>;


/**
 * OUTPUT DTO: Figure response
 */
export const figureResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    rangeId: z.uuid().optional(),
    editorId: z.uuid(),
    scale: z.string().optional(),
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
        rangeId: source.rangeId ?? undefined,
        editorId: source.editorId,
        scale: source.scale ?? undefined,
    };
};
