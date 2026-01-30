import { Router } from 'express';

import license_routes from './license_routes.js';
import character_routes from "./character_routes.js";
import auth_routes from "./auth_routes.js";
import user_routes from "./user_routes.js";
import figure_routes from './figure_routes.js';
import editor_routes from './editor_routes.js';
import tag_routes from "./tag_routes.js";

const router = Router();




router.use('/licenses', license_routes);
router.use('/characters', character_routes);

router.use('/auth', auth_routes);
router.use('/users', user_routes);

router.use('/figures', figure_routes);
router.use('/editors', editor_routes);

router.use('/tags', tag_routes);


export default router;