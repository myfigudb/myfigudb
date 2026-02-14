import { Router } from 'express';
import { validate } from '../../../core/middlewares/validate.js';

import {LicenseController} from "./license.controller.js";
import {createLicenseSchema} from './license.dto.js';

import {paramsIdSchema, paramsNameSchema} from "../../../core/dtos/params_dto.js";

const router = Router();
const controller = new LicenseController();

router.post('/',
    validate({ body: createLicenseSchema }),
    controller.create
);

router.get('/',
  controller.findAll
);

router.get('/:id',
    validate({ params: paramsIdSchema }),
    controller.findById
);

router.delete('/:id',
    validate({ params: paramsIdSchema }),
    controller.delete
);

router.get('/search/:name',
    validate({ params: paramsNameSchema }),
    controller.findByName
);

router.patch('/:id',
    validate({ params: paramsIdSchema, body: createLicenseSchema }),
    controller.update
);

export default router;