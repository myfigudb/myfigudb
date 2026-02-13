import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {Editor, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "../character/character.dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Editor
 */
export const createEditorSchema = z.object({
    name: z.string().min(1).trim(),
})
export type CreateEditorDTO = z.infer<typeof createEditorSchema>;



export const updateEditorSchema = createEditorSchema.partial();
export type UpdateEditorDTO = z.infer<typeof updateEditorSchema>;


/**
 * OUTPUT DTO: Editor response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toEditorDTO
 */
export const editorResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})
export type EditorResponse = z.infer<typeof editorResponseSchema>;


/**
 * OUTPUT toDTO: Editor response
 */
export type EditorInput = Editor;

export const toEditorDTO = (source: EditorInput): EditorResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
