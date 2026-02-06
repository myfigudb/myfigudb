import { Router } from 'express';

import { validate } from '../../middlewares/validate.js';

import {createFigureSchema} from "../../interfaces/dtos/entities/figure_dto.js";
import {FigureController} from "../../controllers/figureController.js";

import {paramsIdSchema, paramsNameSchema} from "../../interfaces/dtos/params_dto.js";
import {figureSearchSchema} from "../../interfaces/dtos/search_dto.js";
//import {verifyToken} from "../../middlewares/auth.js";
//import {verifyRole} from "../../middlewares/role.js";

const router = Router();
const controller = new FigureController();

router.post('/',
    //verifyToken,
    validate({body: createFigureSchema }),
    controller.create
);

router.get('/search',
    validate({ query: figureSearchSchema }),
    controller.search
);

router.delete('/:id',
    //verifyToken, //
    validate({ params: paramsIdSchema }),
    controller.delete
);

router.patch('/:id',
    //verifyToken,
    validate({ params: paramsIdSchema, body: createFigureSchema }),
    controller.update
);

router.get('/',
    //verifyToken,
    //verifyRole("default"),
    controller.findAll
);

router.get('/:id',
    validate({ params: paramsIdSchema }),
    controller.findById
);

router.get('/search/:name',
    validate({ params: paramsNameSchema }),
    controller.searchByName
);

export default router;