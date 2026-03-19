import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonProps = {
    icon: ReactNode
    'aria-label': string
    badge?: string | number
} & ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({
    icon,
    badge,
    className,
    type = 'button',
    ...props
}: IconButtonProps) {
    return (
        <button
            type={type}
            className={`relative inline-flex size-9 items-center justify-center rounded-full border border-transparent text-[#222] transition hover:bg-[#f0eeef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 ${className ?? ''}`}
            {...props}
        >
            <span className="inline-flex size-5 items-center justify-center">{icon}</span>
            {badge ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#ed5f7f] px-1 text-[0.625rem] font-semibold text-white">
                    {badge}
                </span>
            ) : null}
        </button>
    )
}
