import type { SelectHTMLAttributes } from 'react'

type DropdownOption = {
    label: string
    value: string
}

type DropdownSelectProps = {
    options: DropdownOption[]
    iconSrc?: string
    ariaLabel: string
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>

export function DropdownSelect({
    options,
    iconSrc,
    ariaLabel,
    className,
    ...props
}: DropdownSelectProps) {
    return (
        <div className={`relative w-full ${className ?? ''}`}>
            <select
                aria-label={ariaLabel}
                className="h-9 w-full appearance-none rounded-md border border-[#9f9f9f] bg-[#fffbfc] px-3 pr-12 text-xs font-medium text-[#666264] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 sm:text-sm"
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {iconSrc ? (
                <img
                    src={iconSrc}
                    alt=""
                    className="pointer-events-none absolute right-7 top-1/2 size-4 -translate-y-1/2"
                />
            ) : null}

            <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.625rem] text-[#666264]"
            >
                ▼
            </span>
        </div>
    )
}
