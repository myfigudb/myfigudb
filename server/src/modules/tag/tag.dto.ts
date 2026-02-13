import { z } from 'zod';
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * INPUT: Create Tag
 */
export const createTagSchema = z.object({
    label: z.string().min(1).trim(),
});
export type CreateTagDTO = z.infer<typeof createTagSchema>;

/**
 * INPUT: Update Tag
 */
export const updateTagSchema = createTagSchema.partial();
export type UpdateTagDTO = z.infer<typeof updateTagSchema>;

/**
 * INPUT: Vote on a FigureTag
 */
export const voteTagSchema = z.object({
    token: z.jwt(),
    vote: z.boolean(),
});
export type VoteTagDTO = z.infer<typeof voteTagSchema>;

/**
 * OUTPUT: Standard Tag Response
 */
export const tagResponseSchema = z.object({
    id: z.uuid(),
    label: z.string(),
});