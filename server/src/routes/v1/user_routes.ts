import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {userCreateSchema} from "../../interfaces/dtos/body/user_dto.js";
import {UserController} from "../../controllers/userController.js";

const router = Router();
const controller = new UserController();

router.post('/', validate({body: userCreateSchema }), (req, res) => controller.create(req, res));

export default router;