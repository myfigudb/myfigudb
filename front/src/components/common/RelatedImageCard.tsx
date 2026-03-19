import type { CSSProperties, MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'

export type RelatedCardVariant = 'related' | 'search'

export type RelatedCardFigurine = {
    id: string
    name: string
    shortName?: string | null
    character?: string | null
    license?: string | null
    imageUrl?: string | null
    scoreLabel?: string | null
    priceLabel?: string | null
}

type RelatedImageCardProps = {
    figurine: RelatedCardFigurine
    to?: string
    onClick?: MouseEventHandler<HTMLElement>
    accentColor?: string
    className?: string
    variant?: RelatedCardVariant
}

const relatedCardTheme = {
    accentColor: '#f46d8d',
}

function InfoRow({ iconSrc, text }: { iconSrc: string; text: string }) {
    return (
        <p className="m-0 inline-flex items-center gap-1 leading-tight text-white/95">
            <img
                src={iconSrc}
                alt=""
                className="size-3.5 shrink-0 brightness-0 invert"
            />
            <span className="line-clamp-1">{text}</span>
        </p>
    )
}

function ScoreBadge({ value }: { value: string }) {
    return (
        <span className="absolute right-2 top-2 z-30 inline-flex items-center gap-1 rounded-[0.625rem] bg-white/20 px-2 py-1 text-[0.72rem] font-medium leading-none text-white backdrop-blur-sm">
            <img src="/assets/icons/misc/note_star.svg" alt="" className="size-3.5 shrink-0" />
            <span>{value}</span>
        </span>
    )
}

function CardBody({
    figurine,
    variant,
}: {
    figurine: RelatedCardFigurine
    variant: RelatedCardVariant
}) {
    const isSearchVariant = variant === 'search'
    const shortName = figurine.shortName?.trim() ? figurine.shortName : figurine.name
    const characterText = figurine.character?.trim() ? figurine.character : 'N/A'
    const licenseText = figurine.license?.trim() ? figurine.license : 'N/A'
    const scoreText = figurine.scoreLabel?.trim() ? figurine.scoreLabel : null
    const priceText = figurine.priceLabel?.trim() ? figurine.priceLabel : 'N/A'
    const expandedBannerClassName =
        'bg-black/60 group-hover/related:max-h-32 group-hover/related:bg-[var(--related-card-accent)] group-hover/related:py-2 group-focus-within/related:max-h-32 group-focus-within/related:bg-[var(--related-card-accent)] group-focus-within/related:py-2'

    return (
        <div
            className="relative block rounded-[0.625rem] border border-[#ddd9db] bg-[#f3f1f2]
                [transform-origin:50%_0%]
                [transform-style:preserve-3d]
                will-change-transform
                transition-[transform,box-shadow,border-color] duration-300 ease-out
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                group-hover/related:[transform:rotateX(7deg)_translateY(-0.375rem)]
                group-hover/related:shadow-[0_24px_28px_-10px_var(--related-card-accent-shadow)]
                group-focus-visible/related:[transform:rotateX(7deg)_translateY(-0.375rem)]
                group-focus-visible/related:shadow-[0_24px_28px_-10px_var(--related-card-accent-shadow)]
                motion-reduce:transform-none
                motion-reduce:transition-[box-shadow,border-color]"
        >
            <div className="relative block overflow-hidden rounded-[inherit]">
                {scoreText ? <ScoreBadge value={scoreText} /> : null}

                <div className="relative z-0 block">
                    {figurine.imageUrl ? (
                        <img
                            src={figurine.imageUrl}
                            alt={figurine.name}
                            className="aspect-[5/7] w-full object-cover"
                        />
                    ) : (
                        <span className="flex aspect-[5/7] w-full items-center justify-center bg-[#f3f1f2] text-sm text-[#8d898a]">
                            No image
                        </span>
                    )}
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10
                        bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0)_70%)]
                        opacity-0
                        transition-opacity duration-300 ease-out
                        group-hover/related:opacity-100
                        group-focus-visible/related:opacity-100
                        motion-reduce:transition-none"
                />

                <div
                    className={`absolute inset-x-0 bottom-0 z-20 max-h-10 overflow-hidden border-t border-white/10 px-2.5 py-1.5 text-[0.7rem] font-light text-white backdrop-blur-[1px] transition-[max-height,background-color,padding] duration-300 ease-out motion-reduce:transition-colors sm:text-xs ${expandedBannerClassName}`}
                >
                    <div className="flex flex-col justify-start gap-0">
                        <div
                            className="m-0 max-h-5 overflow-hidden line-clamp-1 font-medium leading-tight opacity-100 transition-[opacity,max-height,transform] duration-200 ease-out group-hover/related:max-h-0 group-hover/related:-translate-y-1 group-hover/related:opacity-0 group-focus-within/related:max-h-0 group-focus-within/related:-translate-y-1 group-focus-within/related:opacity-0 motion-reduce:transform-none motion-reduce:transition-opacity"
                        >
                            {shortName}
                        </div>

                        <div
                            className="grid max-h-0 grid-cols-1 gap-0.5 overflow-hidden opacity-0 -translate-y-1 pointer-events-none transition-[opacity,max-height,transform] duration-300 ease-out group-hover/related:max-h-24 group-hover/related:translate-y-0 group-hover/related:opacity-100 group-hover/related:pointer-events-auto group-focus-within/related:max-h-24 group-focus-within/related:translate-y-0 group-focus-within/related:opacity-100 group-focus-within/related:pointer-events-auto motion-reduce:transform-none motion-reduce:transition-opacity"
                        >
                            <p className="m-0 line-clamp-2 font-medium leading-tight">
                                {figurine.name}
                            </p>
                            <InfoRow
                                iconSrc="/assets/icons/figure_spec/character.svg"
                                text={characterText}
                            />
                            {isSearchVariant ? (
                                <div className="flex items-end justify-between gap-2">
                                    <InfoRow
                                        iconSrc="/assets/icons/figure_spec/license.svg"
                                        text={licenseText}
                                    />
                                    <span className="shrink-0 text-[0.72rem] font-medium leading-none text-white">
                                        {priceText}
                                    </span>
                                </div>
                            ) : (
                                <InfoRow
                                    iconSrc="/assets/icons/figure_spec/license.svg"
                                    text={licenseText}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function RelatedImageCard({
    figurine,
    to,
    onClick,
    accentColor = relatedCardTheme.accentColor,
    className,
    variant = 'related',
}: RelatedImageCardProps) {
    const sharedClassName = `group/related relative isolate block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--related-card-accent)] ${className ?? ''}`
    const label = `Open ${figurine.name}`

    const themeStyle = {
        '--related-card-accent': accentColor,
        '--related-card-accent-shadow': `color-mix(in srgb, ${accentColor} 55%, transparent)`,
        perspective: '70rem',
    } as CSSProperties

    if (to) {
        return (
            <Link
                to={to}
                onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
                aria-label={label}
                className={sharedClassName}
                style={themeStyle}
            >
                <CardBody figurine={figurine} variant={variant} />
            </Link>
        )
    }

    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
            className={sharedClassName}
            style={themeStyle}
        >
            <CardBody figurine={figurine} variant={variant} />
        </button>
    )
}
