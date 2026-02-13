import { Router } from 'express';
import { validate } from '../../../core/middlewares/validate.js';
import { verifyToken } from "../../../core/middlewares/auth.js";

import {
    postCommentSchema,
    replyCommentSchema,
    updateCommentSchema
} from "./comment.dto.js";

import { paramsIdSchema } from "../../../interfaces/dtos/params_dto.js";
import { CommentController } from "./comment.controller.js";

const router = Router({ mergeParams: true });


const controller = new CommentController();

router.get('/',
    validate({ params: paramsIdSchema }),
    controller.findCommentsByFigureId
);


router.post('/',
    verifyToken,
    validate({
        params: paramsIdSchema,
        body: postCommentSchema
    }),
    controller.postComment
);

router.post('/reply',
    verifyToken,
    validate({ body: replyCommentSchema }),
    controller.replyComment
);


/*
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
 */

export default router;