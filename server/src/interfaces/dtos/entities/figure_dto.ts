import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {
    Character,
    Editor,
    Figure,
    FigureListing,
    FigureMedia,
    License,
    Material,
    Media,
    Range,
    Reseller,
} from "../../../generated/prisma/client.js";
import {StorageService} from "../../../services/storageService.js";

extendZodWithOpenApi(z)

/**
 * INPUT DTO: create a new Figure
 */
export const createFigureSchema = z.object({
    name: z.string().min(1).trim(),

    scale: z.string().optional(),
    height: z.number().optional(),
    unit: z.string().optional(),

    editor_id: z.uuid(),
    range_id: z.uuid().optional(),

    gtin13: z.string().optional(),

    release_date: z.coerce.date().optional(),
    // color
    commentary: z.string().optional()
})

export type CreateFigureDTO = z.infer<typeof createFigureSchema>;

const miniEditorSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

const miniRangeSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

const miniCharacterSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    license_id: z.uuid(),
})

const miniLicenseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

const miniMaterialSchema = z.object({
    id: z.uuid(),
    name: z.string(),
})

const miniResellerSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    domain: z.string().optional(),
    url: z.string().optional(),
})

const figureImageSchema = z.object({
    url: z.string().url(),
    priority: z.number().int(),
})

const figureListingSchema = z.object({
    id: z.uuid(),
    reseller_id: z.uuid(),
    figure_id: z.uuid(),
    price: z.number(),
    currency: z.string().nullable().optional(),
    ref: z.string().nullable().optional(),
    url: z.string(),
    description: z.string().nullable().optional(),
    images_urls: z.array(z.string()).optional(),
    reseller: miniResellerSchema.nullable().optional(),
})

/**
 * OUTPUT DTO: Figure response
 */
export const figureResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    range_id: z.uuid().nullable(),
    editor_id: z.uuid().nullable(),

    scale: z.string().nullable().optional(),
    height: z.number().nullable().optional(),
    unit: z.string().nullable().optional(),
    gtin13: z.string().nullable().optional(),
    release_date: z.string().datetime().nullable().optional(),
    commentary: z.string().nullable().optional(),

    editor: miniEditorSchema.nullable().optional(),
    ranges: miniRangeSchema.nullable().optional(),

    characters: z.array(miniCharacterSchema).optional(),
    licenses: z.array(miniLicenseSchema).optional(),
    materials: z.array(miniMaterialSchema).optional(),

    images: z.array(figureImageSchema).optional(),
    listings: z.array(figureListingSchema).optional(),
})

export type FigureResponse = z.infer<typeof figureResponseSchema>;

/**
 * OUTPUT toDTO: Figure response
 */
type FigureMediaInput = FigureMedia & { media?: Media | null }
type FigureCharacterInput = Character & { license?: License | null }
type FigureListingInput = FigureListing & { reseller?: Reseller | null }

export type FigureInput = Figure & {
    images?: FigureMediaInput[]
    editor?: Editor | null
    ranges?: Range | null
    characters?: FigureCharacterInput[]
    materials?: Material[]
    listings?: FigureListingInput[]
};

function toImageDTO(image: FigureMediaInput) {
    if (!image.media) {
        return null
    }

    return {
        url: StorageService.getPublicUrl(
            image.media.hash,
            image.media.extension,
            image.media.folder
        ),
        priority: image.priority,
    }
}

export const toFigureDTO = (source: FigureInput): FigureResponse => {
    const characters = source.characters?.map((character) => ({
        id: character.id,
        name: character.name,
        license_id: character.license_id,
    })) ?? []

    const licensesById = new Map<string, { id: string; name: string }>()

    source.characters?.forEach((character) => {
        if (character.license) {
            licensesById.set(character.license.id, {
                id: character.license.id,
                name: character.license.name,
            })
        }
    })

    const materials = source.materials?.map((material) => ({
        id: material.id,
        name: material.name,
    })) ?? []

    const images = source.images
        ?.map(toImageDTO)
        .filter((image): image is NonNullable<typeof image> => image !== null) ?? []

    const listings = source.listings?.map((listing) => ({
        id: listing.id,
        reseller_id: listing.reseller_id,
        figure_id: listing.figure_id,
        price: listing.price,
        currency: listing.currency,
        ref: listing.ref,
        url: listing.url,
        description: listing.description,
        images_urls: listing.images_urls,
        reseller: listing.reseller
            ? {
                id: listing.reseller.id,
                name: listing.reseller.name,
                domain: listing.reseller.domain,
                url: listing.reseller.url,
            }
            : null,
    })) ?? []

    return {
        id: source.id,
        name: source.name,
        range_id: source.range_id,
        editor_id: source.editor_id,

        scale: source.scale,
        height: source.height,
        unit: source.unit,
        gtin13: source.gtin13,
        release_date: source.release_date ? source.release_date.toISOString() : null,
        commentary: source.commentary,

        editor: source.editor
            ? {
                id: source.editor.id,
                name: source.editor.name,
            }
            : null,
        ranges: source.ranges
            ? {
                id: source.ranges.id,
                name: source.ranges.name,
            }
            : null,

        characters,
        licenses: Array.from(licensesById.values()),
        materials,
        images,
        listings,
    };
};
