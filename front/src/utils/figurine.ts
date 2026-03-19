import type { ApiFigure, ApiFigureComment, ApiListing, ApiReseller } from '../api/types'

export type FigureResellerSummary = {
    id: string
    name: string
    domain: string | null
    url: string | null
    logoUrl: string | null
}

function normalizeDateInput(value: string | null | undefined): Date | null {
    if (!value) {
        return null
    }

    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatDate(value: string | null | undefined) {
    const parsed = normalizeDateInput(value)
    if (!parsed) {
        return 'N/A'
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(parsed)
}

export function formatRelativeDate(value: string | null | undefined) {
    const parsed = normalizeDateInput(value)
    if (!parsed) {
        return 'Unknown date'
    }

    const diffMs = parsed.getTime() - Date.now()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (Math.abs(diffDays) < 1) {
        return 'today'
    }

    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    return formatter.format(diffDays, 'day')
}

export function formatNumber(value: number | null | undefined) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return 'N/A'
    }

    return new Intl.NumberFormat('en-US').format(value)
}

export function formatPrice(listing: ApiListing) {
    if (typeof listing.price !== 'number' || Number.isNaN(listing.price)) {
        return 'N/A'
    }

    const currency = listing.currency ?? 'EUR'

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2,
        }).format(listing.price)
    } catch {
        return `${listing.price.toFixed(2)} ${currency}`
    }
}

function toStringValue(value: unknown): string | null {
    return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function toRecord(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>
    }

    return null
}

function firstTextValue(value: unknown): string | null {
    const direct = toStringValue(value)
    if (direct) {
        return direct
    }

    const record = toRecord(value)
    if (!record) {
        return null
    }

    return (
        toStringValue(record.name) ??
        toStringValue(record.label) ??
        toStringValue(record.title) ??
        toStringValue(record.short_name) ??
        toStringValue(record.shortName)
    )
}

function firstTextFromCollection(value: unknown): string | null {
    if (Array.isArray(value)) {
        for (const entry of value) {
            const resolved = firstTextValue(entry)
            if (resolved) {
                return resolved
            }
        }

        return null
    }

    return firstTextValue(value)
}

function normalizeText(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? ''
}

export function extractFigureImageUrls(figure: ApiFigure | null): string[] {
    if (!figure) {
        return []
    }

    const imageUrls = new Set<string>()

    figure.images?.forEach((image) => {
        const imageUrl = toStringValue(image.url) ?? toStringValue(image.media?.url)
        if (imageUrl) {
            imageUrls.add(imageUrl)
        }
    })

    figure.images_urls?.forEach((url) => {
        if (toStringValue(url)) {
            imageUrls.add(url)
        }
    })

    return Array.from(imageUrls)
}

export function getFigureShortName(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    const source = figure as Record<string, unknown>

    return (
        firstTextFromCollection(source.short_name) ??
        firstTextFromCollection(source.shortName) ??
        toStringValue(figure.name)
    )
}

export function getFigureCharacterLabel(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    const source = figure as Record<string, unknown>

    return (
        firstTextFromCollection(figure.characters) ??
        firstTextFromCollection(source.character) ??
        firstTextFromCollection(source.character_name) ??
        firstTextFromCollection(source.characterName) ??
        firstTextFromCollection(source.chara)
    )
}

export function getFigureLicenseLabel(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    const source = figure as Record<string, unknown>

    return (
        firstTextFromCollection(figure.licenses) ??
        firstTextFromCollection(source.license) ??
        firstTextFromCollection(source.license_name) ??
        firstTextFromCollection(source.licenseName) ??
        firstTextFromCollection(source.licence)
    )
}

export function getFigureEditorLabel(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    const source = figure as Record<string, unknown>

    return (
        firstTextFromCollection(figure.editor) ??
        firstTextFromCollection(source.editor_name) ??
        firstTextFromCollection(source.editorName)
    )
}

export function getFigureSeriesLabel(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    const source = figure as Record<string, unknown>

    return (
        firstTextFromCollection(figure.ranges) ??
        firstTextFromCollection(source.range) ??
        firstTextFromCollection(source.series) ??
        firstTextFromCollection(source.range_name) ??
        firstTextFromCollection(source.series_name)
    )
}

export function getFigureCharacterLabels(figure: ApiFigure | null): string[] {
    if (!figure) {
        return []
    }

    const values = [
        ...(figure.characters?.map((character) => firstTextValue(character)) ?? []),
        firstTextValue((figure as Record<string, unknown>).character),
        firstTextValue((figure as Record<string, unknown>).character_name),
        firstTextValue((figure as Record<string, unknown>).characterName),
        firstTextValue((figure as Record<string, unknown>).chara),
    ]

    return Array.from(
        new Set(values.filter((value): value is string => Boolean(value)))
    )
}

export function getFigureLicenseLabels(figure: ApiFigure | null): string[] {
    if (!figure) {
        return []
    }

    const values = [
        ...(figure.licenses?.map((license) => firstTextValue(license)) ?? []),
        firstTextValue((figure as Record<string, unknown>).license),
        firstTextValue((figure as Record<string, unknown>).license_name),
        firstTextValue((figure as Record<string, unknown>).licenseName),
        firstTextValue((figure as Record<string, unknown>).licence),
    ]

    return Array.from(
        new Set(values.filter((value): value is string => Boolean(value)))
    )
}

