import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {characterSchema} from "../../interfaces/dtos/character_dto.js";
import {CharacterController} from "../../controllers/characterController.js";
import {paramsIdSchema} from "../../interfaces/dtos/common.js";

const router = Router();
const controller = new CharacterController();


router.post('/', validate({body: characterSchema }), (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', validate({ params: paramsIdSchema }), controller.findById);


export default router;