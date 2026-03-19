export type SearchViewMode = 'cards' | 'list' | 'table'

export type FigureSearchSort =
    | 'relevance'
    | 'name-asc'
    | 'name-desc'
    | 'license-asc'
    | 'license-desc'
    | 'character-asc'
    | 'character-desc'
    | 'editor-asc'
    | 'series-asc'
    | 'rating-asc'
    | 'rating-desc'
    | 'price-asc'
    | 'price-desc'

export type FigureSearchFilterCategory =
    | 'price'
    | 'rating'
    | 'license'
    | 'character'
    | 'series'
    | 'editor'
    | 'size'
    | 'availability'
    | 'reseller'

export type FigureSearchFilters = {
    licenses: string[]
    characters: string[]
    series: string[]
    editors: string[]
    sizes: string[]
    availability: string[]
    resellers: string[]
    ratingMin: number | null
    priceMin: number | null
    priceMax: number | null
}

export type FigureFilterOptions = {
    licenses: string[]
    characters: string[]
    series: string[]
    editors: string[]
    sizes: string[]
    availability: string[]
    resellers: string[]
    minPrice: number | null
    maxPrice: number | null
    minRating: number | null
    maxRating: number | null
}

export function createEmptyFigureSearchFilters(): FigureSearchFilters {
    return {
        licenses: [],
        characters: [],
        series: [],
        editors: [],
        sizes: [],
        availability: [],
        resellers: [],
        ratingMin: null,
        priceMin: null,
        priceMax: null,
    }
}
