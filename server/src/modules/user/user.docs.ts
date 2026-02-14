import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';

import {userResponseSchema, createUserSchema} from "./user.dto.js";
import {paramsIdSchema,} from "../../core/dtos/params_dto.js";
import {z} from "zod";

export const userRegistry = new OpenAPIRegistry();

/**
 * From Zod Schemas
 * @see {@link userResponseSchema} as OUTPUT
 * @see {@link createUserSchema} as INPUT (create/update)
 */
userRegistry.register('UserResponse', userResponseSchema);
userRegistry.register('CreateUserInput', createUserSchema);


userRegistry.registerPath({
    tags: ['Users'],
    method: 'get',
    path: '/users/{id}',
    summary: 'Get user by ID',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'User found',
            content: {
                'application/json': { schema: userResponseSchema },
            },
        },
        404: {
            description: 'User not found',
        }
    },
});

userRegistry.registerPath({
    tags: ['Users'],
    method: 'get',
    path: '/users',
    summary: 'Get all users',
    request: {},
    responses: {
        200: {
            description: 'List of Users',
            content: {
                'application/json': { schema: z.array(userResponseSchema) },
            },
        },
    },
});

userRegistry.registerPath({
    tags: ['Users'],
    method: 'post',
    path: '/users',
    summary: 'Create a user',
    request: {
        body: {
            content: { 'application/json': { schema: createUserSchema } },
        },
    },
    responses: {
        201: {
            description: 'Created with success',
            content: {
                'application/json': { schema: userResponseSchema },
            },
        },
    },
});


userRegistry.registerPath({
    tags: ['Users'],
    method: 'patch',
    path: '/users/{id}',
    summary: 'Update a user',
    request: {
        params: paramsIdSchema,
        body: {
            content: { 'application/json': { schema: createUserSchema } },
        },
    },
    responses: {
        200: {
            description: 'Updated with success',
            content: {
                'application/json': { schema: userResponseSchema },
            },
        },
        404: {
            description: 'User not found',
        }
    },
});

userRegistry.registerPath({
    tags: ['Users'],
    method: 'delete',
    path: '/users/{id}',
    summary: 'Delete a user',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        204: {
            description: 'Deleted with success',
        },
        404: {
            description: 'User not found',
        }
    },
});