import type { ApiFigure } from '../../api/types'
import { formatNumber } from '../../utils/figurine'

type NotesAndStatsProps = {
    figure: ApiFigure
}

type StatItem = {
    id: string
    label: string
    value: string
    helper?: string
    withStar?: boolean
}

export function NotesAndStats({ figure }: NotesAndStatsProps) {
    const scoreValue =
        typeof figure.score === 'number' && Number.isFinite(figure.score)
            ? figure.score.toFixed(2)
            : 'N/A'

    const scoreHelper =
        Array.isArray(figure.comments) && figure.comments.length > 0
            ? `${formatNumber(figure.comments.length)} users`
            : 'N/A users'

    const stats: StatItem[] = [
        {
            id: 'score',
            label: 'SCORE',
            value: scoreValue,
            helper: scoreHelper,
            withStar: true,
        },
        {
            id: 'ranked',
            label: 'RANKED',
            value:
                typeof figure.ranked === 'number'
                    ? `# ${formatNumber(figure.ranked)}`
                    : 'N/A',
        },
        {
            id: 'owned',
            label: 'OWNED',
            value:
                typeof figure.owned === 'number'
                    ? `${formatNumber(figure.owned)} users`
                    : 'N/A',
        },
        {
            id: 'ordered',
            label: 'ORDERED',
            value:
                typeof figure.ordered === 'number'
                    ? `${formatNumber(figure.ordered)} users`
                    : 'N/A',
        },
        {
            id: 'wished',
            label: 'WISHED',
            value:
                typeof figure.wished === 'number'
                    ? `${formatNumber(figure.wished)} users`
                    : 'N/A',
        },
    ]

    return (
        <section
            id="stats"
            className="rounded border border-[#dbd6d7] bg-[#fbf2f4] px-3 sm:px-4"
        >
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-2">
                {stats.map((stat) => (
                    <article
                        key={stat.id}
                        className="flex min-h-20 min-w-0 flex-col items-center justify-center gap-1 text-center sm:min-h-24"
                    >
                        <p className="text-[0.625rem] font-medium uppercase tracking-wide text-[#222] sm:text-xs">
                            {stat.label}
                        </p>
                        <div className="flex items-center justify-center gap-1">
                            {stat.withStar ? (
                                <img
                                    src="/assets/icons/misc/note_star.svg"
                                    alt=""
                                    className="size-4 sm:size-5"
                                />
                            ) : null}
                            <p className="text-lg font-semibold leading-none text-[#222] sm:text-xl">
                                {stat.value}
                            </p>
                        </div>
                        {stat.helper ? (
                            <p className="text-[0.625rem] font-light text-[#4b4849] sm:text-xs">
                                {stat.helper}
                            </p>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    )
}
