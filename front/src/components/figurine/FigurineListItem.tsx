import type { MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { ResellerLogoGroup } from '../common/ResellerLogoGroup'
import type { FigureResellerSummary } from '../../utils/figurine'

export type FigurineListItemData = {
    id: string
    name: string
    imageUrl: string | null
    license: string | null
    character: string | null
    releaseDate: string | null
    scoreLabel: string | null
    priceLabel: string | null
    series: string | null
    editor: string | null
    size: string | null
    resellers: FigureResellerSummary[]
}

type FigurineListItemProps = {
    figurine: FigurineListItemData
    to?: string
    onClick?: MouseEventHandler<HTMLElement>
    className?: string
}

function MetaRow({
    iconSrc,
    text,
}: {
    iconSrc: string
    text: string
}) {
    return (
        <span className="inline-flex items-center gap-2 text-xs text-[#4f4b4d] sm:text-sm">
            <img src={iconSrc} alt="" className="size-4 shrink-0 opacity-80" />
            <span className="line-clamp-1">{text}</span>
        </span>
    )
}

function ScoreRow({ scoreLabel }: { scoreLabel: string }) {
    return (
        <span className="inline-flex items-center justify-end gap-1.5 text-lg font-medium text-[#0a0a11] sm:text-xl">
            <img src="/assets/icons/misc/note_star.svg" alt="" className="size-4 shrink-0" />
            <span>{scoreLabel}</span>
        </span>
    )
}

function FigurineListItemBody({
    figurine,
}: {
    figurine: FigurineListItemData
}) {
    const licenseText = figurine.license?.trim() ? figurine.license : 'N/A'
    const characterText = figurine.character?.trim() ? figurine.character : 'N/A'
    const releaseDateText = figurine.releaseDate?.trim()
        ? figurine.releaseDate
        : 'N/A'
    const seriesText = figurine.series?.trim() ? figurine.series : 'N/A'
    const editorText = figurine.editor?.trim() ? figurine.editor : 'N/A'
    const sizeText = figurine.size?.trim() ? figurine.size : 'N/A'
    const scoreText = figurine.scoreLabel?.trim() ? figurine.scoreLabel : 'N/A'
    const priceText = figurine.priceLabel?.trim() ? figurine.priceLabel : 'N/A'

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
            <div className="block w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#f3f1f2] shadow-[0_1px_3px_rgba(10,10,17,0.08)] sm:w-24 md:w-28">
                {figurine.imageUrl ? (
                    <img
                        src={figurine.imageUrl}
                        alt={figurine.name}
                        className="aspect-square w-full object-cover"
                    />
                ) : (
                    <span className="flex aspect-square w-full items-center justify-center px-3 text-center text-xs text-[#8d898a]">
                        No image
                    </span>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:self-stretch">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <MetaRow
                        iconSrc="/assets/icons/figure_spec/license.svg"
                        text={licenseText}
                    />
                    <MetaRow
                        iconSrc="/assets/icons/figure_spec/character.svg"
                        text={characterText}
                    />
                </div>

                <p className="m-0 line-clamp-2 text-sm font-medium leading-snug text-[#0a0a11] sm:text-base lg:text-lg">
                    {figurine.name}
                </p>

                <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                    <ResellerLogoGroup
                        resellers={figurine.resellers}
                        className="md:min-w-36"
                    />

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <MetaRow
                            iconSrc="/assets/icons/figure_spec/series.svg"
                            text={seriesText}
                        />
                        <MetaRow
                            iconSrc="/assets/icons/figure_spec/editor.svg"
                            text={editorText}
                        />
                        <MetaRow
                            iconSrc="/assets/icons/figure_spec/release_date.svg"
                            text={releaseDateText}
                        />
                        <MetaRow
                            iconSrc="/assets/icons/figure_spec/size.svg"
                            text={sizeText}
                        />
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:min-w-28 sm:self-stretch sm:flex-col sm:items-start sm:justify-between">
                <ScoreRow scoreLabel={scoreText} />
                <span className="text-base font-medium tracking-[-0.01em] text-[#0a0a11] sm:text-lg">
                    {priceText}
                </span>
            </div>
        </div>
    )
}

export function FigurineListItem({
    figurine,
    to,
    onClick,
    className,
}: FigurineListItemProps) {
    const itemClassName = `group block rounded-xl border border-[#e8e8e8] bg-[#fffbfc] px-4 py-4 shadow-[0_1px_3px_rgba(10,10,17,0.04)] transition hover:shadow-[0_8px_18px_rgba(10,10,17,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 sm:px-5 sm:py-5 ${className ?? ''}`
    const label = `Open ${figurine.name}`

    if (to) {
        return (
            <Link
                to={to}
                onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
                aria-label={label}
                className={itemClassName}
            >
                <FigurineListItemBody figurine={figurine} />
            </Link>
        )
    }

    return (
        <article className={itemClassName} aria-label={label}>
            <FigurineListItemBody figurine={figurine} />
        </article>
    )
}
