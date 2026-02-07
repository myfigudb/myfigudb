import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { FigureComment } from "../../../generated/prisma/client.js";

extendZodWithOpenApi(z);

/**
 * DTO: Create a new Root Comment (New Thread)
 */
export const postCommentSchema = z.object({
    content: z.string().min(1).max(2000).trim(),
    figure_id: z.uuid(),
});

/**
 * DTO: Reply to an existing Comment
 */
export const replyCommentSchema = z.object({
    content: z.string().min(1).max(2000).trim(),
    figure_id: z.uuid(),
    parent_id: z.uuid(),
});

/**
 * DTO: Update a Comment
 */
export const updateCommentSchema = z.object({
    content: z.string().min(1).max(2000).trim(),
});

export type PostCommentDTO = z.infer<typeof postCommentSchema>;
export type ReplyCommentDTO = z.infer<typeof replyCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;


export const commentResponseSchema = z.object({
    id: z.uuid(),
    content: z.string(),
    user_id: z.uuid(),
    figure_id: z.uuid(),
    parent_id: z.uuid(),

});

export type CommentResponse = z.infer<typeof commentResponseSchema>;




export type CommentInput = FigureComment;


export const toCommentDTO = (source: CommentInput): CommentResponse => {
    return {
        id: source.id,
        content: source.content,

        user_id: source.user_id,
        figure_id: source.figure_id,
        parent_id: source.parent_id,
    };
};