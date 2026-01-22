import {pclient} from "../../config/prisma.js";

import {License, Prisma} from "../../generated/prisma/client.js";


export class LicenseService {

    /**
     * Retrieve a license by its unique ID.
     * @returns The license or null if not found.
     */
    async getLicenseById(id: string): Promise<License | null> {
        return pclient.license.findUnique({
            where: { id }
        });
    }

    async getAllLicenses(): Promise<License[]> {
        return pclient.license.findMany();
    }

    /**
     * Retrieve a license by its unique Name.
     * @returns The license or null if not found.
     */
    async getLicenseByName(name: string): Promise<License | null> {
        return pclient.license.findUnique({
            where: { name }
        });
    }

    async createLicense(data: Prisma.LicenseCreateInput): Promise<License> {
        return pclient.license.create({
            data: data
        });
    }

    /**
     * Update an existing license.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async updateLicense(id: string, data: Prisma.LicenseUpdateInput): Promise<License> {
        return pclient.license.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a license.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async deleteLicense(id: string): Promise<License> {
        return pclient.license.delete({
            where: { id }
        });
    }

    /**
     * Find licenses with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("license"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("license")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 1)
     */
    async getLicenseBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<License[]> {
        return pclient.$queryRaw<License[]>`
            SELECT *
            FROM "license"
            WHERE similarity(name, ${name}) > ${threshold}
            LIMIT ${limit};
        `;
    }
}