import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { createEditorSchema } from "../../interfaces/dtos/entities/editor_dto.js";
import { EditorController } from "../../controllers/editorController.js";
import { verifyToken } from "../../middlewares/auth.js";
import { verifyRole } from "../../middlewares/role.js";

const router = Router();
const controller = new EditorController();

// GET ALL
router.get('/',
    //verifyToken,
    verifyRole("default"), // Optionnel selon ta config
    controller.findAll
);

// CREATE
router.post('/',
    //verifyToken,
    validate({ body: createEditorSchema }),
    controller.create
);

export default router;