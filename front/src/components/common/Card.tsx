import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={`rounded-xl border border-[#d9d7d8] bg-white ${className ?? ''}`}
            {...props}
        />
    )
}
