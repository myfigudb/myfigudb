import { Router } from 'express';

import license_routes from '../../../modules/catalog/license/license.routes.js';
import character_routes from "../../../modules/catalog/character/character.routes.js";
import auth_routes from "../../../modules/auth/auth.routes.js";
import user_routes from "../../../modules/user/user.routes.js";
import editor_routes from '../../../modules/catalog/editor/editor.routes.js';
import figure_routes from '../../../modules/figure/figure.routes.js';
import tag_routes from "../../../modules/tag/tag.routes.js";

const router = Router();

router.use('/licenses', license_routes);
router.use('/characters', character_routes);

router.use('/auth', auth_routes);
router.use('/users', user_routes);

router.use('/figures', figure_routes);
router.use('/editors', editor_routes);

router.use('/tags', tag_routes);


export default router;