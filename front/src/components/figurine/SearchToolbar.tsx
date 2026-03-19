import { useMemo, useState } from 'react'
import { Button } from '../common/Button'
import { SearchDisplayModeSelector } from './SearchDisplayModeSelector'
import { SearchFiltersPopover } from './SearchFiltersPopover'
import type {
    FigureFilterOptions,
    FigureSearchFilters,
    FigureSearchSort,
    SearchViewMode,
} from '../../types/search'

type SearchToolbarProps = {
    searchInput: string
    onSearchInputChange: (value: string) => void
    onSearchSubmit: () => void
    onSearchClear: () => void
    filters: FigureSearchFilters
    filterOptions: FigureFilterOptions
    onFiltersChange: (nextFilters: FigureSearchFilters) => void
    sort: FigureSearchSort
    onSortChange: (nextSort: FigureSearchSort) => void
    viewMode: SearchViewMode
    onViewModeChange: (nextViewMode: SearchViewMode) => void
}

function FilterIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 5h14l-5.25 5.75v4L8.25 16v-5.25z" />
        </svg>
    )
}

function SortIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 4v12" />
            <path d="m3.5 13 2.5 3 2.5-3" />
            <path d="M14 16V4" />
            <path d="m11.5 7 2.5-3 2.5 3" />
        </svg>
    )
}

function ChevronIcon({
    isOpen,
}: {
    isOpen: boolean
}) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 7.5 5 5 5-5" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <img
            src="/assets/icons/misc/search.svg"
            alt=""
            className="size-4 shrink-0 opacity-70"
        />
    )
}

type ActiveFilterChip = {
    id: string
    label: string
    onRemove: () => void
}

const sortOptions: Array<{
    value: FigureSearchSort
    label: string
}> = [
    { value: 'relevance', label: 'Sort by relevance' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'license-asc', label: 'License A-Z' },
    { value: 'license-desc', label: 'License Z-A' },
    { value: 'character-asc', label: 'Character A-Z' },
    { value: 'character-desc', label: 'Character Z-A' },
    { value: 'editor-asc', label: 'Editor A-Z' },
    { value: 'series-asc', label: 'Series A-Z' },
    { value: 'rating-asc', label: 'Rating low to high' },
    { value: 'rating-desc', label: 'Rating high to low' },
    { value: 'price-asc', label: 'Price low to high' },
    { value: 'price-desc', label: 'Price high to low' },
]

function buildActiveFilterChips(
    filters: FigureSearchFilters,
    onFiltersChange: (nextFilters: FigureSearchFilters) => void
): ActiveFilterChip[] {
    const chips: ActiveFilterChip[] = []

    filters.licenses.forEach((license) => {
        chips.push({
            id: `license-${license}`,
            label: `License : ${license}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    licenses: filters.licenses.filter((value) => value !== license),
                }),
        })
    })

    filters.characters.forEach((character) => {
        chips.push({
            id: `character-${character}`,
            label: `Character : ${character}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    characters: filters.characters.filter((value) => value !== character),
                }),
        })
    })

    filters.series.forEach((series) => {
        chips.push({
            id: `series-${series}`,
            label: `Series : ${series}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    series: filters.series.filter((value) => value !== series),
                }),
        })
    })

    filters.editors.forEach((editor) => {
        chips.push({
            id: `editor-${editor}`,
            label: `Editor : ${editor}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    editors: filters.editors.filter((value) => value !== editor),
                }),
        })
    })

    filters.sizes.forEach((size) => {
        chips.push({
            id: `size-${size}`,
            label: `Size : ${size}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    sizes: filters.sizes.filter((value) => value !== size),
                }),
        })
    })

    filters.availability.forEach((availability) => {
        chips.push({
            id: `availability-${availability}`,
            label: `Availability : ${availability}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    availability: filters.availability.filter(
                        (value) => value !== availability
                    ),
                }),
        })
    })

    filters.resellers.forEach((reseller) => {
        chips.push({
            id: `reseller-${reseller}`,
            label: `Reseller : ${reseller}`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    resellers: filters.resellers.filter((value) => value !== reseller),
                }),
        })
    })

    if (filters.ratingMin !== null) {
        chips.push({
            id: 'rating-min',
            label: `Rating : ${filters.ratingMin.toFixed(1)}+`,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    ratingMin: null,
                }),
        })
    }

    if (filters.priceMin !== null || filters.priceMax !== null) {
        const label =
            filters.priceMin !== null && filters.priceMax !== null
                ? `Price : ${filters.priceMin} - ${filters.priceMax}`
                : filters.priceMin !== null
                  ? `Price : from ${filters.priceMin}`
                  : `Price : up to ${filters.priceMax}`

        chips.push({
            id: 'price-range',
            label,
            onRemove: () =>
                onFiltersChange({
                    ...filters,
                    priceMin: null,
                    priceMax: null,
                }),
        })
    }

    return chips
}

