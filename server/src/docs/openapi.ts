import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { characterRegistry } from './domains/character_docs.js';
import {licenseRegistry} from "./domains/license_docs.js";
import {userRegistry} from "./domains/user_docs.js";
import {figureRegistry} from "./domains/figure_docs.js";
import {materialRegistry} from "./domains/material_doc.js";

export const generateOpenApiDocs = () => {
    const generator = new OpenApiGeneratorV3([
        ...characterRegistry.definitions,
        ...licenseRegistry.definitions,
        ...userRegistry.definitions,
        ...figureRegistry.definitions,
        ...materialRegistry.definitions,
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

