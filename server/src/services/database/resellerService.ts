import {pclient} from "../../config/prisma.js";
import {Reseller, Prisma} from "../../generated/prisma/client.js";

export class ResellerService {

    /**
     * Retrieve a Reseller by its unique ID.
     */
    async getResellerById(id: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve a Reseller by its unique Domain.
     */
    async getResellerByDomain(domain: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { domain }
        });
    }

    /**
     * Retrieve a Reseller by its unique Name.
     */
    async getResellerByName(name: string): Promise<Reseller | null> {
        return pclient.reseller.findUnique({
            where: { name }
        });
    }

    /**
     * Retrieve all Resellers.
     */
    async getAllResellers(): Promise<Reseller[]> {
        return pclient.reseller.findMany();
    }

    /**
     * Create a new Reseller.
     */
    async createReseller(data: Prisma.ResellerCreateInput): Promise<Reseller> {
        return pclient.reseller.create({
            data: data
        });
    }

    /**
     * Update an existing Reseller.
     */
    async updateReseller(id: string, data: Prisma.ResellerUpdateInput): Promise<Reseller> {
        return pclient.reseller.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Reseller.
     */
    async deleteReseller(id: string): Promise<Reseller> {
        return pclient.reseller.delete({
            where: { id }
        });
    }

    /**
     * Find Reseller with exact name matching.
     * @param name
     */
    async getResellerByExactName(name: string): Promise<Reseller| null> {
        return pclient.reseller.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
        });
    }

    /**
     * Find Resellers with similar names using trigram similarity (PostgreSQL pg_trgm).
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
     */
    async getResellerBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Reseller[]> {
        // Attention : La table s'appelle "reseller" en base (défini par @@map("reseller"))
        return pclient.$queryRaw<Reseller[]>`
            SELECT *
            FROM "reseller"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }
}