import { RequestHandler } from 'express';
import { CommentService } from "./comment.service.js";
import {
    PostCommentDTO,
    ReplyCommentDTO,
    toCommentDTO,
    CommentInput
} from "./comment.dto.js";
import { ParamsIdDTO } from "../../../core/dtos/params_dto.js";

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
            const userId = req.user.id;
            const figureId = req.params.id;

            const comment = await service.postComment(req.body, figureId, userId);

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
            const userId = req.user.id;
            const figureId = req.params.id;

            const comment = await service.replyComment(req.body, figureId, userId);

            return res.status(201).json(toCommentDTO(comment as CommentInput));

        } catch (error: any) {
            console.error("Error creating reply:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * Get comments
     */
    findCommentsByFigureId: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const figureId = req.params.id;
            const comments = await service.getCommentsByFigureId(figureId);

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
            const userId = req.user.id;
            const commentId = req.params.id;

            await service.deleteComment(commentId, userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Comment not found" });
            }
            console.error("Error deleting comment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}