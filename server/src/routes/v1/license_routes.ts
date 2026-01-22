import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {LicenseController} from "../../controllers/licenseController.js";
import {licenseSchema} from '../../interfaces/dtos/body/license_dto.js';

import {paramsIdSchema, paramsNameSchema} from "../../interfaces/dtos/params/common.js";

const router = Router();
const controller = new LicenseController();

router.post('/',
    validate({ body: licenseSchema }),
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
    validate({ params: paramsIdSchema, body: licenseSchema }),
    controller.update
);

export default router;