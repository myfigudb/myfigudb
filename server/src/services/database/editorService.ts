import {pclient} from "../../config/prisma.js";
import {Editor, License, Prisma} from "../../generated/prisma/client.js";

export class EditorService {

    /**
     * Retrieve an Editor by its unique ID.
     */
    async getEditorById(id: string): Promise<Editor | null> {
        return pclient.editor.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve an Editor by its unique ID.
     */
    async getEditorByName(name: string): Promise<Editor | null> {
        return pclient.editor.findFirst({
            where: { name }
        });
    }

    /**
     * Retrieve all Editors.
     */
    async getAllEditors(): Promise<Editor[]> {
        return pclient.editor.findMany();
    }

    /**
     * Create a new Editor.
     */
    async createEditor(data: Prisma.EditorCreateInput): Promise<Editor> {
        return pclient.editor.create({
            data: data
        });
    }

    /**
     * Update an existing Editor.
     */
    async updateEditor(id: string, data: Prisma.EditorUpdateInput): Promise<Editor> {
        return pclient.editor.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete an Editor.
     */
    async deleteEditor(id: string): Promise<Editor> {
        return pclient.editor.delete({
            where: { id }
        });
    }

    async geEditorBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Editor[]> {
        return pclient.$queryRaw<Editor[]>`
            SELECT *
            FROM "editor"
            WHERE similarity(name, ${name}) > ${threshold}
            LIMIT ${limit};
        `;
    }
}