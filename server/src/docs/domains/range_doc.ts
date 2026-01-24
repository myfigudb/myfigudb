import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";
import {rangeResponseSchema, createRangeSchema} from "../../interfaces/dtos/entities/range_dto.js";
import {paramsIdSchema, paramsNameSchema} from "../../interfaces/dtos/params_dto.js";

export const rangeRegistry = new OpenAPIRegistry();
const errorResponseSchema = z.object({ message: z.string() });

rangeRegistry.register('RangeResponse', rangeResponseSchema);
rangeRegistry.register('CreateRangeInput', createRangeSchema);

rangeRegistry.registerPath({
    method: 'get',
    path: '/ranges/{id}',
    tags: ['Ranges'],
    summary: 'Get range by ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Found', content: { 'application/json': { schema: rangeResponseSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

rangeRegistry.registerPath({
    method: 'get',
    path: '/ranges/search/{name}',
    tags: ['Ranges'],
    summary: 'Search range',
    request: { params: paramsNameSchema },
    responses: {
        200: { description: 'List', content: { 'application/json': { schema: z.array(rangeResponseSchema) } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

rangeRegistry.registerPath({
    method: 'get',
    path: '/ranges/editor/{id}',
    tags: ['Ranges'],
    summary: 'Get ranges by Editor',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'List', content: { 'application/json': { schema: z.array(rangeResponseSchema) } } },
        404: { description: 'Editor Not Found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

rangeRegistry.registerPath({
    method: 'post',
    path: '/ranges',
    tags: ['Ranges'],
    summary: 'Create range',
    request: { body: { content: { 'application/json': { schema: createRangeSchema } } } },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: rangeResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});