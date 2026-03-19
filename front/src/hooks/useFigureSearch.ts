import { useEffect, useMemo, useState } from 'react'
import { figurineApi } from '../api/figurine.api'
import type { ApiFigure } from '../api/types'
import { useApiResource } from './useApiResource'
import type {
    FigureFilterOptions,
    FigureSearchFilters,
    FigureSearchSort,
} from '../types/search'
import {
    getFigureAvailabilityLabels,
    getFigureCharacterLabels,
    getFigureEditorLabel,
    getFigureLicenseLabels,
    getFigureMinimumPrice,
    getFigureResellerNames,
    getFigureScoreValue,
    getFigureSearchIndex,
    getFigureSeriesLabel,
    getFigureSizeLabel,
} from '../utils/figurine'

type UseFigureSearchOptions = {
    searchTerm: string
    filters: FigureSearchFilters
    sort: FigureSearchSort
    page: number
    pageSize: number
}

type UseFigureSearchResult = {
    pageResults: ApiFigure[]
    totalResults: number
    totalPages: number
    currentPage: number
    isLoading: boolean
    isHydrating: boolean
    error: string | null
    retry: () => void
    filterOptions: FigureFilterOptions
}

const figureDetailsCache = new Map<string, ApiFigure>()

function normalizeText(value: string) {
    return value.trim().toLowerCase()
}

function uniqueSorted(values: Array<string | null | undefined>) {
    return Array.from(
        new Set(
            values
                .filter((value): value is string => Boolean(value?.trim()))
                .map((value) => value.trim())
        )
    ).sort((left, right) => left.localeCompare(right))
}

function chunkValues<T>(values: T[], chunkSize: number) {
    const chunks: T[][] = []

    for (let index = 0; index < values.length; index += chunkSize) {
        chunks.push(values.slice(index, index + chunkSize))
    }

    return chunks
}

function matchesSelection(values: string[], selected: string[]) {
    if (!selected.length) {
        return true
    }

    const normalizedValues = values.map((value) => normalizeText(value))

    return selected.some((selectedValue) =>
        normalizedValues.includes(normalizeText(selectedValue))
    )
}

function compareNullableText(left: string | null | undefined, right: string | null | undefined) {
    const leftValue = left?.trim()
    const rightValue = right?.trim()

    if (!leftValue && !rightValue) {
        return 0
    }

    if (!leftValue) {
        return 1
    }

    if (!rightValue) {
        return -1
    }

    return leftValue.localeCompare(rightValue)
}

function compareNullableNumber(
    left: number | null | undefined,
    right: number | null | undefined
) {
    if (left === null || left === undefined) {
        return right === null || right === undefined ? 0 : 1
    }

    if (right === null || right === undefined) {
        return -1
    }

    return left - right
}

function buildFilterOptions(
    figures: ApiFigure[],
    referenceData: {
        licenses: string[]
        characters: string[]
        editors: string[]
    }
): FigureFilterOptions {
    const priceValues = figures.reduce<number[]>((values, figure) => {
        const nextValue = getFigureMinimumPrice(figure)
        if (nextValue !== null) {
            values.push(nextValue)
        }
        return values
    }, [])
    const ratingValues = figures.reduce<number[]>((values, figure) => {
        const nextValue = getFigureScoreValue(figure)
        if (nextValue !== null) {
            values.push(nextValue)
        }
        return values
    }, [])

    return {
        licenses: uniqueSorted([
            ...referenceData.licenses,
            ...figures.flatMap((figure) => getFigureLicenseLabels(figure)),
        ]),
        characters: uniqueSorted([
            ...referenceData.characters,
            ...figures.flatMap((figure) => getFigureCharacterLabels(figure)),
        ]),
        series: uniqueSorted(figures.map((figure) => getFigureSeriesLabel(figure))),
        editors: uniqueSorted([
            ...referenceData.editors,
            ...figures.map((figure) => getFigureEditorLabel(figure)),
        ]),
        sizes: uniqueSorted(figures.map((figure) => getFigureSizeLabel(figure))),
        availability: uniqueSorted(
            figures.flatMap((figure) => getFigureAvailabilityLabels(figure))
        ),
        resellers: uniqueSorted(
            figures.flatMap((figure) => getFigureResellerNames(figure))
        ),
        minPrice: priceValues.length ? Math.min(...priceValues) : null,
        maxPrice: priceValues.length ? Math.max(...priceValues) : null,
        minRating: ratingValues.length ? Math.min(...ratingValues) : null,
        maxRating: ratingValues.length ? Math.max(...ratingValues) : null,
    }
}

