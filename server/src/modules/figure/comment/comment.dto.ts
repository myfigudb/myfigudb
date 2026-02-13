import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {FigureComment} from "../../../generated/prisma/client.js";

extendZodWithOpenApi(z);

/**
 * DTO: Create a new Root Comment
 */
export const postCommentSchema = z.object({
    //figureId in Params as ParamIdDTO
    content: z.string().min(1).max(2000).trim()
});
export type PostCommentDTO = z.infer<typeof postCommentSchema>;

/**
 * DTO: Reply to an existing Comment
 */
export const replyCommentSchema = postCommentSchema.extend({
    parentId: z.uuid(),
});
export type ReplyCommentDTO = z.infer<typeof replyCommentSchema>;

/**
 * DTO: Update a Comment
 */
export const updateCommentSchema = postCommentSchema.pick({content: true});
export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;

export const commentResponseSchema = z.object({
    id: z.uuid(),
    figureId: z.uuid(),
    parentId: z.uuid().nullable(),
    userId: z.uuid(),
    content: z.string(),
});

export type CommentResponse = z.infer<typeof commentResponseSchema>;

export type CommentInput = FigureComment;

export const toCommentDTO = (source: CommentInput): CommentResponse => {
    return {
        id: source.id,
        content: source.content,

        userId: source.userId,
        figureId: source.figureId,
        parentId: source.parentId,
    };
};