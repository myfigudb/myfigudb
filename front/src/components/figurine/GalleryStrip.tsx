import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { SkeletonBlock } from '../common/Skeletons'
import { formatDate } from '../../utils/figurine'
import { logModalAction } from '../../utils/modal'

type GalleryStripProps = {
    images: string[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
    createdAt?: string | null
    updatedAt?: string | null
}

function formatMeta(label: string, value?: string | null) {
    return `${label}: ${formatDate(value)}`
}

export function GalleryStrip({
    images,
    isLoading,
    error,
    onRetry,
    createdAt,
    updatedAt,
}: GalleryStripProps) {
    if (isLoading) {
        return (
            <section className="space-y-4" aria-label="Loading gallery">
                <div className="grid gap-4 xl:grid-cols-[minmax(9rem,1fr)_minmax(0,2.25fr)] xl:gap-6">
                    <div className="grid grid-cols-3 gap-3 xl:grid-cols-1 xl:gap-4">
                        <SkeletonBlock className="aspect-square w-full rounded-lg" />
                        <SkeletonBlock className="aspect-square w-full rounded-lg" />
                        <SkeletonBlock className="aspect-square w-full rounded-lg" />
                    </div>
                    <SkeletonBlock className="aspect-[5/6] w-full rounded-xl" />
                </div>
                <SkeletonBlock className="h-4 w-60 rounded" />
            </section>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />
    }

    if (images.length === 0) {
        return (
            <EmptyState
                title="No gallery images"
                description="No images are currently available for this figurine."
            />
        )
    }

    const previewImages = images.slice(0, 3)
    const extraCount = Math.max(images.length - previewImages.length, 0)

    return (
        <section id="gallery" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(9rem,1fr)_minmax(0,2.25fr)] xl:gap-6">
                <div className="grid grid-cols-3 gap-3 xl:grid-cols-1 xl:gap-4">
                    {previewImages.map((imageSrc, index) => (
                        <div
                            key={`${imageSrc}-${index}`}
                            className="relative overflow-hidden rounded-lg border border-[#d9d7d8]"
                        >
                            <img
                                src={imageSrc}
                                alt="Figurine thumbnail"
                                className="aspect-square w-full object-cover"
                            />
                            {index === previewImages.length - 1 && extraCount > 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#141416]/65 text-xl font-semibold text-white">
                                    +{extraCount}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-[#d9d7d8] bg-[#f2f0f1]">
                    <img
                        src={images[0]}
                        alt="Figurine main"
                        className="aspect-[5/6] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
                        <button
                            type="button"
                            aria-label="Previous gallery image"
                            onClick={() => logModalAction('gallery-previous')}
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-lg text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            {'<'}
                        </button>
                        <button
                            type="button"
                            aria-label="Next gallery image"
                            onClick={() => logModalAction('gallery-next')}
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-lg text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#7b7778] sm:text-sm">
                <p>{formatMeta('Created at', createdAt)}</p>
                <p>{formatMeta('Updated at', updatedAt)}</p>
            </div>
        </section>
    )
}
