import {pclient} from "../../../config/prisma.js";
import {FigureComment, Prisma} from "../../../generated/prisma/client.js";

export class CommentService {

    /**
     * Retrieve a Comment by its unique ID.
     */
    async getCommentById(id: string): Promise<FigureComment | null> {
        return pclient.figureComment.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve Comments by Figure ID.
     */
    async getCommentsByFigureId(figure_id: string): Promise<FigureComment[]> {
        return pclient.figureComment.findMany({
            where: { figure_id }
        });
    }

    /**
     * Retrieve Comments by User ID.
     */
    async getCommentsByUserId(user_id: string): Promise<FigureComment[]> {
        return pclient.figureComment.findMany({
            where: { user_id }
        });
    }

    /**
     * Retrieve all Comments.
     */
    async getAllComments(): Promise<FigureComment[]> {
        return pclient.figureComment.findMany();
    }

    /**
     * Create a new Comment.
     */
    async createComment(data: Prisma.FigureCommentCreateInput): Promise<FigureComment> {
        return pclient.figureComment.create({
            data: data
        });
    }

    /**
     * Update an existing Comment.
     */
    async updateComment(id: string, data: Prisma.FigureCommentUpdateInput): Promise<FigureComment> {
        return pclient.figureComment.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Comment.
     */
    async deleteComment(id: string): Promise<FigureComment> {
        return pclient.figureComment.delete({
            where: { id }
        });
    }

    /**
     * Find Comment with exact content matching.
     * @param content
     */
    async getCommentByExactContent(content: string): Promise<FigureComment | null> {
        return pclient.figureComment.findFirst({
            where: {
                content: {
                    equals: content.trim(),
                    mode: 'insensitive'
                }
            }
        });
    }

}