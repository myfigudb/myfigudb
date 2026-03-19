import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../common/Button'
import type {
    FigureFilterOptions,
    FigureSearchFilterCategory,
    FigureSearchFilters,
} from '../../types/search'

type SearchFiltersPopoverProps = {
    filters: FigureSearchFilters
    filterOptions: FigureFilterOptions
    onApply: (nextFilters: FigureSearchFilters) => void
    onClose: () => void
}

type OptionFilterCategory = Exclude<
    FigureSearchFilterCategory,
    'price' | 'rating'
>

const optionFilterKeys = {
    license: 'licenses',
    character: 'characters',
    series: 'series',
    editor: 'editors',
    size: 'sizes',
    availability: 'availability',
    reseller: 'resellers',
} as const satisfies Record<OptionFilterCategory, keyof FigureSearchFilters>

const filterCategories: Array<{
    id: FigureSearchFilterCategory
    label: string
}> = [
    { id: 'price', label: 'Price' },
    { id: 'rating', label: 'Rating' },
    { id: 'license', label: 'License' },
    { id: 'character', label: 'Character' },
    { id: 'series', label: 'Series' },
    { id: 'editor', label: 'Editor' },
    { id: 'size', label: 'Size' },
    { id: 'availability', label: 'Availability' },
    { id: 'reseller', label: 'Reseller' },
]

function SearchIcon() {
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
            <circle cx="8.75" cy="8.75" r="5.75" />
            <path d="m13 13 4 4" />
        </svg>
    )
}

function toCount(filters: FigureSearchFilters) {
    return (
        filters.licenses.length +
        filters.characters.length +
        filters.series.length +
        filters.editors.length +
        filters.sizes.length +
        filters.availability.length +
        filters.resellers.length +
        (filters.ratingMin !== null ? 1 : 0) +
        (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0)
    )
}

function toggleValue(values: string[], target: string) {
    return values.includes(target)
        ? values.filter((value) => value !== target)
        : [...values, target]
}

function FilterOptionButton({
    label,
    isSelected,
    onClick,
}: {
    label: string
    isSelected: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-pressed={isSelected}
            onClick={onClick}
            className={`inline-flex items-center rounded-[0.625rem] px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 sm:text-sm ${
                isSelected
                    ? 'bg-[#0a0a11] text-[#fffbfc]'
                    : 'bg-[#e8e8e8] text-[#0a0a11] hover:bg-[#ddd9db]'
            }`}
        >
            {label}
        </button>
    )
}

