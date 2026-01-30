import {RequestHandler} from 'express';
import {TagService} from "../services/database/figure/tagService.js";
import jwt from 'jsonwebtoken';

import {VoteDTO} from "../interfaces/dtos/vote_dto.js";

interface SurveyPayload {
    survey_id: string;
    user_id: string;
}

const service = new TagService();

export class TagController {
    survey: RequestHandler = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({message: "Unauthorized"});
            }

            const survey = await service.getTagValidationSurvey(req.user.id);

            if (!survey) {
                return res.status(404).json({message: "No survey available"});
            }

            const payload: SurveyPayload = {
                survey_id: survey.id,
                user_id: req.user.id
            };

            const secret_key = process.env.JWT_TRIAL_SECRET || 'default_secret_key'
            const survey_token = jwt.sign(
                payload,
                secret_key,
                {expiresIn: '15m'}
            );

            return res.status(200).json({
                token: survey_token
            });

        } catch (error) {
            console.error("Error generating survey:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    vote: RequestHandler<{}, any, VoteDTO> = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {token, vote} = req.body;

        try {
            const secret_key = process.env.JWT_TRIAL_SECRET || 'default_secret_key'
            const payload = jwt.verify(token, secret_key) as SurveyPayload;

            if (payload.user_id !== req.user.id) {
                return res.status(403).json({message: "This trial was not assigned to you"});
            }

            await service.registerTagValidationVote(payload.user_id, payload.survey_id, vote) //survey = rdm figure_tag

            return res.status(200).json({message: "Vote registered successfully"});

        } catch (error) {
            return res.status(400).json({message: "Invalid or expired token"});
        }
    }
}


