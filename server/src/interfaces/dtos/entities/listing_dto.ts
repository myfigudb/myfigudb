import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {FigureListing, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "./character_dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Listing
 */
export const createListingSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateListingDTO = z.infer<typeof createListingSchema>;


/**
 * OUTPUT DTO: Listing response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toListingDTO
 */
export const listingResponseSchema = z.object({
    id: z.uuid(),
})

export type ListingResponse = z.infer<typeof listingResponseSchema>;


/**
 * OUTPUT toDTO: Listing response
 */
export type ListingInput = FigureListing;

export const toListingDTO = (source: ListingInput): ListingResponse => {
    return {
        id: source.id
    };
};
