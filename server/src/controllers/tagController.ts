import {Request, RequestHandler, Response} from 'express';
import {TagService} from "../services/database/figure/tagService.js";
import jwt from 'jsonwebtoken';


import {ParamsIdDTO} from "../interfaces/dtos/params_dto.js";
import {
} from "../interfaces/dtos/entities/figure_dto.js";

const service = new TagService();

export class TagController {

    //create
    //trial

    survey: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;
            const survey = await service.getTagValidationSurvey(id);

            if (!survey) {
                return res.status(404).json({ message: "No survey available" });
            }

            const survey_token = jwt.sign(
                {
                    tid: survey.id,
                    uid: id
                },
                process.env.JWT_SURVEY_SECRET as string,
                { expiresIn: '15m' }
            );

            return res.status(200).json({
                token: survey_token
                //TODO
            });

        } catch(error) {
            console.error("Error generating survey:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}


