import { useEffect, useState } from 'react'
import { Pagination } from '../components/common/Pagination'
import { SearchResultsGrid } from '../components/figurine/SearchResultsGrid'
import { SearchResultsList } from '../components/figurine/SearchResultsList'
import { SearchResultsTable } from '../components/figurine/SearchResultsTable'
import { SearchToolbar } from '../components/figurine/SearchToolbar'
import { AppLayout } from '../components/layout/AppLayout'
import { useFigureSearch } from '../hooks/useFigureSearch'
import {
    createEmptyFigureSearchFilters,
    type FigureSearchSort,
    type SearchViewMode,
} from '../types/search'

const SEARCH_PAGE_SIZE = 30

export default function FiguresPage() {
    const [searchInput, setSearchInput] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState(createEmptyFigureSearchFilters)
    const [sort, setSort] = useState<FigureSearchSort>('relevance')
    const [viewMode, setViewMode] = useState<SearchViewMode>('cards')
    const [page, setPage] = useState(1)

    const searchQuery = useFigureSearch({
        searchTerm,
        filters,
        sort,
        page,
        pageSize: SEARCH_PAGE_SIZE,
    })

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchTerm(searchInput.trim())
            setPage(1)
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    return (
        <AppLayout>
            <section className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 2xl:px-32">
                <SearchToolbar
                    searchInput={searchInput}
                    onSearchInputChange={setSearchInput}
                    onSearchSubmit={() => {
                        setSearchTerm(searchInput.trim())
                        setPage(1)
                    }}
                    onSearchClear={() => {
                        setSearchInput('')
                        setSearchTerm('')
                        setPage(1)
                    }}
                    filters={filters}
                    filterOptions={searchQuery.filterOptions}
                    onFiltersChange={(nextFilters) => {
                        setFilters(nextFilters)
                        setPage(1)
                    }}
                    sort={sort}
                    onSortChange={(nextSort) => {
                        setSort(nextSort)
                        setPage(1)
                    }}
                    viewMode={viewMode}
                    onViewModeChange={(nextViewMode) => {
                        setViewMode(nextViewMode)
                    }}
                />

                <div className="mt-10">
                    {viewMode === 'cards' ? (
                        <SearchResultsGrid
                            figures={searchQuery.pageResults}
                            isLoading={searchQuery.isLoading}
                            error={searchQuery.error}
                            onRetry={searchQuery.retry}
                            searchTerm={searchTerm}
                        />
                    ) : null}

                    {viewMode === 'list' ? (
                        <SearchResultsList
                            figures={searchQuery.pageResults}
                            isLoading={searchQuery.isLoading}
                            error={searchQuery.error}
                            onRetry={searchQuery.retry}
                            searchTerm={searchTerm}
                        />
                    ) : null}

                    {viewMode === 'table' ? (
                        <SearchResultsTable
                            figures={searchQuery.pageResults}
                            isLoading={searchQuery.isLoading}
                            error={searchQuery.error}
                            onRetry={searchQuery.retry}
                            searchTerm={searchTerm}
                            currentPage={searchQuery.currentPage}
                            pageSize={SEARCH_PAGE_SIZE}
                            sort={sort}
                            onSortChange={(nextSort) => {
                                setSort(nextSort)
                                setPage(1)
                            }}
                        />
                    ) : null}
                </div>

                {!searchQuery.isLoading && !searchQuery.error ? (
                    <div className="mt-10 flex justify-center lg:justify-end">
                        <Pagination
                            currentPage={searchQuery.currentPage}
                            totalPages={searchQuery.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                ) : null}
            </section>
        </AppLayout>
    )
}
