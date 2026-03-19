import type { ReactNode } from 'react'

type ChipProps = {
    children: ReactNode
    tone?: 'neutral' | 'positive' | 'accent'
    icon?: ReactNode
}

const toneClass = {
    neutral: 'bg-[#f2f0f1] text-[#494546] border-[#d9d6d7]',
    positive: 'bg-[#e5f7e9] text-[#2f7d52] border-[#9fd5ae]',
    accent: 'bg-[#ffe8ed] text-[#d64667] border-[#f1b8c5]',
}

export function Chip({ children, tone = 'neutral', icon }: ChipProps) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${toneClass[tone]}`}
        >
            {icon}
            {children}
        </span>
    )
}
