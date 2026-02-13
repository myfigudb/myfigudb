import { RequestHandler } from 'express';
import { TagService } from "./tag.service.js";
import { CreateTagDTO, UpdateTagDTO } from "./tag.dto.js";
import { ParamsIdDTO } from "../../../interfaces/dtos/params_dto.js";

const tagService = new TagService();

export class TagController {

    /**
     * GET /tags
     * Peut aussi gérer la recherche via query param ?q=...
     */
    getAll: RequestHandler = async (req, res) => {
        try {
            const query = req.query.q as string | undefined;

            if (query) {
                const tags = await tagService.searchTags(query);
                return res.status(200).json(tags);
            }

            const tags = await tagService.getAllTags();

            return res.status(200).json(tags);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }

    /**
     * GET /tags/:id
     */
    getById: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const tag = await tagService.getTagById(req.params.id);

            if (!tag) {
                return res.status(404).json({ message: "Tag introuvable" });
            }

            return res.status(200).json(tag);
        } catch (error) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }

    /**
     * POST /tags
     */
    create: RequestHandler<{}, any, CreateTagDTO> = async (req, res) => {
        try {
            const tag = await tagService.createTag(req.body, req.user!.id);

            return res.status(201).json(tag);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    /**
     * PATCH /tags/:id
     */
    update: RequestHandler<ParamsIdDTO, any, UpdateTagDTO> = async (req, res) => {
        try {
            const tag = await tagService.updateTag(req.params.id, req.body);
            return res.status(200).json(tag);
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Tag introuvable" });
            }
            return res.status(400).json({ message: error.message });
        }
    }

    /**
     * DELETE /tags/:id
     */
    delete: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            await tagService.deleteTag(req.params.id);

            return res.status(204).send();
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Tag introuvable" });
            }
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
}