import { Router } from 'express';

import { validate } from '../../../core/middlewares/validate.js';
import { upload } from '../../../core/middlewares/upload.js';

import {createCharacterSchema} from "./character.dto.js";
import {CharacterController} from "./character.controller.js";

import {paramsIdSchema} from "../../../interfaces/dtos/params_dto.js";
import {verifyToken} from "../../../core/middlewares/auth.js";
import {verifyRole} from "../../../core/middlewares/role.js";
import {createLicenseSchema} from "../../../interfaces/dtos/entities/license_dto.js";

const router = Router();
const controller = new CharacterController();

router.post('/',
    verifyToken,
    validate({body: createCharacterSchema }),
    controller.create
);

router.delete('/:id',
    validate({ params: paramsIdSchema }),
    controller.delete
);

router.patch('/:id',
    validate({ params: paramsIdSchema, body: createCharacterSchema }),
    controller.update
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