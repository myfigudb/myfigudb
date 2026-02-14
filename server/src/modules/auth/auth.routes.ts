import { Router } from 'express';
import { validate } from '../../core/middlewares/validate.js';

import {AuthController} from "./auth.controller.js";
import {authSchema} from "./auth.dto.js";

const router = Router();
const controller = new AuthController();


router.post('/',
    validate({body: authSchema }),
    controller.login
);



export default router;