export function getFigureSizeLabel(figure: ApiFigure | null): string | null {
    if (!figure) {
        return null
    }

    if (typeof figure.height === 'number' && Number.isFinite(figure.height)) {
        const unit = toStringValue(figure.unit) ?? 'cm'
        return `${figure.height}${unit}`
    }

    return toStringValue(figure.scale)
}

export function getFigureReleaseDateLabel(figure: ApiFigure | null): string {
    return formatDate(figure?.release_date)
}

export function getFigureScoreValue(figure: ApiFigure | null): number | null {
    const source = figure as Record<string, unknown> | null
    const candidate = source?.score

    return typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : null
}

export function getFigureScoreLabel(figure: ApiFigure | null): string {
    const score = getFigureScoreValue(figure)
    return score === null ? 'N/A' : score.toFixed(1)
}

export function getFigureResellerNames(figure: ApiFigure | null): string[] {
    return getFigureResellers(figure).map((reseller) => reseller.name)
}

function getResellerLogoUrl(reseller: ApiReseller | null | undefined) {
    const source = reseller as Record<string, unknown> | null | undefined

    return (
        toStringValue(source?.logo_url) ??
        toStringValue(source?.logoUrl) ??
        toStringValue(source?.image_url) ??
        toStringValue(source?.imageUrl) ??
        toStringValue(source?.logo)
    )
}

export function getFigureResellers(figure: ApiFigure | null): FigureResellerSummary[] {
    if (!figure?.listings?.length) {
        return []
    }

    const resellersMap = new Map<string, FigureResellerSummary>()

    figure.listings.forEach((listing) => {
        const resellerName = toStringValue(listing.reseller?.name)
        if (!resellerName) {
            return
        }

        const resellerId = toStringValue(listing.reseller?.id) ?? resellerName
        const nextLogoUrl = getResellerLogoUrl(listing.reseller)
        const existingReseller = resellersMap.get(resellerId)

        if (existingReseller) {
            if (!existingReseller.logoUrl && nextLogoUrl) {
                resellersMap.set(resellerId, {
                    ...existingReseller,
                    logoUrl: nextLogoUrl,
                })
            }
            return
        }

        resellersMap.set(resellerId, {
            id: resellerId,
            name: resellerName,
            domain: toStringValue(listing.reseller?.domain),
            url: toStringValue(listing.reseller?.url) ?? toStringValue(listing.url),
            logoUrl: nextLogoUrl,
        })
    })

    return Array.from(resellersMap.values())
}

export function getFigureAvailabilityLabels(figure: ApiFigure | null): string[] {
    if (!figure?.listings) {
        return []
    }

    const values = figure.listings
        .map((listing) => toStringValue(listing.status))
        .filter((value): value is string => Boolean(value))

    return Array.from(new Set(values))
}

export function getFigureMinimumPrice(figure: ApiFigure | null): number | null {
    if (!figure?.listings?.length) {
        return null
    }

    let minPrice: number | null = null

    figure.listings.forEach((listing) => {
        if (typeof listing.price !== 'number' || Number.isNaN(listing.price)) {
            return
        }

        if (minPrice === null || listing.price < minPrice) {
            minPrice = listing.price
        }
    })

    return minPrice
}

export function getFigureMinimumPriceLabel(figure: ApiFigure | null): string {
    if (!figure?.listings?.length) {
        return 'N/A'
    }

    const cheapestListing = figure.listings.reduce<ApiListing | null>((cheapest, listing) => {
        if (typeof listing.price !== 'number' || Number.isNaN(listing.price)) {
            return cheapest
        }

        if (!cheapest || (cheapest.price ?? Number.POSITIVE_INFINITY) > listing.price) {
            return listing
        }

        return cheapest
    }, null)

    return cheapestListing ? formatPrice(cheapestListing) : 'N/A'
}

export function getFigureSearchIndex(figure: ApiFigure | null): string {
    if (!figure) {
        return ''
    }

    return [
        figure.name,
        getFigureShortName(figure),
        getFigureCharacterLabel(figure),
        getFigureLicenseLabel(figure),
        getFigureEditorLabel(figure),
        getFigureSeriesLabel(figure),
        getFigureSizeLabel(figure),
        ...getFigureCharacterLabels(figure),
        ...getFigureLicenseLabels(figure),
        ...getFigureResellerNames(figure),
        ...getFigureAvailabilityLabels(figure),
    ]
        .filter((value): value is string => Boolean(value))
        .map((value) => normalizeText(value))
        .join(' ')
}

export function getFigureDescription(figure: ApiFigure | null) {
    return toStringValue(figure?.commentary) ?? 'No description available yet.'
}

export function getCommentContent(comment: ApiFigureComment) {
    return (
        toStringValue(comment.content) ??
        toStringValue(comment.text) ??
        toStringValue(comment.body) ??
        'No comment content available.'
    )
}

export function getCommentAuthor(comment: ApiFigureComment) {
    return (
        toStringValue(comment.author?.name) ??
        toStringValue(comment.author?.slug) ??
        toStringValue(comment.user?.name) ??
        toStringValue(comment.user?.slug) ??
        toStringValue(comment.username) ??
        'Anonymous'
    )
}

export function getCommentLikes(comment: ApiFigureComment) {
    return typeof comment.likes === 'number' ? comment.likes : null
}

export function getCommentDislikes(comment: ApiFigureComment) {
    return typeof comment.dislikes === 'number' ? comment.dislikes : null
}
