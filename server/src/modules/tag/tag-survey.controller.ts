import { RequestHandler } from 'express';
import { VoteTagDTO } from "./tag.dto.js";
import { ParamsIdDTO } from "@core/dtos/params_dto.js";
import {TagSurveyService} from "./tag-survey.service.js";

const service = new TagSurveyService();

export class TagSurveyController {

    /**
     * Récupère un sondage aléatoire (Tag + Figure) pour l'utilisateur connecté.
     * Renvoie aussi un Token signé pour sécuriser le vote futur.
     */
    survey: RequestHandler = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const result = await service.getTagValidationSurvey(req.user.id);

            if (!result) {
                return res.status(404).json({ message: "Aucun tag en attente de validation pour le moment." });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Survey Error:", error);
            return res.status(500).json({ message: "Erreur serveur lors de la génération du sondage." });
        }
    }

    /**
     * Enregistre le vote de l'utilisateur.
     * Vérifie le token JWT pour s'assurer que l'utilisateur a bien reçu ce sondage.
     */
    vote: RequestHandler<ParamsIdDTO, any, VoteTagDTO> = async (req, res) => {
        try {
            const userId = req.user!.id;
            const figureTagId = req.params.id;
            const dto = req.body;

            await service.voteOnTag(userId, figureTagId, dto);

            return res.status(200).json({ message: "Vote enregistré avec succès." });

        } catch (error: any) {
            if (error.message.includes("Token") || error.message.includes("mismatch")) {
                return res.status(403).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }
}