import { RequestHandler } from 'express';
import { CommentService } from "../services/database/figure/commentService.js";
import {
    PostCommentDTO,
    ReplyCommentDTO,
    toCommentDTO,
    CommentInput
} from "../interfaces/dtos/entities/comment_dto.js";
import { ParamsIdDTO } from "../interfaces/dtos/params_dto.js";

const service = new CommentService();

export class CommentController {

    /**
     * Create a Comment (New Thread)
     */
    postComment: RequestHandler<ParamsIdDTO, any, PostCommentDTO> = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const user_id = req.user.id;
            const { id } = req.params;
            const { content } = req.body;

            const comment = await service.createComment({
                content: content,
                user_id: user_id,
                figure_id: id
            });

            return res.status(201).json(toCommentDTO(comment as CommentInput));

        } catch (error) {
            console.error("Error creating root comment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * Reply to an existing Comment
     */
    replyComment: RequestHandler<ParamsIdDTO, any, ReplyCommentDTO> = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const user_id = req.user.id;
            const { id } = req.params;
            const { parent_id, content } = req.body;

            const comment = await service.createComment({
                content: content,
                user_id: user_id,
                figure_id: id,
                parent_id: parent_id
            });

            return res.status(201).json(toCommentDTO(comment as CommentInput));

        } catch (error) {
            console.error("Error creating reply:", error);
            if (error) {
                return res.status(404).json({ message: "Parent comment or Figure not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * Get comments
     */
    findCommentsByFigureId: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await service.getCommentsByFigureId(id);
            return res.status(200).json(comments.map(c => toCommentDTO(c as CommentInput)));
        } catch (error) {
            console.error("Error fetching comments:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * Delete comment
     */
    delete: RequestHandler<ParamsIdDTO> = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const { id } = req.params;
            await service.deleteComment(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}