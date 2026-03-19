type StatBadgeProps = {
    label: string
    value: string
    helper?: string
}

export function StatBadge({ label, value, helper }: StatBadgeProps) {
    return (
        <article className="rounded-lg border border-[#d8d6d7] bg-[#f8f7f7] px-3 py-2">
            <p className="text-[0.625rem] font-semibold uppercase tracking-wide text-[#6f6a6c]">
                {label}
            </p>
            <p className="mt-1 text-lg font-semibold text-[#222]">{value}</p>
            {helper ? <p className="text-xs text-[#8c8889]">{helper}</p> : null}
        </article>
    )
}
