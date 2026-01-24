import { z } from 'zod';

export const EditorScrapSchema = z.object({
    name: z.string().min(1).trim(),
    url: z.url().optional(),
});
export type EditorScrapDTO = z.infer<typeof EditorScrapSchema>;

export const RangeScrapSchema = z.object({
    name: z.string().min(1).trim()
});
export type RangeScrapDTO = z.infer<typeof RangeScrapSchema>;

export const LicenseScrapSchema = z.object({
    name: z.string().min(1).trim()
});
export type LicenseScrapDTO = z.infer<typeof LicenseScrapSchema>;

export const CharacterScrapSchema = z.object({
    name: z.string().min(1).trim()
});
export type CharacterScrapDTO = z.infer<typeof CharacterScrapSchema>;

export const MaterialScrapSchema = z.object({
    name: z.string().min(1).trim()
});
export type MaterialScrapDTO = z.infer<typeof MaterialScrapSchema>;



export const ListingScrapSchema = z.object({
    url: z.url(),
    scraped_at: z.date().default(() => new Date()),

    ref: z.string().trim().optional()
        .describe("La référence interne du vendeur (SKU)"),

    price: z.number().min(0),
    currency: z.string().default('EUR'),
    in_stock: z.boolean().default(true),
    availability_label: z.string().optional(),

    images: z.array(z.url()).default([]),

    description: z.string().trim().optional(),
});
export type ListingScrapDTO = z.infer<typeof ListingScrapSchema>;



export const FigureScrapSchema = z.object({
    name: z.string().min(1).trim(),

    gtin13: z.string().length(13).regex(/^\d+$/).nullable().optional()
        .describe("Code barre EAN/JAN à 13 chiffres."),

    release_date: z.string().optional(),

    editor: EditorScrapSchema.optional(),
    range: RangeScrapSchema.optional(),
    licenses: z.array(LicenseScrapSchema).default([]),
    characters: z.array(CharacterScrapSchema).default([]),
    materials: z.array(MaterialScrapSchema).default([]),

    scale: z.string().trim().optional(),
    height: z.number().int().optional()
        .describe("Hauteur normalisée en MILLIMÈTRES"),
});
export type FigureScrapDTO = z.infer<typeof FigureScrapSchema>;



export const FigurePageScrapSchema = z.object({
    listing: ListingScrapSchema,
    figure: FigureScrapSchema
});

export type FigurePageScrapDTO = z.infer<typeof FigurePageScrapSchema>;