import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {AuthController} from "../../controllers/authController.js";
import {authSchema} from "../../interfaces/dtos/body/auth_dto.js";


const router = Router();
const controller = new AuthController();


router.post('/', validate({body: authSchema }), (req, res) => controller.login(req, res));



export default router;