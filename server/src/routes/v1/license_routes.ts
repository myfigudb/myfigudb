import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';

import {LicenseController} from "../../controllers/license_controller.js";
import {licenseShema} from '../../interfaces/dtos/license_dto.js';

const router = Router();
const controller = new LicenseController();


router.post('/', validate(licenseShema), (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.findAll(req, res));

//router.get('/:id', (req, res) => controller.getById(req, res));

export default router;