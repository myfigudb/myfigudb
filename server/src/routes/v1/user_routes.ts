import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {createUserSchema} from "../../interfaces/dtos/entities/user_dto.js";
import {UserController} from "../../controllers/userController.js";

const router = Router();
const controller = new UserController();

router.post('/',
    validate({body: createUserSchema }),
    controller.create
);

export default router;