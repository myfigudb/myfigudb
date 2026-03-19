type RatingStarsProps = {
    value: number | null | undefined
    max?: number
    iconSrc?: string
}

export function RatingStars({
    value,
    max = 5,
    iconSrc = '/assets/icons/misc/note_star.svg',
}: RatingStarsProps) {
    const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0
    const normalized = Math.max(0, Math.min(max, safeValue))

    return (
        <span className="inline-flex items-center gap-1" aria-label={`rating ${normalized} out of ${max}`}>
            {Array.from({ length: max }).map((_, index) => {
                const active = index < normalized
                return (
                    <img
                        key={`star-${index}`}
                        src={iconSrc}
                        alt=""
                        className={`size-4 object-contain ${active ? '' : 'opacity-25 grayscale'}`}
                    />
                )
            })}
        </span>
    )
}
