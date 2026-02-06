import { z } from "zod";

const CommaList = z.string().optional().transform((val) => {
    if (!val || val.trim() === "") return undefined;
    return val.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
});

/**
 * Exemple URL : ?price_filters=EUR:10:50:auto,USD:20:100:strict
 */
type PriceFilter = {
    currency: string;
    min: number | undefined;
    max: number | undefined;
    conversion: boolean;
};

const PriceFilter = z.string().optional().transform((val) => {
    if (!val || val.trim() === "") return [];

    const raw_filters = val.split(",");

    return raw_filters.map((filter_str): PriceFilter | null => {
        const parts = filter_str.split(":").map(s => s.trim());

        if (parts.length < 4) return null;

        const [currency, min_str, max_str, conversion_str] = parts;

        if (!["EUR", "USD", "JPY", "GBP"].includes(currency)) return null;

        const min = min_str === "" ? undefined : Number(min_str);
        const max = max_str === "" ? undefined : Number(max_str);

        if (min !== undefined && Number.isNaN(min)) return null;
        if (max !== undefined && Number.isNaN(max)) return null;

        const conversion = (conversion_str || "").toLowerCase() === "auto";

        return { currency, min, max, conversion };

    }).filter((f): f is PriceFilter => f !== null);
});

export const FigureSearchSchema = z.object({
    q: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),

    sort_by: z.enum(["price", "rating", "name", "created_at", "release_date"]).default("name"),
    sort_dir: z.enum(["asc", "desc"]).default("asc"),

    price_filters: PriceFilter,

    min_rating: z.coerce.number().min(0).max(10).optional(),

    series_ids: CommaList,
    license_ids: CommaList,
    editor_ids: CommaList,
    character_ids: CommaList,
    materials_ids: CommaList,
})
    .transform((data) => ({
        meta: {
            page: data.page,
            limit: data.limit,
            query: data.q,
        },
        sorting: {
            field: data.sort_by,
            direction: data.sort_dir,
        },
        filters: {
            pricing: data.price_filters,

            min_rating: data.min_rating,
            series: data.series_ids,
            licenses: data.license_ids,
            editors: data.editor_ids,
            characters: data.character_ids,
            materials: data.materials_ids,
        },
    }));

export type FigureSearchDTO = z.infer<typeof FigureSearchSchema>;