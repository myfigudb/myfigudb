import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";

import {figureResponseSchema, createFigureSchema} from "./figure.dto.js";
import {paramsIdSchema, paramsNameSchema} from "@core/dtos/params_dto.js";

export const figureRegistry = new OpenAPIRegistry();

// Schéma d'erreur générique
const errorResponseSchema = z.object({
    message: z.string()
});

figureRegistry.register('FigureResponse', figureResponseSchema);
figureRegistry.register('CreateFigureInput', createFigureSchema);
figureRegistry.register('ErrorResponse', errorResponseSchema);

// --- CRUD ---

figureRegistry.registerPath({
    method: 'get',
    path: '/figures/{id}',
    tags: ['Figures'],
    summary: 'Get figure by ID (includes images, tags, characters)',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Figure found', content: { 'application/json': { schema: figureResponseSchema } } },
        400: { description: 'Invalid ID format', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Figure not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

figureRegistry.registerPath({
    method: 'get',
    path: '/figures',
    tags: ['Figures'],
    summary: 'Get all figures',
    responses: {
        200: { description: 'List of Figures', content: { 'application/json': { schema: z.array(figureResponseSchema) } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

figureRegistry.registerPath({
    method: 'post',
    path: '/figures',
    tags: ['Figures'],
    summary: 'Create a figure',
    request: {
        body: { content: { 'application/json': { schema: createFigureSchema } } },
    },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: figureResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

figureRegistry.registerPath({
    method: 'patch',
    path: '/figures/{id}',
    tags: ['Figures'],
    summary: 'Update a figure',
    request: {
        params: paramsIdSchema,
        body: { content: { 'application/json': { schema: createFigureSchema } } },
    },
    responses: {
        200: { description: 'Updated', content: { 'application/json': { schema: figureResponseSchema } } },
        400: { description: 'Validation Error or Invalid ID', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Figure not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

figureRegistry.registerPath({
    method: 'delete',
    path: '/figures/{id}',
    tags: ['Figures'],
    summary: 'Delete a figure',
    request: { params: paramsIdSchema },
    responses: {
        204: { description: 'Deleted' },
        400: { description: 'Invalid ID format', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Figure not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

// --- SEARCH ---

figureRegistry.registerPath({
    method: 'get',
    path: '/figures/search/{name}',
    tags: ['Figures'],
    summary: 'Search figures by similarity',
    request: { params: paramsNameSchema },
    responses: {
        200: { description: 'Matching figures', content: { 'application/json': { schema: z.array(figureResponseSchema) } } },
        404: { description: 'No figures found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

// --- IMAGES ---

figureRegistry.registerPath({
    method: 'post',
    path: '/figures/{id}/images',
    tags: ['Figures'],
    summary: 'Upload images for a figure',
    request: {
        params: paramsIdSchema,
        body: {
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            images: { type: 'array', items: { type: 'string', format: 'binary' } },
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: { description: 'Images uploaded', content: { 'application/json': { schema: figureResponseSchema } } },
        400: { description: 'No files uploaded', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Figure not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});