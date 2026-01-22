import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {characterSchema} from "../../interfaces/dtos/body/character_dto.js";
import {CharacterController} from "../../controllers/characterController.js";

import {paramsIdSchema} from "../../interfaces/dtos/params/common.js";
import {verifyToken} from "../../middlewares/auth.js";
import {verifyRole} from "../../middlewares/role.js";

const router = Router();
const controller = new CharacterController();

router.post('/', verifyToken, validate({body: characterSchema }), (req, res) => controller.create(req, res));
router.get('/', verifyToken, verifyRole("default"), (req, res) => controller.findAll(req, res));
router.get('/:id', validate({ params: paramsIdSchema }), controller.findById);

export default router;