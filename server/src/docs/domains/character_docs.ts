import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {characterResponseSchema, createCharacterSchema} from "../../interfaces/dtos/entities/character_dto.js";
import {paramsIdSchema} from "../../interfaces/dtos/params_dto.js";

export const characterRegistry = new OpenAPIRegistry();


/**
 * From Zod Schemas
 * @see {@link characterResponseSchema} as OUTPUT
 * @see {@link createCharacterSchema} as INPUT (create)
 */
characterRegistry.register('CharacterResponse', characterResponseSchema);
characterRegistry.register('CreateCharacterInput', createCharacterSchema);



characterRegistry.registerPath({
    method: 'get',
    path: '/characters/{id}',
    summary: 'Get character data (includes media URLs)',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'Character',
            content: {
                'application/json': { schema: characterResponseSchema },
            },
        },
    },
});

characterRegistry.registerPath({
    method: 'post',
    path: '/characters',
    summary: 'Create a character',
    request: {
        body: {
            content: { 'application/json': { schema: createCharacterSchema } },
        },
    },
    responses: {
        201: {
            description: 'Created with success',
            content: {
                'application/json': { schema: characterResponseSchema },
            },
        },
    },
});