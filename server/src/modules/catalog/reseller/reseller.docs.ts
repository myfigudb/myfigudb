import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";
import {resellerResponseSchema, createResellerSchema} from "./reseller.dto.js";
import {paramsIdSchema, paramsNameSchema} from "../../../core/dtos/params_dto.js";

export const resellerRegistry = new OpenAPIRegistry();
const errorResponseSchema = z.object({ message: z.string() });

resellerRegistry.register('ResellerResponse', resellerResponseSchema);
resellerRegistry.register('CreateResellerInput', createResellerSchema);

resellerRegistry.registerPath({
    method: 'get',
    path: '/resellers/{id}',
    tags: ['Resellers'],
    summary: 'Get reseller by ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Found', content: { 'application/json': { schema: resellerResponseSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

resellerRegistry.registerPath({
    method: 'get',
    path: '/resellers/search/{name}',
    tags: ['Resellers'],
    summary: 'Search reseller',
    request: { params: paramsNameSchema },
    responses: {
        200: { description: 'List', content: { 'application/json': { schema: z.array(resellerResponseSchema) } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

resellerRegistry.registerPath({
    method: 'post',
    path: '/resellers',
    tags: ['Resellers'],
    summary: 'Create reseller',
    request: { body: { content: { 'application/json': { schema: createResellerSchema } } } },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: resellerResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});