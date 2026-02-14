import { pclient } from "../../../core/config/prisma.js";
import { Material, Prisma } from "../../../generated/prisma/client.js";

export class MaterialRepository {

    /**
     * Retrieve a Material by its unique Name.
     */
    async getByName(name: string): Promise<Material | null> {
        return pclient.material.findUnique({
            where: { name }
        });
    }

    /**
     * Retrieve all Materials.
     */
    async getAll(): Promise<Material[]> {
        return pclient.material.findMany();
    }

    /**
     * Create a new Material.
     */
    async create(data: Prisma.MaterialCreateInput): Promise<Material> {
        return pclient.material.create({
            data: data
        });
    }

    /**
     * Update an existing Material using its Name.
     */
    async update(name: string, data: Prisma.MaterialUpdateInput): Promise<Material> {
        return pclient.material.update({
            where: { name },
            data: data
        });
    }

    /**
     * Delete a Material using its Name.
     */
    async delete(name: string): Promise<Material> {
        return pclient.material.delete({
            where: { name }
        });
    }

    /**
     * Find Material with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("material"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("material")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 1)
     */
    async getBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Material[]> {
        return pclient.$queryRaw<Material[]>`
            SELECT *
            FROM "material"
            WHERE similarity(name, ${name}) > ${threshold}
            LIMIT ${limit};
        `;
    }
}