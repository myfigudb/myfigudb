import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { ErrorState } from '../components/common/ErrorState'
import { SkeletonBlock } from '../components/common/Skeletons'
import { CommentsList } from '../components/figurine/CommentsList'
import { FigurineHeader } from '../components/figurine/FigurineHeader'
import { GalleryStrip } from '../components/figurine/GalleryStrip'
import { PriceAvailabilityBlock } from '../components/figurine/PriceAvailabilityBlock'
import { SpecsPanel } from '../components/figurine/SpecsPanel'
import { SuggestionsCarousel } from '../components/figurine/SuggestionsCarousel'
import {
    useFigureComments,
    useFigureDetails,
    useFigureResellers,
    useFigureReferences,
    useFigureSuggestions,
} from '../hooks/useFigurineData'
import { extractFigureImageUrls } from '../utils/figurine'

export default function FigureDetailsPage() {
    const { figureId } = useParams()

    const figureQuery = useFigureDetails(figureId)
    const referencesQuery = useFigureReferences(figureQuery.data)
    const resellersQuery = useFigureResellers(figureId, figureQuery.data)
    const suggestionsQuery = useFigureSuggestions(figureId, figureQuery.data)

    const comments = useFigureComments(figureQuery.data)

    const galleryImages = useMemo(
        () => extractFigureImageUrls(figureQuery.data),
        [figureQuery.data]
    )

    return (
        <AppLayout>
            <FigurineHeader
                title={figureQuery.data?.name ?? 'Loading figure details...'}
            />

            <section className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-8 sm:py-10 lg:px-12 xl:py-14 2xl:px-32">
                <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr] xl:items-start xl:gap-12">
                    <GalleryStrip
                        images={galleryImages}
                        isLoading={figureQuery.isLoading}
                        error={figureQuery.error}
                        onRetry={figureQuery.retry}
                        createdAt={figureQuery.data?.created_at}
                        updatedAt={figureQuery.data?.updated_at}
                    />

                    {figureQuery.data ? (
                        <SpecsPanel
                            key={figureQuery.data.id}
                            figure={figureQuery.data}
                            editorName={
                                referencesQuery.data?.editor?.name ??
                                figureQuery.data.editor_id ??
                                null
                            }
                            rangeName={
                                referencesQuery.data?.range?.name ??
                                figureQuery.data.range_id ??
                                null
                            }
                            isReferencesLoading={referencesQuery.isLoading}
                            referencesError={referencesQuery.error}
                            onRetryReferences={referencesQuery.retry}
                        />
                    ) : figureQuery.isLoading ? (
                        <div className="space-y-4">
                            <SkeletonBlock className="h-40 w-full rounded-xl sm:h-48" />
                            <SkeletonBlock className="h-56 w-full rounded-xl sm:h-64" />
                        </div>
                    ) : (
                        <ErrorState
                            message={figureQuery.error ?? 'Unable to load this figurine.'}
                            onRetry={figureQuery.retry}
                        />
                    )}
                </div>
            </section>

            <PriceAvailabilityBlock
                listings={resellersQuery.data ?? []}
                isLoading={figureQuery.isLoading || resellersQuery.isLoading}
                error={resellersQuery.error}
                onRetry={resellersQuery.retry}
            />

            <SuggestionsCarousel
                figures={suggestionsQuery.data ?? []}
                isLoading={suggestionsQuery.isLoading}
                error={suggestionsQuery.error}
                onRetry={suggestionsQuery.retry}
                contextLabel={figureQuery.data?.name ?? 'this figurine'}
            />

            <CommentsList
                comments={comments}
                isLoading={figureQuery.isLoading}
                error={figureQuery.error}
                onRetry={figureQuery.retry}
            />
        </AppLayout>
    )
}
