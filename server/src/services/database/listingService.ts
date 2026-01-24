import {pclient} from "../../config/prisma.js";
import {FigureListing, Prisma} from "../../generated/prisma/client.js";

export class ListingService {

    /**
     * Retrieve a Listing by its unique ID.
     * Includes relationships: Figure (basic info) and Reseller.
     */
    async getListingById(id: string): Promise<FigureListing | null> {
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
    async getAllListings(): Promise<FigureListing[]> {
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
    async createListing(data: Prisma.FigureListingCreateInput): Promise<FigureListing> {
        return pclient.figureListing.create({
            data: data
        });
    }

    /**
     * Update an existing Listing (price, status, etc.).
     */
    async updateListing(id: string, data: Prisma.FigureListingUpdateInput): Promise<FigureListing> {
        return pclient.figureListing.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Listing.
     */
    async deleteListing(id: string): Promise<FigureListing> {
        return pclient.figureListing.delete({
            where: { id }
        });
    }

    /**
     * Check if a listing exists.
     */
    async existsListing(id: string): Promise<boolean> {
        const count = await pclient.figureListing.count({
            where: { id }
        });
        return count > 0;
    }
}