import type { ApiFigure } from '../../api/types'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { HorizontalScroller } from '../common/HorizontalScroller'
import { RelatedImageCard } from '../common/RelatedImageCard'
import { SkeletonBlock } from '../common/Skeletons'
import {
    extractFigureImageUrls,
    getFigureCharacterLabel,
    getFigureLicenseLabel,
    getFigureShortName,
} from '../../utils/figurine'

type SuggestionsCarouselProps = {
    figures: ApiFigure[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
    contextLabel: string
}

export function SuggestionsCarousel({
                                        figures,
                                        isLoading,
                                        error,
                                        onRetry,
                                        contextLabel,
                                    }: SuggestionsCarouselProps) {
    return (
        <section
            id="related"
            className="mx-auto w-full max-w-screen-2xl px-4 pt-14 sm:px-8 sm:pt-16 lg:px-12 xl:pt-20 2xl:px-32"
        >
            <header className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold leading-tight text-[#222] sm:text-2xl lg:text-3xl">
                        Similar figures from the same license
                    </h2>
                    <p className="mt-2 text-xs font-light leading-relaxed text-[#7e7a7c] sm:text-sm lg:text-base">
                        More results for : {contextLabel}
                    </p>
                </div>
            </header>

            {isLoading ? (
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-10">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonBlock
                            key={`suggestion-skeleton-${index}`}
                            className="aspect-[5/7] w-full rounded"
                        />
                    ))}
                </div>
            ) : null}

            {error ? (
                <div className="mt-10">
                    <ErrorState message={error} onRetry={onRetry} />
                </div>
            ) : null}

            {!isLoading && !error && figures.length === 0 ? (
                <div className="mt-10">
                    <EmptyState
                        title="No similar figures"
                        description="The API returned no related figurines for this context."
                    />
                </div>
            ) : null}

            {!isLoading && !error && figures.length > 0 ? (
                <HorizontalScroller
                    ariaLabel="Related figurines"
                    className="mt-6"
                    items={figures.slice(0, 5).map((figure) => {
                        const previewImage = extractFigureImageUrls(figure)[0]
                        const characterName = getFigureCharacterLabel(figure)
                        const licenseName = getFigureLicenseLabel(figure)
                        const shortName = getFigureShortName(figure)

                        return (
                            <div key={figure.id} className="relative pb-6 md:pb-8">
                                <RelatedImageCard
                                    to={`/figures/${figure.id}`}
                                    figurine={{
                                        id: figure.id,
                                        name: figure.name,
                                        shortName,
                                        character: characterName,
                                        license: licenseName,
                                        imageUrl: previewImage ?? null,
                                    }}
                                />
                            </div>
                        )
                    })}
                />
            ) : null}
        </section>
    )
}