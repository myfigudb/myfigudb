import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { verifyToken } from "../../middlewares/auth.js";

import {
    postCommentSchema,
    replyCommentSchema,
    updateCommentSchema
} from "../../interfaces/dtos/entities/comment_dto.js";
import { paramsIdSchema } from "../../interfaces/dtos/params_dto.js";
import { CommentController } from "../../controllers/commentController.js";

const router = Router();
const controller = new CommentController();


router.post('/',
    verifyToken,
    validate({ body: postCommentSchema }),
    controller.postComment
);

router.post('/reply',
    verifyToken,
    validate({ body: replyCommentSchema }),
    controller.replyComment
);


router.get('/figure/:id',
    validate({ params: paramsIdSchema }),
    controller.findByFigureId
);


router.patch('/:id',
    verifyToken,
    validate({ params: paramsIdSchema, body: updateCommentSchema }),
    controller.updateComment
);

router.delete('/:id',
    verifyToken,
    validate({ params: paramsIdSchema }),
    controller.delete
);

export default router;