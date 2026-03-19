import type { HTMLAttributes } from 'react'

type SkeletonBlockProps = {
    className?: string
} & HTMLAttributes<HTMLDivElement>

export function SkeletonBlock({ className, ...props }: SkeletonBlockProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[#ece9ea] ${className ?? ''}`}
            aria-hidden="true"
            {...props}
        />
    )
}
