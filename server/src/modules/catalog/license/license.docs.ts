import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";

import {paramsIdSchema, paramsNameSchema} from "../../../interfaces/dtos/params_dto.js";
import {createLicenseSchema, licenseResponseSchema} from "./license.dto.js";

export const licenseRegistry = new OpenAPIRegistry();


/**
 * From Zod Schemas
 * @see {@link licenseResponseSchema} as OUTPUT
 * @see {@link createLicenseSchema} as INPUT (create)
 */
licenseRegistry.register('LicenseResponse', licenseResponseSchema);
licenseRegistry.register('CreateLicenseInput', createLicenseSchema);



licenseRegistry.registerPath({
    tags: ['License'],
    method: 'get',
    path: '/licenses/{id}',
    summary: 'Get license data',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'License',
            content: {
                'application/json': { schema: licenseResponseSchema },
            },
        },
    },
});

licenseRegistry.registerPath({
    tags: ['License'],
    method: 'get',
    path: '/licenses',
    summary: 'Get all licenses data',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        200: {
            description: 'Licenses',
            content: {
                'application/json': { schema: z.array(licenseResponseSchema) },
            },
        },
    },
});

licenseRegistry.registerPath({
    tags: ['License'],
    method: 'get',
    path: '/licenses/search/{name}',
    summary: 'Get license data using name search',
    request: {
        params: paramsNameSchema,
    },
    responses: {
        200: {
            description: 'License',
            content: {
                'application/json': { schema: licenseResponseSchema },
            },
        },
    },
});

licenseRegistry.registerPath({
    tags: ['License'],
    method: 'delete',
    path: '/licenses/{id}',
    summary: 'Delete a license',
    request: {
        params: paramsIdSchema,
    },
    responses: {
        204: {
            description: 'License',
            content: {
                'application/json': { schema: licenseResponseSchema },
            },
        },
    },
});


licenseRegistry.registerPath({
    tags: ['License'],
    method: 'post',
    path: '/licenses',
    summary: 'Create a license',
    request: {
        body: {
            content: { 'application/json': { schema: createLicenseSchema } },
        },
    },
    responses: {
        201: {
            description: 'Created with success',
            content: {
                'application/json': { schema: licenseResponseSchema },
            },
        },
    },
});

licenseRegistry.registerPath({
    tags: ['License'],
    method: 'patch',
    path: '/licenses',
    summary: 'Update a license',
    request: {
        params: paramsIdSchema,
        body: {
            content: { 'application/json': { schema: createLicenseSchema } },
        },
    },
    responses: {
        200: {
            description: 'Updated with success',
            content: {
                'application/json': { schema: licenseResponseSchema },
            },
        },
    },
});