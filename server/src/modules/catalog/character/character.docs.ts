import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {characterResponseSchema, createCharacterSchema} from "./character.dto.js";
import {paramsIdSchema} from "../../../core/dtos/params_dto.js";
import {z} from "zod";

export const characterRegistry = new OpenAPIRegistry();


/**
 * From Zod Schemas
 * @see {@link characterResponseSchema} as OUTPUT
 * @see {@link createCharacterSchema} as INPUT (create)
 */
characterRegistry.register('CharacterResponse', characterResponseSchema);
characterRegistry.register('CreateCharacterInput', createCharacterSchema);


characterRegistry.registerPath({
    tags: ['Character'],
    method: 'get',
    path: '/characters/{id}',
    summary: 'Get character data (includes media URLs)',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'Character found',
            content: {
                'application/json': { schema: characterResponseSchema },
            },
        },
        404: {
            description: 'Character not found',
        }
    },
});

characterRegistry.registerPath({
    tags: ['Character'],
    method: 'get',
    path: '/characters',
    summary: 'Get all characters data (includes media URLs)',
    request: {

    },
    responses: {
        200: {
            description: 'List of Characters',
            content: {
                'application/json': { schema: z.array(characterResponseSchema) },
            },
        },
    },
});

characterRegistry.registerPath({
    tags: ['Character'],
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

characterRegistry.registerPath({
    tags: ['Character'],
    method: 'patch',
    path: '/characters/{id}',
    summary: 'Update a character',
    request: {
        params: paramsIdSchema,
        body: {
            content: { 'application/json': { schema: createCharacterSchema } },
        },
    },
    responses: {
        200: {
            description: 'Updated with success',
            content: {
                'application/json': { schema: characterResponseSchema },
            },
        },
        404: {
            description: 'Character not found',
        }
    },
});


characterRegistry.registerPath({
    tags: ['Character'],
    method: 'delete',
    path: '/characters/{id}',
    summary: 'Delete a character',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        204: {
            description: 'Deleted with success',
        },
        404: {
            description: 'Character not found',
        }
    },
});

//TODO DTO FILE MEDIA
characterRegistry.registerPath({
    tags: ['Character'],
    method: 'post',
    path: '/characters/{id}/medias',
    summary: 'Add medias to a character',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'Added with success',
            content: {
                'application/json': { schema: characterResponseSchema },
            },
        },
    },
});