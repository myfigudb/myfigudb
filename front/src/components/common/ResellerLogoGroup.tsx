import type { FigureResellerSummary } from '../../utils/figurine'

type ResellerLogoGroupProps = {
    resellers: FigureResellerSummary[]
    maxVisible?: number
    className?: string
}

function getInitials(name: string) {
    const parts = name
        .split(/[\s-]+/)
        .map((part) => part.trim())
        .filter(Boolean)

    if (!parts.length) {
        return 'N/A'
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
}

function ResellerBadge({
    reseller,
}: {
    reseller: FigureResellerSummary
}) {
    const label = reseller.domain ?? reseller.name

    return (
        <span
            title={reseller.name}
            aria-label={reseller.name}
            className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/15 bg-[#fffbfc] text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#0a0a11] shadow-[0_1px_2px_rgba(10,10,17,0.08)]"
        >
            {reseller.logoUrl ? (
                <img
                    src={reseller.logoUrl}
                    alt={label}
                    className="size-full object-contain p-1"
                />
            ) : (
                <span>{getInitials(reseller.name)}</span>
            )}
        </span>
    )
}

export function ResellerLogoGroup({
    resellers,
    maxVisible = 3,
    className,
}: ResellerLogoGroupProps) {
    if (!resellers.length) {
        return (
            <span
                className={`inline-flex min-h-8 items-center justify-center rounded-md border border-[#d9d5d7] bg-[#f3f1f2] px-2 text-[0.7rem] font-medium text-[#6d686b] ${className ?? ''}`}
            >
                N/A
            </span>
        )
    }

    const visibleResellers = resellers.slice(0, maxVisible)
    const overflowCount = Math.max(resellers.length - maxVisible, 0)

    return (
        <div className={`flex flex-nowrap items-center gap-1.5 ${className ?? ''}`}>
            {visibleResellers.map((reseller) => (
                <ResellerBadge key={reseller.id} reseller={reseller} />
            ))}

            {overflowCount > 0 ? (
                <span
                    aria-label={`${overflowCount} more resellers`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#4a4a4a] text-[0.7rem] font-semibold text-[#fffbfc] shadow-[0_1px_2px_rgba(10,10,17,0.12)]"
                >
                    +{overflowCount}
                </span>
            ) : null}
        </div>
    )
}
