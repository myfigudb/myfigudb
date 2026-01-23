import { Router } from 'express';

import { validate } from '../../middlewares/validate.js';
import { upload } from '../../middlewares/upload.js';

import {createCharacterSchema} from "../../interfaces/dtos/entities/character_dto.js";
import {CharacterController} from "../../controllers/characterController.js";

import {paramsIdSchema} from "../../interfaces/dtos/params_dto.js";
import {verifyToken} from "../../middlewares/auth.js";
import {verifyRole} from "../../middlewares/role.js";

const router = Router();
const controller = new CharacterController();

router.post('/',
    verifyToken,
    validate({body: createCharacterSchema }),
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