export function SearchFiltersPopover({
    filters,
    filterOptions,
    onApply,
    onClose,
}: SearchFiltersPopoverProps) {
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const [activeCategory, setActiveCategory] =
        useState<FigureSearchFilterCategory>('license')
    const [draftFilters, setDraftFilters] = useState<FigureSearchFilters>(filters)
    const [optionSearch, setOptionSearch] = useState('')

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                event.target instanceof Node &&
                !popoverRef.current.contains(event.target)
            ) {
                onClose()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    const optionMap = useMemo<Record<OptionFilterCategory, string[]>>(() => {
        return {
            license: filterOptions.licenses,
            character: filterOptions.characters,
            series: filterOptions.series,
            editor: filterOptions.editors,
            size: filterOptions.sizes,
            availability: filterOptions.availability,
            reseller: filterOptions.resellers,
        }
    }, [filterOptions])

    const optionCategory: OptionFilterCategory | null =
        activeCategory === 'price' || activeCategory === 'rating'
            ? null
            : activeCategory

    const filteredOptions = useMemo(() => {
        const options = optionCategory ? optionMap[optionCategory] : []
        if (!optionSearch.trim()) {
            return options
        }

        return options.filter((option: string) =>
            option.toLowerCase().includes(optionSearch.trim().toLowerCase())
        )
    }, [optionCategory, optionMap, optionSearch])

    const currentSelections = useMemo(() => {
        if (!optionCategory) {
            return []
        }

        return draftFilters[optionFilterKeys[optionCategory]]
    }, [draftFilters, optionCategory])

    const handleOptionToggle = (option: string) => {
        if (!optionCategory) {
            return
        }

        const filterKey = optionFilterKeys[optionCategory]

        setDraftFilters((previousFilters) => {
            return {
                ...previousFilters,
                [filterKey]: toggleValue(previousFilters[filterKey], option),
            }
        })
    }

    const featuredOptions = currentSelections.length
        ? currentSelections
        : filteredOptions.slice(0, 8)

    return (
        <div
            ref={popoverRef}
            className="absolute left-0 top-full z-30 mt-3 w-full max-w-4xl overflow-hidden rounded-xl border border-[#ddd9db] bg-[#fffbfc] shadow-[0_0.75rem_2rem_rgba(10,10,17,0.18)]"
        >
            <div className="grid md:grid-cols-[11rem_minmax(0,1fr)]">
                <div className="border-b border-[#ece9ea] bg-[#fffbfc] p-4 md:border-b-0 md:border-r">
                    <nav aria-label="Filter categories" className="grid gap-2">
                        {filterCategories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => {
                                    setActiveCategory(category.id)
                                    setOptionSearch('')
                                }}
                                className={`rounded-lg px-2 py-1.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 ${
                                    category.id === activeCategory
                                        ? 'bg-[#f4f2f3] font-medium text-[#0a0a11]'
                                        : 'text-[#4d4a4c] hover:bg-[#f8f6f7]'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 sm:p-5">
                    <header className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-[#0a0a11] sm:text-base">
                                {filterCategories.find((category) => category.id === activeCategory)?.label}
                            </h3>
                            <p className="mt-1 text-xs text-[#8c8889] sm:text-sm">
                                {toCount(draftFilters)} active filter{toCount(draftFilters) === 1 ? '' : 's'}
                            </p>
                        </div>
                    </header>

                    {activeCategory === 'rating' ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-[#0a0a11]">
                                Minimum rating
                            </label>
                            <input
                                type="range"
                                min={filterOptions.minRating ?? 1}
                                max={filterOptions.maxRating ?? 10}
                                step="0.5"
                                value={draftFilters.ratingMin ?? filterOptions.minRating ?? 1}
                                onChange={(event) => {
                                    const nextValue = Number(event.target.value)
                                    setDraftFilters((previousFilters) => ({
                                        ...previousFilters,
                                        ratingMin: Number.isFinite(nextValue) ? nextValue : null,
                                    }))
                                }}
                                className="w-full accent-[#ed5f7f]"
                            />
                            <p className="text-sm font-medium text-[#0a0a11]">
                                {(draftFilters.ratingMin ?? filterOptions.minRating ?? 1).toFixed(1)}+
                            </p>
                        </div>
                    ) : null}

                    {activeCategory === 'price' ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium text-[#0a0a11]">
                                <span>Minimum price</span>
                                <input
                                    type="number"
                                    min={filterOptions.minPrice ?? 0}
                                    value={draftFilters.priceMin ?? ''}
                                    onChange={(event) => {
                                        const nextValue = event.target.value
                                        setDraftFilters((previousFilters) => ({
                                            ...previousFilters,
                                            priceMin: nextValue ? Number(nextValue) : null,
                                        }))
                                    }}
                                    className="rounded-lg border border-[#d5d1d3] px-3 py-2 text-sm text-[#0a0a11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                                />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-[#0a0a11]">
                                <span>Maximum price</span>
                                <input
                                    type="number"
                                    min={filterOptions.minPrice ?? 0}
                                    value={draftFilters.priceMax ?? ''}
                                    onChange={(event) => {
                                        const nextValue = event.target.value
                                        setDraftFilters((previousFilters) => ({
                                            ...previousFilters,
                                            priceMax: nextValue ? Number(nextValue) : null,
                                        }))
                                    }}
                                    className="rounded-lg border border-[#d5d1d3] px-3 py-2 text-sm text-[#0a0a11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                                />
                            </label>
                        </div>
                    ) : null}

                    {optionCategory ? (
                        <>
                            <label className="relative block">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9f9f9f]">
                                    <SearchIcon />
                                </span>
                                <input
                                    type="search"
                                    value={optionSearch}
                                    onChange={(event) => setOptionSearch(event.target.value)}
                                    placeholder={`Search ${activeCategory}...`}
                                    className="w-full rounded-lg border border-[#d5d1d3] py-2 pl-10 pr-3 text-sm text-[#0a0a11] placeholder:text-[#9f9f9f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35"
                                />
                            </label>

                            <div className="mt-4">
                                <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#9f9f9f]">
                                    {currentSelections.length ? 'Recently selected' : 'Popular'}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {featuredOptions.length > 0 ? (
                                        featuredOptions.map((option: string) => (
                                            <FilterOptionButton
                                                key={`featured-${option}`}
                                                label={option}
                                                isSelected={currentSelections.includes(option)}
                                                onClick={() => handleOptionToggle(option)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-[#8c8889]">No options available yet.</p>
                                    )}
                                </div>
                            </div>

                            {filteredOptions.length > featuredOptions.length ? (
                                <div className="mt-5 border-t border-[#ece9ea] pt-4">
                                    <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#9f9f9f]">
                                        Matching options
                                    </p>
                                    <div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                                        {filteredOptions.map((option: string) => (
                                            <FilterOptionButton
                                                key={`filtered-${option}`}
                                                label={option}
                                                isSelected={currentSelections.includes(option)}
                                                onClick={() => handleOptionToggle(option)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#ece9ea] pt-4">
                        <Button
                            variant="secondary"
                            className="rounded-lg px-4"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="dark"
                            className="rounded-lg px-4"
                            onClick={() => {
                                onApply(draftFilters)
                                onClose()
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
