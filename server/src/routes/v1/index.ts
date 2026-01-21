import { Router } from 'express';
import license_routes from './license_routes.js';
import character_routes from "./character_routes.js";

const router = Router();

router.use('/licenses', license_routes);
router.use('/characters', character_routes);

export default router;