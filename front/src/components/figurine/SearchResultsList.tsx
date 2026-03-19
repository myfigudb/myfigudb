import type { ApiFigure } from '../../api/types'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { SkeletonBlock } from '../common/Skeletons'
import { FigurineListItem } from './FigurineListItem'
import {
    getSearchResultsEmptyDescription,
    toSearchListFigure,
} from './searchResults.helpers'

type SearchResultsListProps = {
    figures: ApiFigure[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
    searchTerm: string
}

export function SearchResultsList({
    figures,
    isLoading,
    error,
    onRetry,
    searchTerm,
}: SearchResultsListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonBlock
                        key={`search-list-skeleton-${index}`}
                        className="h-44 w-full rounded-xl"
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
        <div className="space-y-4">
            {figures.map((figure) => (
                <FigurineListItem
                    key={figure.id}
                    to={`/figures/${figure.id}`}
                    figurine={toSearchListFigure(figure)}
                />
            ))}
        </div>
    )
}
