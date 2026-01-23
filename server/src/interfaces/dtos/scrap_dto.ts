import { z } from 'zod';


export const ScrapSchema = z.object({
    url: z.httpUrl(),
    scraped_at: z.date().default(() => new Date()),

    name: z.string().min(1).trim(),

    gtin13: z.string().length(13).regex(/^\d+$/).nullable().optional()
        .describe("Code barre EAN/JAN à 13 chiffres. C'est la clé unique universelle pour lier les fiches."),

    ref: z.string().trim().optional()
        .describe("La référence interne du vendeur (SKU)"),

    price: z.number().min(0),
    currency: z.string().default('EUR'),
    in_stock: z.boolean().default(true),
    availability_label: z.string().optional(),

    editor: z.string().trim().optional(),
    range: z.string().trim().optional(),

    licenses: z.array(z.string().trim()).default([]),
    characters: z.array(z.string().trim()).default([]),

    scale: z.string().trim().optional(),
    height: z.number().int().optional()
        .describe("Hauteur normalisée en MILLIMÈTRES"),
    materials: z.array(z.string().trim()).default([]),

    release_date: z.string().optional(),

    images: z.array(z.httpUrl()).default([]),

    description: z.string().trim().optional()
});

export type ScrapDTO = z.infer<typeof ScrapSchema>;