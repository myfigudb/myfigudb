import type { ApiListing } from '../../api/types'
import { Button } from '../common/Button'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { SkeletonBlock } from '../common/Skeletons'
import { formatDate, formatPrice } from '../../utils/figurine'
import { logModalAction } from '../../utils/modal'

type PriceAvailabilityBlockProps = {
    listings: ApiListing[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
}

function bestPriceListingId(listings: ApiListing[]) {
    const cheapest = listings.reduce<{ id: string; price: number } | null>(
        (current, listing) => {
            if (typeof listing.price !== 'number' || Number.isNaN(listing.price)) {
                return current
            }

            if (!current || listing.price < current.price) {
                return { id: listing.id, price: listing.price }
            }

            return current
        },
        null
    )

    return cheapest ? cheapest.id : null
}

function openListingUrl(url?: string) {
    if (!url) {
        return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
}

export function PriceAvailabilityBlock({
    listings,
    isLoading,
    error,
    onRetry,
}: PriceAvailabilityBlockProps) {
    const bestPriceId = bestPriceListingId(listings)
    const gridTemplateColumns = `minmax(10rem,1fr) repeat(${Math.max(listings.length, 1)}, minmax(13rem,1fr))`

    return (
        <section id="resellers" className="bg-[#222] py-12 text-[#f5f3f4] sm:py-14 xl:py-16">
            <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-12 2xl:px-32">
                <header className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold leading-tight text-[#fffbfc] sm:text-2xl lg:text-3xl">
                            Resellers
                        </h2>
                        <p className="mt-2 text-xs font-light leading-relaxed text-[#cbc5c7] sm:text-sm lg:text-base">
                            Compare the best deals among the resellers listed in
                            MyFigurineDB.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-[#cfc9cb]">
                        <button
                            type="button"
                            aria-label="Previous reseller"
                            onClick={() => logModalAction('resellers-previous')}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-[#4a4748] text-xl transition-colors hover:border-[#ed5f7f] hover:text-[#fffbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            {'<'}
                        </button>
                        <button
                            type="button"
                            aria-label="Next reseller"
                            onClick={() => logModalAction('resellers-next')}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-[#4a4748] text-xl transition-colors hover:border-[#ed5f7f] hover:text-[#fffbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            {'>'}
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="mt-10 space-y-4">
                        <SkeletonBlock className="h-12 rounded-lg bg-[#2f2d2e]" />
                        <SkeletonBlock className="h-64 rounded-lg bg-[#2f2d2e]" />
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-10">
                        <ErrorState message={error} onRetry={onRetry} light={false} />
                    </div>
                ) : null}

                {!isLoading && !error && listings.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="Reseller data coming soon"
                            description="No pricing or availability data is available yet. This section is ready and will populate as soon as the reseller API is available."
                            light={false}
                        />
                    </div>
                ) : null}

                {!isLoading && !error && listings.length > 0 ? (
                    <div className="mt-10 space-y-6">
                        <div className="grid gap-4 lg:hidden">
                            {listings.map((listing) => {
                                const isBestPrice = listing.id === bestPriceId

                                return (
                                    <article
                                        key={listing.id}
                                        className="rounded-lg border border-[#4a4748] bg-[#222] p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-base font-medium text-[#fffbfc]">
                                                    {listing.reseller?.name ?? 'Unknown reseller'}
                                                </p>
                                                <p className="mt-1 text-xs text-[#bfb9bb]">
                                                    {listing.reseller?.domain ?? 'N/A'}
                                                </p>
                                            </div>
                                            <img
                                                src="/assets/icons/figudb/myfigudb_logo_sm_light.svg"
                                                alt=""
                                                className="size-9 shrink-0"
                                            />
                                        </div>

                                        <dl className="mt-4 space-y-2 text-xs sm:text-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <dt className="text-[#bfb9bb]">Price</dt>
                                                <dd className="flex items-center gap-2 text-right font-medium text-[#fffbfc]">
                                                    <span>{formatPrice(listing)}</span>
                                                    {isBestPrice ? (
                                                        <span className="rounded bg-[#1f6f3f] px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-[#d8ffd7]">
                                                            BEST PRICE
                                                        </span>
                                                    ) : null}
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <dt className="text-[#bfb9bb]">Status</dt>
                                                <dd className="text-[#fffbfc]">
                                                    {listing.status?.toUpperCase() ?? 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <dt className="text-[#bfb9bb]">Available at</dt>
                                                <dd className="text-[#fffbfc]">
                                                    {formatDate(listing.available_at)}
                                                </dd>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <dt className="text-[#bfb9bb]">Reference</dt>
                                                <dd className="text-[#fffbfc]">
                                                    {listing.ref ?? 'N/A'}
                                                </dd>
                                            </div>
                                        </dl>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4 w-full rounded-lg border-[#6f6a6c] text-[#fffbfc]"
                                            onClick={() => openListingUrl(listing.url)}
                                        >
                                            Visit website
                                        </Button>
                                    </article>
                                )
                            })}
                        </div>

                        <div className="hidden overflow-x-auto lg:block">
                            <div className="min-w-max rounded-lg border border-[#4a4748]">
                                <div
                                    className="grid border-b border-[#4a4748]"
                                    style={{ gridTemplateColumns }}
                                >
                                    <div className="px-4 py-4 xl:px-5 xl:py-5">
                                        <p className="text-2xl font-semibold leading-none text-[#fffbfc] xl:text-3xl">
                                            {listings.length}
                                        </p>
                                        <p className="mt-2 text-xs font-light text-[#c9c5c6] xl:text-sm">
                                            Resellers
                                        </p>
                                    </div>

                                    {listings.map((listing) => (
                                        <div
                                            key={`${listing.id}-heading`}
                                            className="border-l border-[#4a4748] px-4 py-4 xl:px-5 xl:py-5"
                                        >
                                            <img
                                                src="/assets/icons/figudb/myfigudb_logo_sm_light.svg"
                                                alt=""
                                                className="size-8"
                                            />
                                            <p className="mt-2 text-base font-medium leading-tight text-[#fffbfc] xl:text-lg">
                                                {listing.reseller?.name ?? 'Unknown reseller'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="grid border-b border-[#4a4748]"
                                    style={{ gridTemplateColumns }}
                                >
                                    <p className="px-4 py-3 text-sm font-light text-[#e4dfe0] xl:px-5 xl:text-base">
                                        Price
                                    </p>
                                    {listings.map((listing) => (
                                        <div
                                            key={`${listing.id}-price`}
                                            className="flex items-center justify-between gap-2 border-l border-[#4a4748] px-4 py-3 xl:px-5"
                                        >
                                            <p className="text-sm font-light text-[#fffbfc] xl:text-base">
                                                {formatPrice(listing)}
                                            </p>
                                            {listing.id === bestPriceId ? (
                                                <span className="rounded bg-[#1f6f3f] px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-[#d8ffd7] xl:text-xs">
                                                    BEST PRICE
                                                </span>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="grid border-b border-[#4a4748]"
                                    style={{ gridTemplateColumns }}
                                >
                                    <p className="px-4 py-3 text-sm font-light text-[#e4dfe0] xl:px-5 xl:text-base">
                                        Status
                                    </p>
                                    {listings.map((listing) => (
                                        <p
                                            key={`${listing.id}-status`}
                                            className="border-l border-[#4a4748] px-4 py-3 text-sm font-light text-[#fffbfc] xl:px-5 xl:text-base"
                                        >
                                            {listing.status?.toUpperCase() ?? 'N/A'}
                                        </p>
                                    ))}
                                </div>

                                <div
                                    className="grid border-b border-[#4a4748]"
                                    style={{ gridTemplateColumns }}
                                >
                                    <p className="px-4 py-3 text-sm font-light text-[#e4dfe0] xl:px-5 xl:text-base">
                                        Available at
                                    </p>
                                    {listings.map((listing) => (
                                        <p
                                            key={`${listing.id}-available`}
                                            className="border-l border-[#4a4748] px-4 py-3 text-sm font-light text-[#fffbfc] xl:px-5 xl:text-base"
                                        >
                                            {formatDate(listing.available_at)}
                                        </p>
                                    ))}
                                </div>

                                <div
                                    className="grid border-b border-[#4a4748]"
                                    style={{ gridTemplateColumns }}
                                >
                                    <p className="px-4 py-3 text-sm font-light text-[#e4dfe0] xl:px-5 xl:text-base">
                                        Reference
                                    </p>
                                    {listings.map((listing) => (
                                        <p
                                            key={`${listing.id}-reference`}
                                            className="border-l border-[#4a4748] px-4 py-3 text-sm font-light text-[#fffbfc] xl:px-5 xl:text-base"
                                        >
                                            {listing.ref ?? 'N/A'}
                                        </p>
                                    ))}
                                </div>

                                <div className="grid" style={{ gridTemplateColumns }}>
                                    <div className="px-4 py-4 xl:px-5 xl:py-5" />
                                    {listings.map((listing) => (
                                        <div
                                            key={`${listing.id}-cta`}
                                            className="flex items-center justify-end border-l border-[#4a4748] px-4 py-4 xl:px-5 xl:py-5"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg border-[#6f6a6c] px-4 text-[#fffbfc]"
                                                onClick={() => openListingUrl(listing.url)}
                                            >
                                                Visit website
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    )
}
