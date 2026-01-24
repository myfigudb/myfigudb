import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";
import {listingResponseSchema, createListingSchema} from "../../interfaces/dtos/entities/listing_dto.js";
import {paramsIdSchema} from "../../interfaces/dtos/params_dto.js";

export const listingRegistry = new OpenAPIRegistry();

const errorResponseSchema = z.object({ message: z.string() });

listingRegistry.register('ListingResponse', listingResponseSchema);
listingRegistry.register('CreateListingInput', createListingSchema);

listingRegistry.registerPath({
    method: 'get',
    path: '/listings/{id}',
    tags: ['Listings'],
    summary: 'Get listing by ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Listing found', content: { 'application/json': { schema: listingResponseSchema } } },
        400: { description: 'Invalid ID', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'get',
    path: '/listings',
    tags: ['Listings'],
    summary: 'Get all listings',
    responses: {
        200: { description: 'List of Listings', content: { 'application/json': { schema: z.array(listingResponseSchema) } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'get',
    path: '/listings/figure/{id}',
    tags: ['Listings'],
    summary: 'Get all listings for a specific Figure ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Listings found', content: { 'application/json': { schema: z.array(listingResponseSchema) } } },
        404: { description: 'Figure not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'get',
    path: '/listings/reseller/{id}',
    tags: ['Listings'],
    summary: 'Get all listings from a specific Reseller ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Listings found', content: { 'application/json': { schema: z.array(listingResponseSchema) } } },
        404: { description: 'Reseller not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'post',
    path: '/listings',
    tags: ['Listings'],
    summary: 'Create a listing',
    request: {
        body: { content: { 'application/json': { schema: createListingSchema } } },
    },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: listingResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'patch',
    path: '/listings/{id}',
    tags: ['Listings'],
    summary: 'Update a listing',
    request: {
        params: paramsIdSchema,
        body: { content: { 'application/json': { schema: createListingSchema } } },
    },
    responses: {
        200: { description: 'Updated', content: { 'application/json': { schema: listingResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        404: { description: 'Listing not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

listingRegistry.registerPath({
    method: 'delete',
    path: '/listings/{id}',
    tags: ['Listings'],
    summary: 'Delete a listing',
    request: { params: paramsIdSchema },
    responses: {
        204: { description: 'Deleted' },
        404: { description: 'Listing not found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});