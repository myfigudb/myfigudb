import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";
import {materialResponseSchema, createMaterialSchema} from "./material.dto.js";
import {paramsNameSchema} from "@core/dtos/params_dto.js";

export const materialRegistry = new OpenAPIRegistry();

const errorResponseSchema = z.object({ message: z.string() });

materialRegistry.register('MaterialResponse', materialResponseSchema);
materialRegistry.register('CreateMaterialInput', createMaterialSchema);

materialRegistry.registerPath({
    method: 'get',
    path: '/material/{name}',
    tags: ['Material'],
    summary: 'Get material by Name',
    request: { params: paramsNameSchema },
    responses: {
        200: { description: 'Material found', content: { 'application/json': { schema: materialResponseSchema } } },
        404: { description: 'Not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

materialRegistry.registerPath({
    method: 'get',
    path: '/material',
    tags: ['Material'],
    summary: 'Get all materials',
    responses: {
        200: { description: 'List of Materials', content: { 'application/json': { schema: z.array(materialResponseSchema) } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

materialRegistry.registerPath({
    method: 'post',
    path: '/material',
    tags: ['Material'],
    summary: 'Create a material',
    request: {
        body: { content: { 'application/json': { schema: createMaterialSchema } } },
    },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: materialResponseSchema } } },
        400: { description: 'Validation Error (or name taken)', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

materialRegistry.registerPath({
    method: 'patch',
    path: '/material/{name}',
    tags: ['Material'],
    summary: 'Update a material by Name',
    request: {
        params: paramsNameSchema,
        body: { content: { 'application/json': { schema: createMaterialSchema } } },
    },
    responses: {
        200: { description: 'Updated', content: { 'application/json': { schema: materialResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

materialRegistry.registerPath({
    method: 'delete',
    path: '/material/{name}',
    tags: ['Material'],
    summary: 'Delete a material by Name',
    request: { params: paramsNameSchema },
    responses: {
        204: { description: 'Deleted' },
        404: { description: 'Not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});