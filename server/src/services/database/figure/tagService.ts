import { pclient } from "../../../config/prisma.js";
import { Tag, Prisma } from "../../../generated/prisma/client.js";

export class TagService {

    /**
     * Retrieve a Tag by its unique ID.
     */
    async getTagById(id: string): Promise<Tag | null> {
        return pclient.tag.findUnique({
            where: { id }
        });
    }

    /**
     * Get all tags available in the database.
     */
    async getAllTags(): Promise<Tag[]> {
        return pclient.tag.findMany({
            orderBy: { label: 'asc' }
        });
    }

    /**
     * Create a new tag.
     * The label is cleaned (trimmed) before insertion.
     */
    async createTag(label: string, created_by: string): Promise<Tag> {
        return pclient.tag.create({
            data: {
                label: label.trim(),
            }
        });
    }

    /**
     * Update a tag label.
     */
    async updateTag(id: string, new_label: string): Promise<Tag> {
        return pclient.tag.update({
            where: { id },
            data: { label: new_label.trim() }
        });
    }

    /**
     * Delete a tag from the reference table.
     */
    async deleteTag(id: string): Promise<Tag> {
        return pclient.tag.delete({
            where: { id }
        });
    }

    /**
     * Check if a tag exists by its label (case insensitive).
     */
    async existsTag(label: string): Promise<boolean> {
        const count = await pclient.tag.count({
            where: {
                label: {
                    equals: label.trim(),
                    mode: 'insensitive'
                }
            }
        });
        return count > 0;
    }

    /**
     * Find tags with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("tag"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("tag")
     *
     * @param label          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
     */
    async getTagsBySimilarity(label: string, threshold: number = 0.3, limit: number = 10): Promise<Tag[]> {
        return pclient.$queryRaw<Tag[]>`
            SELECT *
            FROM "tag"
            WHERE similarity(label, ${label}) > ${threshold}
            ORDER BY similarity(label, ${label}) DESC
            LIMIT ${limit};
        `;
    }

    /**
     * Search tags by exact label.
     */
    async getTagByLabel(label: string): Promise<Tag | null> {
        return pclient.tag.findUnique({
            where: { label: label.trim() }
        });
    }

    /**
     * Search tags that start with a specific string.
     * Used for autocomplete when a user is typing a new tag.
     *
     * @param prefix The beginning of the tag label
     * @param limit  Maximum number of suggestions
     */
    async getTagsStartingWith(prefix: string, limit: number = 10): Promise<Tag[]> {
        return pclient.tag.findMany({
            where: {
                label: {
                    startsWith: prefix.trim(),
                    mode: 'insensitive'
                }
            },
            take: limit,
            orderBy: {
                label: 'asc'
            }
        });
    }
}