function sortFigures(
    figures: ApiFigure[],
    sort: FigureSearchSort,
    similarityRank: Map<string, number>,
    searchTerm: string
) {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const sortedFigures = [...figures]

    sortedFigures.sort((left, right) => {
        if (sort === 'relevance') {
            if (normalizedSearch) {
                const leftRank = similarityRank.get(left.id) ?? Number.POSITIVE_INFINITY
                const rightRank = similarityRank.get(right.id) ?? Number.POSITIVE_INFINITY

                if (leftRank !== rightRank) {
                    return leftRank - rightRank
                }

                const leftStartsWith = left.name.toLowerCase().startsWith(normalizedSearch)
                const rightStartsWith = right.name.toLowerCase().startsWith(normalizedSearch)

                if (leftStartsWith !== rightStartsWith) {
                    return leftStartsWith ? -1 : 1
                }
            }

            return left.name.localeCompare(right.name)
        }

        if (sort === 'name-asc') {
            return left.name.localeCompare(right.name)
        }

        if (sort === 'name-desc') {
            return right.name.localeCompare(left.name)
        }

        if (sort === 'license-asc') {
            return compareNullableText(
                getFigureLicenseLabels(left)[0] ?? null,
                getFigureLicenseLabels(right)[0] ?? null
            )
        }

        if (sort === 'license-desc') {
            return compareNullableText(
                getFigureLicenseLabels(right)[0] ?? null,
                getFigureLicenseLabels(left)[0] ?? null
            )
        }

        if (sort === 'character-asc') {
            return compareNullableText(
                getFigureCharacterLabels(left)[0] ?? null,
                getFigureCharacterLabels(right)[0] ?? null
            )
        }

        if (sort === 'character-desc') {
            return compareNullableText(
                getFigureCharacterLabels(right)[0] ?? null,
                getFigureCharacterLabels(left)[0] ?? null
            )
        }

        if (sort === 'editor-asc') {
            return compareNullableText(
                getFigureEditorLabel(left),
                getFigureEditorLabel(right)
            )
        }

        if (sort === 'series-asc') {
            return compareNullableText(
                getFigureSeriesLabel(left),
                getFigureSeriesLabel(right)
            )
        }

        if (sort === 'rating-asc') {
            return compareNullableNumber(
                getFigureScoreValue(left),
                getFigureScoreValue(right)
            )
        }

        if (sort === 'rating-desc') {
            return compareNullableNumber(
                getFigureScoreValue(right),
                getFigureScoreValue(left)
            )
        }

        if (sort === 'price-asc') {
            return compareNullableNumber(
                getFigureMinimumPrice(left),
                getFigureMinimumPrice(right)
            )
        }

        if (sort === 'price-desc') {
            return compareNullableNumber(
                getFigureMinimumPrice(right),
                getFigureMinimumPrice(left)
            )
        }

        return 0
    })

    return sortedFigures
}

