import { Router } from 'express';
import license_routes from './license_routes.js';

const router = Router();

router.use('/licenses', license_routes);

export default router;