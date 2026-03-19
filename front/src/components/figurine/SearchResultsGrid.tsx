import type { ApiFigure } from '../../api/types'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { RelatedImageCard } from '../common/RelatedImageCard'
import { SkeletonBlock } from '../common/Skeletons'
import {
    getSearchResultsEmptyDescription,
    toSearchCardFigure,
} from './searchResults.helpers'

type SearchResultsGridProps = {
    figures: ApiFigure[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
    searchTerm: string
}

export function SearchResultsGrid({
    figures,
    isLoading,
    error,
    onRetry,
    searchTerm,
}: SearchResultsGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonBlock
                        key={`search-card-skeleton-${index}`}
                        className="aspect-[5/7] w-full rounded-[0.625rem]"
                    />
                ))}
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />
    }

    if (!figures.length) {
        return (
            <EmptyState
                title="No figures found"
                description={getSearchResultsEmptyDescription(searchTerm)}
            />
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
            {figures.map((figure) => (
                <RelatedImageCard
                    key={figure.id}
                    to={`/figures/${figure.id}`}
                    variant="search"
                    figurine={toSearchCardFigure(figure)}
                />
            ))}
        </div>
    )
}
