import { pclient } from "@core/config/prisma.js";
import { FigureListing, Prisma } from "@db/client.js";

export class ListingRepository {

    /**
     * Retrieve a Listing by its unique ID.
     * Includes relationships: Figure (basic info) and Reseller.
     */
    async getById(id: string): Promise<FigureListing | null> {
        return pclient.figureListing.findUnique({
            where: { id },
            include: {
                figure: {
                    select: { id: true, name: true }
                },
                reseller: true
            }
        });
    }

    /**
     * Get all listings available in database.
     */
    async getAll(): Promise<FigureListing[]> {
        return pclient.figureListing.findMany({
            include: {
                reseller: true
            }
        });
    }

    /**
     * Create a new Listing.
     * Data must include connections to Figure and Reseller via IDs.
     */
    async create(data: Prisma.FigureListingUncheckedCreateInput): Promise<FigureListing> {
        return pclient.figureListing.create({
            data: data
        });
    }

    /**
     * Update an existing Listing (price, status, etc.).
     */
    async update(id: string, data: Prisma.FigureListingUpdateInput): Promise<FigureListing> {
        return pclient.figureListing.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Listing.
     */
    async delete(id: string): Promise<FigureListing> {
        return pclient.figureListing.delete({
            where: { id }
        });
    }
}