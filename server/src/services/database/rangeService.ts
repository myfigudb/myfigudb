import {pclient} from "../../config/prisma.js";
import {Range, Prisma} from "../../generated/prisma/client.js";

export class RangeService {

    /**
     * Retrieve a Range by its unique ID.
     * Includes the Editor data.
     */
    async getRangeById(id: string): Promise<Range | null> {
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
    async getRangeByName(name: string): Promise<Range | null> {
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
    async getRangesByEditorId(editorId: string): Promise<Range[]> {
        return pclient.range.findMany({
            where: { editor_id: editorId } // Attention au nom du champ dans ton model (editor_id)
        });
    }

    /**
     * Retrieve all Ranges.
     */
    async getAllRanges(): Promise<Range[]> {
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
    async createRange(data: Prisma.RangeCreateInput): Promise<Range> {
        return pclient.range.create({
            data: data
        });
    }

    /**
     * Update an existing Range.
     */
    async updateRange(id: string, data: Prisma.RangeUpdateInput): Promise<Range> {
        return pclient.range.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Range.
     */
    async deleteRange(id: string): Promise<Range> {
        return pclient.range.delete({
            where: { id }
        });
    }

    /**
     * Find Ranges with similar names using trigram similarity.
     * IMPORTANT: Table name is "series" due to @@map("series")
     */
    async getRangeBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Range[]> {
        return pclient.$queryRaw<Range[]>`
            SELECT *
            FROM "series"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }
}