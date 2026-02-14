import {pclient} from "../../../core/config/prisma.js";
import {Editor, Prisma} from "../../../generated/prisma/client.js";

export class EditorRepository {

    /**
     * Retrieve an Editor by its unique ID.
     */
    async findById(id: string): Promise<Editor | null> {
        return pclient.editor.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve an Editor by its unique ID.
     */
    async findByName(name: string): Promise<Editor | null> {
        return pclient.editor.findFirst({
            where: { name }
        });
    }

    /**
     * Retrieve all Editors.
     */
    async findAll(): Promise<Editor[]> {
        return pclient.editor.findMany();
    }

    /**
     * Create a new Editor.
     */
    async create(data: Prisma.EditorCreateInput): Promise<Editor> {
        return pclient.editor.create({
            data: data
        });
    }

    /**
     * Update an existing Editor.
     */
    async update(id: string, data: Prisma.EditorUpdateInput): Promise<Editor> {
        return pclient.editor.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete an Editor.
     */
    async delete(id: string): Promise<Editor> {
        return pclient.editor.delete({
            where: { id }
        });
    }

    /**
     * Find Editor with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("editor"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("editor")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 1)
     */
    async findBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Editor[]> {
        return pclient.$queryRaw<Editor[]>`
            SELECT *
            FROM "editor"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }
}