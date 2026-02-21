import { Router } from 'express';
import v1_routes from './v1.js';

const router = Router();

router.use('/v1', v1_routes);

export default router;