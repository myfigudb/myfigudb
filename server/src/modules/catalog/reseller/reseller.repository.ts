import { pclient } from "../../../core/config/prisma.js";
import { Reseller, Prisma } from "../../../generated/prisma/client.js";

export class ResellerRepository {

    /**
     * Retrieve a Reseller by its unique ID.
     */
    async getById(id: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve a Reseller by its unique Domain.
     */
    async getByDomain(domain: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { domain }
        });
    }

    /**
     * Retrieve a Reseller by its unique Name.
     */
    async getByName(name: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { name }
        });
    }

    /**
     * Retrieve all Resellers.
     */
    async getAll(): Promise<Reseller[]> {
        return pclient.reseller.findMany();
    }

    /**
     * Create a new Reseller.
     */
    async create(data: Prisma.ResellerCreateInput): Promise<Reseller> {
        return pclient.reseller.create({
            data: data
        });
    }

    /**
     * Update an existing Reseller.
     */
    async update(id: string, data: Prisma.ResellerUpdateInput): Promise<Reseller> {
        return pclient.reseller.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Reseller.
     */
    async delete(id: string): Promise<Reseller> {
        return pclient.reseller.delete({
            where: { id }
        });
    }

    /**
     * Find resellers with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("reseller"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("reseller")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
     */
    async getBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Reseller[]> {
        return pclient.$queryRaw<Reseller[]>`
            SELECT *
            FROM "reseller"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }
}