export function SearchToolbar({
    searchInput,
    onSearchInputChange,
    onSearchSubmit,
    onSearchClear,
    filters,
    filterOptions,
    onFiltersChange,
    sort,
    onSortChange,
    viewMode,
    onViewModeChange,
}: SearchToolbarProps) {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const activeFilterChips = useMemo(
        () => buildActiveFilterChips(filters, onFiltersChange),
        [filters, onFiltersChange]
    )
    const activeFilterCount = activeFilterChips.length

    return (
        <section className="mx-auto w-full max-w-[58rem]">
            <form
                className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]"
                onSubmit={(event) => {
                    event.preventDefault()
                    onSearchSubmit()
                }}
            >
                <label className="relative block">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0a0a11]">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) => onSearchInputChange(event.target.value)}
                        placeholder="Search for a figure..."
                        className="min-h-11 w-full rounded-xl border border-[#9f9f9f] bg-[#fffbfc] py-3 pl-11 pr-4 text-sm text-[#0a0a11] placeholder:text-[#7d797b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                    />
                </label>

                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="min-h-11 rounded-xl px-5"
                    onClick={onSearchClear}
                >
                    Clear
                </Button>

                <Button
                    type="submit"
                    variant="dark"
                    size="md"
                    className="min-h-11 rounded-xl px-5"
                >
                    Search
                </Button>
            </form>

            <div className="relative mt-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen((previous) => !previous)}
                            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#9f9f9f] bg-[#fffbfc] px-3 text-sm font-medium text-[#7d797b] transition hover:text-[#0a0a11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                        >
                            <FilterIcon />
                            <span>Filters ({activeFilterCount})</span>
                            <ChevronIcon isOpen={isFiltersOpen} />
                        </button>

                        <label className="relative min-w-[11rem]">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9f9f9f]">
                                <SortIcon />
                            </span>
                            <select
                                value={sort}
                                onChange={(event) =>
                                    onSortChange(event.target.value as FigureSearchSort)
                                }
                                className="min-h-10 w-full appearance-none rounded-xl border border-[#9f9f9f] bg-[#fffbfc] py-2 pl-10 pr-10 text-sm font-medium text-[#7d797b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                                aria-label="Sort search results"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7d797b]">
                                <ChevronIcon isOpen={false} />
                            </span>
                        </label>
                    </div>

                    <SearchDisplayModeSelector
                        viewMode={viewMode}
                        onChange={onViewModeChange}
                    />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {activeFilterChips.map((chip) => (
                        <span
                            key={chip.id}
                            className="inline-flex items-center gap-2 rounded-[0.625rem] bg-[#e8e8e8] px-3 py-2 text-sm text-[#0a0a11]"
                        >
                            <span>{chip.label}</span>
                            <button
                                type="button"
                                onClick={chip.onRemove}
                                className="inline-flex size-4 items-center justify-center rounded-full text-[#9f9f9f] transition hover:text-[#0a0a11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                                aria-label={`Remove ${chip.label}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    <button
                        type="button"
                        onClick={() => setIsFiltersOpen(true)}
                        className="inline-flex size-10 items-center justify-center rounded-[0.625rem] bg-[#e8e8e8] text-xl text-[#0a0a11] transition hover:bg-[#ddd9db] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                        aria-label="Open filters"
                    >
                        +
                    </button>
                </div>

                {isFiltersOpen ? (
                    <SearchFiltersPopover
                        filters={filters}
                        filterOptions={filterOptions}
                        onApply={onFiltersChange}
                        onClose={() => setIsFiltersOpen(false)}
                    />
                ) : null}
            </div>
        </section>
    )
}
