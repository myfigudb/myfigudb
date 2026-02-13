import { Router } from 'express';
import { validate } from '../../../core/middlewares/validate.js';
import { verifyToken } from "../../../core/middlewares/auth.js";
import { verifyRole } from "../../../core/middlewares/role.js";

import { createEditorSchema } from "./editor.dto.js";
import { EditorController } from "./editor.controller.js";


const router = Router();
const controller = new EditorController();

router.get('/',
    verifyToken,
    verifyRole("default"),
    controller.findAll
);

router.post('/',
    verifyToken,
    validate({ body: createEditorSchema }),
    controller.create
);

export default router;