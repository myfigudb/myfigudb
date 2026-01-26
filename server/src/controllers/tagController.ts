import {RequestHandler} from 'express';
import {TagService} from "../services/database/figure/tagService.js";
import jwt from 'jsonwebtoken';


import {ParamsIdDTO} from "../interfaces/dtos/params_dto.js";
import {} from "../interfaces/dtos/entities/figure_dto.js";

const service = new TagService();

export class TagController {

    //TODO remplacer l'id param par l'id du JWT d'auth
    survey: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const {id} = req.params;
            const survey = await service.getTagValidationSurvey(id);

            if (!survey) {
                return res.status(404).json({message: "No survey available"});
            }

            const survey_token = jwt.sign(
                {
                    tid: survey.id,
                    uid: id
                },
                process.env.JWT_SURVEY_SECRET as string,
                {expiresIn: '15m'}
            );

            return res.status(200).json({
                token: survey_token
                //TODO infos
            });

        } catch (error) {
            console.error("Error generating survey:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    //TODO remplacer l'id param par l'id du JWT d'auth
    vote: RequestHandler<ParamsIdDTO> = async (req, res) => {
        const {id} = req.params;
        const {token, is_positive} = req.body;


        try {
            //TODO faire un service de verification JWT étant donné qu'on utilise plusieurs fois la func ?
            const payload = jwt.verify(token, process.env.JWT_TRIAL_SECRET as string) as { fid: string, uid: string };

            if (payload.uid !== id) {
                return res.status(403).json({message: "This trial was not assigned to you"});
            }

            //vote

            return res.status(200).json({message: "Vote registered successfully"});

        } catch (error) {
            return res.status(400).json({message: "Invalid or expired token"});
        }
    }
}


