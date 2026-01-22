import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {userCreateSchema} from "../../interfaces/dtos/body/user_dto.js";
import {UserController} from "../../controllers/userController.js";

const router = Router();
const controller = new UserController();

router.post('/',
    validate({body: userCreateSchema }),
    controller.create
);

export default router;