import { CommentRepository } from "./comment.repository.js";
import { PostCommentDTO, ReplyCommentDTO, UpdateCommentDTO } from "./comment.dto.js";
import { FigureComment } from "@db/client.js";

export class CommentService {

    private repo = new CommentRepository();

    async getCommentById(id: string): Promise<FigureComment | null> {
        return this.repo.getById(id);
    }

    async getCommentsByFigureId(figureId: string): Promise<FigureComment[]> {
        return this.repo.getByFigureId(figureId);
    }

    async getCommentsByUserId(userId: string): Promise<FigureComment[]> {
        return this.repo.getByUserId(userId);
    }

    async getAllComments(): Promise<FigureComment[]> {
        return this.repo.getAll();
    }

    async postComment(dto: PostCommentDTO, figureId: string, userId: string): Promise<FigureComment> {
        return this.repo.create({
            figureId: figureId,
            userId: userId,
            content: dto.content

        });
    }

    async replyComment(dto: ReplyCommentDTO, figureId: string, userId: string): Promise<FigureComment> {
        const parentComment = await this.repo.getById(dto.parentId);

        if (!parentComment) {
            throw new Error("Parent comment not found");
        }

        if (parentComment.figureId !== figureId) {
            throw new Error("Figure ID mismatch: The parent comment belongs to a different figure");
        }

        return this.repo.create({
            figureId: figureId,
            parentId: dto.parentId,
            userId: userId,
            content: dto.content
        });
    }

    async updateComment(id: string, dto: UpdateCommentDTO, userId: string): Promise<FigureComment> {
        const comment = await this.repo.getById(id);

        if (!comment) {
            throw new Error("Comment not found");
        }

        //TODO PERMISSION VERIFICATION
        if(comment.userId !== userId) {
            throw new Error("Update must be made by comment author");
        }

        return this.repo.update(id, dto);
    }

    async deleteComment(id: string, userId: string): Promise<FigureComment | null> {
        const comment = await this.repo.getById(id);

        if (!comment) {
            throw new Error("Comment not found");
        }

        //TODO PERMISSION VERIFICATION
        if(comment.userId !== userId) {
            throw new Error("Delete must be made by comment author");
        }

        return this.repo.delete(id);
    }
}