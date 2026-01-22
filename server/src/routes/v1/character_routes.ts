import { Router } from 'express';

import { validate } from '../../middlewares/validate.js';
import { upload } from '../../middlewares/upload.js';

import {characterSchema} from "../../interfaces/dtos/body/character_dto.js";
import {CharacterController} from "../../controllers/characterController.js";

import {paramsIdSchema} from "../../interfaces/dtos/params/common.js";
import {verifyToken} from "../../middlewares/auth.js";
import {verifyRole} from "../../middlewares/role.js";

const router = Router();
const controller = new CharacterController();

router.post('/',
    verifyToken,
    validate({body: characterSchema }),
    controller.create
);

router.get('/',
    verifyToken,
    verifyRole("default"),
     controller.findAll
);

router.get('/:id',
    validate({ params: paramsIdSchema }),
    controller.findById
);

router.post('/:id/medias',
    verifyToken,
    verifyRole("default"),
    validate({ params: paramsIdSchema }),
    upload.array('images', 10),
    controller.uploadMedias
);

export default router;