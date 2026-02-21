import { pclient } from "@core/config/prisma.js";
import { FigureComment, Prisma } from "@db/client.js";

export class CommentRepository {

    /**
     * Retrieve a Comment by its unique ID.
     */
    async getById(id: string): Promise<FigureComment | null> {
        return pclient.figureComment.findUnique({
            where: {id}
        });
    }

    /**
     * Retrieve all Comments.
     */
    async getAll(): Promise<FigureComment[]> {
        return pclient.figureComment.findMany();
    }

    /**
     * Create a new Comment.
     */
    async create(data: Prisma.FigureCommentUncheckedCreateInput): Promise<FigureComment> {
        return pclient.figureComment.create({
            data: data
        });
    }

    /**
     * Update an existing Comment.
     */
    async update(id: string, data: Prisma.FigureCommentUpdateInput): Promise<FigureComment> {
        return pclient.figureComment.update({
            where: {id},
            data: data
        });
    }

    /**
     * Delete a Comment.
     */
    async delete(id: string): Promise<FigureComment> {
        return pclient.figureComment.delete({
            where: {id}
        });
    }



    /**
     * Retrieve Comments by Figure ID.
     */
    async getByFigureId(figureId: string): Promise<FigureComment[]> {
        return pclient.figureComment.findMany({
            where: {figureId}
        });
    }

    /**
     * Retrieve Comments by User ID.
     */
    async getByUserId(userId: string): Promise<FigureComment[]> {
        return pclient.figureComment.findMany({
            where: {userId}
        });
    }
}