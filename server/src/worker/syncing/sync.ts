import {FigureResolver} from "./figure/figureResolver.js";
import {ListingService} from "../../services/database/listingService.js";

import {ResellerService} from "../../services/database/resellerService.js";
import {FigurePageScrapDTO} from "../../interfaces/dtos/scrap_dto.js";

export class Sync {

    constructor(
        private figureResolver: FigureResolver,
        private listingService: ListingService
    ) {}

    async sync(fg: FigurePageScrapDTO) {
        const { figure: figure_dto, listing: listing_dto } = fg;

        try {
            const figure = await this.figureResolver.resolve(figure_dto);

            const reseller_service = new ResellerService();
            const reseller = await reseller_service.getResellerByDomain(listing_dto.scraped_on)

            if (!reseller) {
                throw new Error(`Impossible de créer le listing : Revendeur inconnu pour le domaine ${listing_dto.scraped_on}`);
            }

            console.log(`Figure Ready: ${figure.name} (ID: ${figure.id})`);

            console.log("Creating Listing...");
            const { scraped_at, scraped_on, ...listing_data } = listing_dto;

            await this.listingService.createListing({
                ...listing_data,
                reseller_id: reseller.id,
                figure_id: figure.id,
                raw: fg,
            });

            console.log("Ingestion Complete!");

        } catch (e) {
            console.error("Error during ingestion transaction:", e);
        }
    }
}

