import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { characterRegistry } from '../../modules/catalog/character/character.docs.js';
import {licenseRegistry} from "../../modules/catalog/license/license.docs.js";
import {userRegistry} from "../../modules/user/user.docs.js";
import {figureRegistry} from "../../modules/figure/figure.docs.js";
import {materialRegistry} from "../../modules/catalog/material/material.docs.js";
import {listingRegistry} from "../../modules/figure/listing/listing.doc.js";
import {editorRegistry} from "../../modules/catalog/editor/editor.docs.js";
import {resellerRegistry} from "../../modules/catalog/reseller/reseller.docs.js";
import {rangeRegistry} from "../../modules/catalog/range/range.docs.js";

export const generateOpenApiDocs = () => {
    const generator = new OpenApiGeneratorV3([
        ...characterRegistry.definitions,
        ...licenseRegistry.definitions,
        ...userRegistry.definitions,
        ...figureRegistry.definitions,
        ...materialRegistry.definitions,
        ...listingRegistry.definitions,
        ...editorRegistry.definitions,
        ...resellerRegistry.definitions,
        ...rangeRegistry.definitions,
    ]);

    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '0.0.1',
            title: 'MFDB API',
            description: 'REST Documentation',
        },
        servers: [{ url: '/api/v1' }],
    });
};

