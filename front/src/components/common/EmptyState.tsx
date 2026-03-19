import type { ReactNode } from 'react'

type EmptyStateProps = {
    title: string
    description: string
    action?: ReactNode
    light?: boolean
}

export function EmptyState({
    title,
    description,
    action,
    light = true,
}: EmptyStateProps) {
    return (
        <div
            className={`rounded-xl border px-5 py-6 text-sm ${
                light
                    ? 'border-[#dedbdd] bg-[#fbf9fa] text-[#5f5b5d]'
                    : 'border-[#3a3839] bg-[#2a2829] text-[#c9c4c6]'
            }`}
        >
            <p className="font-semibold">{title}</p>
            <p className="mt-1">{description}</p>
            {action ? <div className="mt-3">{action}</div> : null}
        </div>
    )
}
