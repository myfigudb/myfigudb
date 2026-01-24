import {OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {z} from "zod";
import {editorResponseSchema, createEditorSchema} from "../../interfaces/dtos/entities/editor_dto.js";
import {paramsIdSchema} from "../../interfaces/dtos/params_dto.js";

export const editorRegistry = new OpenAPIRegistry();
const errorResponseSchema = z.object({ message: z.string() });

editorRegistry.register('EditorResponse', editorResponseSchema);
editorRegistry.register('CreateEditorInput', createEditorSchema);

editorRegistry.registerPath({
    method: 'get',
    path: '/editors/{id}',
    tags: ['Editors'],
    summary: 'Get editor by ID',
    request: { params: paramsIdSchema },
    responses: {
        200: { description: 'Found', content: { 'application/json': { schema: editorResponseSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

editorRegistry.registerPath({
    method: 'get',
    path: '/editors',
    tags: ['Editors'],
    summary: 'Get all editors',
    responses: {
        200: { description: 'List', content: { 'application/json': { schema: z.array(editorResponseSchema) } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

editorRegistry.registerPath({
    method: 'post',
    path: '/editors',
    tags: ['Editors'],
    summary: 'Create editor',
    request: { body: { content: { 'application/json': { schema: createEditorSchema } } } },
    responses: {
        201: { description: 'Created', content: { 'application/json': { schema: editorResponseSchema } } },
        400: { description: 'Validation Error', content: { 'application/json': { schema: errorResponseSchema } } },
        500: { description: 'Error', content: { 'application/json': { schema: errorResponseSchema } } },
    },
});

// Ajoutez PATCH et DELETE si nécessaire avec le même modèle