import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {AuthController} from "../../controllers/authController.js";
import {authSchema} from "../../interfaces/dtos/auth_dto.js";

const router = Router();
const controller = new AuthController();


router.post('/',
    validate({body: authSchema }),
    controller.login
);



export default router;