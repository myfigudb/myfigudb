import { FigureListing } from "../../../generated/prisma/client.js";
import {ListingRepository} from "./license.repository.js";
import {CreateListingDTO, UpdateListingDTO} from "./listing.dto.js";

export class ListingService {

    private repo = new ListingRepository();

    async getListingById(id: string): Promise<FigureListing | null> {
        return this.repo.getById(id);
    }

    async getAllListings(): Promise<FigureListing[]> {
        return this.repo.getAll();
    }

    //TODO FIX LISTING SCHEMA
    async createListing(dto: CreateListingDTO): Promise<FigureListing> {
        return this.repo.create({
            name: dto.name,
        });
    }

    //TODO FIX LISTING SCHEMA
    async updateListing(id: string, dto: UpdateListingDTO): Promise<FigureListing> {
        return this.repo.update(id, dto);
    }

    async deleteListing(id: string): Promise<FigureListing> {
        return this.repo.delete(id);
    }
}