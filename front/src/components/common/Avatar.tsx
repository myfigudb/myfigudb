import type { ImgHTMLAttributes } from 'react'

type AvatarProps = {
    name?: string
    size?: 'sm' | 'md' | 'lg'
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'>

const sizeClass = {
    sm: 'size-8',
    md: 'size-11',
    lg: 'size-14',
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).slice(0, 2)
    return parts.map((part) => part.charAt(0).toUpperCase()).join('')
}

export function Avatar({
    name = 'User',
    src,
    size = 'md',
    className,
    ...props
}: AvatarProps) {
    return (
        <span
            className={`inline-flex items-center justify-center overflow-hidden rounded-full border border-[#dfdcdd] bg-[#f1eff0] ${sizeClass[size]} ${className ?? ''}`}
            aria-label={name}
        >
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className="size-full object-cover"
                    {...props}
                />
            ) : (
                <span className="text-xs font-semibold text-[#6e6a6b]">{getInitials(name)}</span>
            )}
        </span>
    )
}
