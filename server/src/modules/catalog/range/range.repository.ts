import { pclient } from "../../../core/config/prisma.js";
import { Range, Prisma } from "../../../generated/prisma/client.js";

export class RangeRepository {

    /**
     * Retrieve a Range by its unique ID.
     * Includes the Editor data.
     */
    async getById(id: string): Promise<Range | null> {
        return pclient.range.findUnique({
            where: { id },
            include: {
                editor: true
            }
        });
    }

    /**
     * Retrieve a Range by its Name.
     * Since name is not unique in schema, we take the first match.
     */
    async getByName(name: string): Promise<Range | null> {
        return pclient.range.findFirst({
            where: { name },
            include: {
                editor: true
            }
        });
    }

    /**
     * Retrieve all Ranges linked to a specific Editor.
     */
    async getByEditorId(editorId: string): Promise<Range[]> {
        return pclient.range.findMany({
            where: { editorId: editorId }
        });
    }

    /**
     * Retrieve all Ranges.
     */
    async getAll(): Promise<Range[]> {
        return pclient.range.findMany({
            include: {
                editor: true
            }
        });
    }

    /**
     * Create a new Range.
     * Data must include editor_id or connection to Editor.
     */
    async create(data: Prisma.RangeUncheckedCreateInput): Promise<Range> {
        return pclient.range.create({
            data: data
        });
    }

    /**
     * Update an existing Range.
     */
    async update(id: string, data: Prisma.RangeUpdateInput): Promise<Range> {
        return pclient.range.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Range.
     */
    async delete(id: string): Promise<Range> {
        return pclient.range.delete({
            where: { id }
        });
    }

    /**
     * Find ranges with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("series"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("series")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
     */
    async getBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Range[]> {
        return pclient.$queryRaw<Range[]>`
            SELECT *
            FROM "range"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }
}