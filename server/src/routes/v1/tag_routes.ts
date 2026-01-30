import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';


import {TagController} from "../../controllers/tagController.js";
import {VoteSchema} from "../../interfaces/dtos/vote_dto.js";
import {verifyToken} from "../../middlewares/auth.js";

const router = Router();
const controller = new TagController();


router.get('/',
    verifyToken,
    controller.survey
);

router.post('/',
    verifyToken,
    validate({body: VoteSchema }),
    controller.vote
)

export default router;