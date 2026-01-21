import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {LicenseController} from "../../controllers/licenseController.js";
import {licenseSchema} from '../../interfaces/dtos/license_dto.js';

import {paramsIdSchema} from "../../interfaces/dtos/common.js";

const router = Router();
const controller = new LicenseController();


router.post('/', validate({body: licenseSchema}), (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', validate({ params: paramsIdSchema }), controller.findById);

export default router;