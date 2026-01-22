import { Router } from 'express';

import license_routes from './license_routes.js';
import character_routes from "./character_routes.js";
import auth_routes from "./auth_routes.js";
import user_routes from "./user_routes.js";

const router = Router();




router.use('/licenses', license_routes);
router.use('/characters', character_routes);

router.use('/auth', auth_routes);
router.use('/users', user_routes);

export default router;