export function useFigureSearch({
    searchTerm,
    filters,
    sort,
    page,
    pageSize,
}: UseFigureSearchOptions): UseFigureSearchResult {
    const figuresQuery = useApiResource('figures:list', () => figurineApi.listFigures())
    const licensesQuery = useApiResource('licenses:list', () => figurineApi.listLicenses())
    const charactersQuery = useApiResource(
        'characters:list',
        () => figurineApi.listCharacters()
    )
    const editorsQuery = useApiResource('editors:list', () => figurineApi.listEditors())
    const normalizedSearchTerm = searchTerm.trim()
    const similarityQuery = useApiResource(
        `figures:similarity:${normalizedSearchTerm.toLowerCase()}`,
        () => figurineApi.searchFigures(normalizedSearchTerm),
        { enabled: normalizedSearchTerm.length > 1 }
    )

    const figureIds = useMemo(
        () => (figuresQuery.data ?? []).map((figure) => figure.id),
        [figuresQuery.data]
    )

    const cachedDetailsMap = useMemo(() => {
        return new Map(
            figureIds
                .filter((figureId) => figureDetailsCache.has(figureId))
                .map((figureId) => [figureId, figureDetailsCache.get(figureId) as ApiFigure])
        )
    }, [figureIds])
    const [fetchedDetailsMap, setFetchedDetailsMap] = useState<Map<string, ApiFigure>>(
        () => new Map()
    )
    const missingIds = useMemo(() => {
        return figureIds.filter(
            (figureId) =>
                !figureDetailsCache.has(figureId) && !fetchedDetailsMap.has(figureId)
        )
    }, [fetchedDetailsMap, figureIds])
    const isHydrating = missingIds.length > 0

    useEffect(() => {
        if (!missingIds.length) {
            return
        }

        let cancelled = false

        const hydrateDetails = async () => {
            for (const chunk of chunkValues(missingIds, 8)) {
                const settled = await Promise.allSettled(
                    chunk.map((figureId) => figurineApi.getFigureById(figureId))
                )

                if (cancelled) {
                    return
                }

                setFetchedDetailsMap((previousMap) => {
                    const nextMap = new Map(previousMap)

                    settled.forEach((result, index) => {
                        if (result.status !== 'fulfilled') {
                            return
                        }

                        const figureId = chunk[index]
                        figureDetailsCache.set(figureId, result.value)
                        nextMap.set(figureId, result.value)
                    })

                    return nextMap
                })
            }

        }

        void hydrateDetails()

        return () => {
            cancelled = true
        }
    }, [missingIds])

    const detailsMap = useMemo(() => {
        const mergedMap = new Map(cachedDetailsMap)
        fetchedDetailsMap.forEach((figure, figureId) => {
            if (figureIds.includes(figureId)) {
                mergedMap.set(figureId, figure)
            }
        })
        return mergedMap
    }, [cachedDetailsMap, fetchedDetailsMap, figureIds])

    const mergedFigures = useMemo(() => {
        return (figuresQuery.data ?? []).map((figure) => detailsMap.get(figure.id) ?? figure)
    }, [detailsMap, figuresQuery.data])

    const similarityRank = useMemo(() => {
        return new Map(
            (similarityQuery.data ?? []).map((figure, index) => [figure.id, index] as const)
        )
    }, [similarityQuery.data])

    const filterOptions = useMemo(() => {
        return buildFilterOptions(mergedFigures, {
            licenses: (licensesQuery.data ?? []).map((license) => license.name),
            characters: (charactersQuery.data ?? []).map((character) => character.name),
            editors: (editorsQuery.data ?? []).map((editor) => editor.name),
        })
    }, [charactersQuery.data, editorsQuery.data, licensesQuery.data, mergedFigures])

    const filteredFigures = useMemo(() => {
        const normalizedQuery = normalizedSearchTerm.toLowerCase()

        return mergedFigures.filter((figure) => {
            if (normalizedQuery) {
                const matchesDirectSearch =
                    getFigureSearchIndex(figure).includes(normalizedQuery) ||
                    normalizeText(figure.name).includes(normalizedQuery)

                if (!matchesDirectSearch && !similarityRank.has(figure.id)) {
                    return false
                }
            }

            if (
                !matchesSelection(getFigureLicenseLabels(figure), filters.licenses) ||
                !matchesSelection(getFigureCharacterLabels(figure), filters.characters) ||
                !matchesSelection(
                    getFigureSeriesLabel(figure) ? [getFigureSeriesLabel(figure) as string] : [],
                    filters.series
                ) ||
                !matchesSelection(
                    getFigureEditorLabel(figure) ? [getFigureEditorLabel(figure) as string] : [],
                    filters.editors
                ) ||
                !matchesSelection(
                    getFigureSizeLabel(figure) ? [getFigureSizeLabel(figure) as string] : [],
                    filters.sizes
                ) ||
                !matchesSelection(getFigureAvailabilityLabels(figure), filters.availability) ||
                !matchesSelection(getFigureResellerNames(figure), filters.resellers)
            ) {
                return false
            }

            const scoreValue = getFigureScoreValue(figure)
            if (filters.ratingMin !== null && (scoreValue === null || scoreValue < filters.ratingMin)) {
                return false
            }

            const minimumPrice = getFigureMinimumPrice(figure)
            if (filters.priceMin !== null && (minimumPrice === null || minimumPrice < filters.priceMin)) {
                return false
            }

            if (filters.priceMax !== null && (minimumPrice === null || minimumPrice > filters.priceMax)) {
                return false
            }

            return true
        })
    }, [filters, mergedFigures, normalizedSearchTerm, similarityRank])

    const sortedFigures = useMemo(() => {
        return sortFigures(filteredFigures, sort, similarityRank, normalizedSearchTerm)
    }, [filteredFigures, normalizedSearchTerm, similarityRank, sort])

    const totalResults = sortedFigures.length
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
    const currentPage = Math.min(page, totalPages)
    const pageResults = sortedFigures.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return {
        pageResults,
        totalResults,
        totalPages,
        currentPage,
        isLoading: figuresQuery.isLoading,
        isHydrating,
        error: figuresQuery.error,
        retry: figuresQuery.retry,
        filterOptions,
    }
}
