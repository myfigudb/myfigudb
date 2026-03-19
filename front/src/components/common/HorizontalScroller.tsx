import { useCallback, useRef } from 'react'
import type { KeyboardEvent, ReactNode, WheelEvent } from 'react'
import { IconButton } from './IconButton'

type HorizontalScrollerProps = {
    items: ReactNode[]
    ariaLabel: string
    className?: string
    trackClassName?: string
    itemClassName?: string
    itemWrapperClassName?: string
}

function getGapValue(track: HTMLElement) {
    const styles = window.getComputedStyle(track)
    const gap = styles.columnGap || styles.gap || '0'
    const parsed = Number.parseFloat(gap)

    return Number.isFinite(parsed) ? parsed : 0
}

export function HorizontalScroller({
    items,
    ariaLabel,
    className,
    trackClassName,
    itemClassName,
    itemWrapperClassName,
}: HorizontalScrollerProps) {
    const scrollerRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const controlClassName =
        'size-10 rounded-full border border-[#d6d2d3] text-xl text-[#8c8889] hover:border-[#ed5f7f] hover:bg-transparent hover:text-[#222]'

    const scrollByStep = useCallback((direction: 1 | -1) => {
        const scroller = scrollerRef.current
        const track = trackRef.current
        if (!scroller || !track) {
            return
        }

        const firstItem = track.querySelector<HTMLElement>('[data-horizontal-item]')
        if (!firstItem) {
            return
        }

        const gap = getGapValue(track)
        const step = firstItem.getBoundingClientRect().width + gap

        scroller.scrollBy({
            left: direction * step,
            behavior: 'smooth',
        })
    }, [])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault()
                scrollByStep(1)
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                scrollByStep(-1)
            }
        },
        [scrollByStep]
    )

    const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        const scroller = scrollerRef.current
        if (!scroller) {
            return
        }

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault()
            scroller.scrollBy({
                left: event.deltaY,
                behavior: 'auto',
            })
        }
    }, [])

    return (
        <section className={className}>
            <div className="flex justify-end gap-3">
                <IconButton
                    icon={'<'}
                    aria-label="Scroll related cards left"
                    onClick={() => scrollByStep(-1)}
                    className={controlClassName}
                />
                <IconButton
                    icon={'>'}
                    aria-label="Scroll related cards right"
                    onClick={() => scrollByStep(1)}
                    className={controlClassName}
                />
            </div>

            <div className="mt-4">
                <div
                    ref={scrollerRef}
                    role="region"
                    aria-label={ariaLabel}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onWheel={handleWheel}
                    className={[
                        'overflow-x-auto',
                        'px-4 -mx-4',
                        'pt-2 pb-10',
                        'touch-pan-x',
                        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40',
                    ].join(' ')}
                >
                    <div
                        ref={trackRef}
                        className={`flex flex-nowrap snap-x snap-mandatory items-start gap-4 sm:gap-6 xl:gap-8 ${trackClassName ?? ''}`}
                    >
                        {items.map((item, index) => (
                            <div
                                key={`horizontal-item-${index}`}
                                data-horizontal-item
                                className={`relative shrink-0 snap-start ${itemClassName ?? 'basis-[min(72vw,18rem)] sm:basis-[min(42vw,16rem)] lg:basis-[min(30vw,16rem)] xl:basis-[min(20vw,16rem)]'} ${itemWrapperClassName ?? ''}`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
