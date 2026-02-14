import { Router } from 'express';
import { validate } from '../../core/middlewares/validate.js';

import {createUserSchema} from "./user.dto.js";
import {UserController} from "./user.controller.js";
import {paramsIdSchema} from "../../core/dtos/params_dto.js";

const router = Router();
const controller = new UserController();

router.post('/',
    validate({body: createUserSchema }),
    controller.create
);

router.get('/:id',
    validate({ params: paramsIdSchema }),
    controller.findById
);

export default router;