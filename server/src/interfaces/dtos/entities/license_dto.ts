import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {License, Media} from "../../../generated/prisma/client.js";

import {CharacterInput} from "./character_dto.js";
extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new License
 */
export const createLicenseSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateLicenseDTO = z.infer<typeof createLicenseSchema>;


/**
 * OUTPUT DTO: License response
 * NOTE: DO NOT EXECUTE, TYPE DEFINITION FOR OPENAPI
 * @see toLicenseDTO
 */
export const licenseResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

export type LicenseResponse = z.infer<typeof licenseResponseSchema>;


/**
 * OUTPUT toDTO: License response
 */
export type LicenseInput = License;

export const toLicenseDTO = (source: LicenseInput): LicenseResponse => {
    return {
        id: source.id,
        name: source.name
    };
};
