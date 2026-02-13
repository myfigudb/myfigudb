import {Router} from "express";

import {TagSurveyController} from "./tag-survey.controller.js";

import {verifyToken} from "../../core/middlewares/auth.js";
import {validate} from "../../core/middlewares/validate.js";

import {voteTagSchema} from "./tag.dto.js";


const router = Router();
const controller = new TagSurveyController();

router.get('/',
    verifyToken,
    controller.survey
);

router.post('/',
    verifyToken,
    validate({body: voteTagSchema }),
    controller.vote
)