import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClass: Record<ButtonVariant, string> = {
    primary:
        'bg-[#ed5f7f] text-white border border-[#ed5f7f] hover:opacity-90 focus-visible:ring-[#ed5f7f]/30',
    secondary:
        'bg-[#f5f3f4] text-[#222] border border-[#d9d9d9] hover:bg-[#ece8ea] focus-visible:ring-[#ed5f7f]/20',
    outline:
        'bg-transparent text-[#f5f3f4] border border-[#8a8a8a] hover:border-[#ed5f7f] hover:text-[#fffbfc] focus-visible:ring-[#ed5f7f]/30',
    ghost:
        'bg-transparent text-[#222] border border-transparent hover:bg-[#f0eeef] focus-visible:ring-[#ed5f7f]/20',
    dark:
        'bg-[#141416] text-[#fffbfc] border border-[#141416] hover:opacity-95 focus-visible:ring-[#141416]/20',
}

const sizeClass: Record<ButtonSize, string> = {
    sm: 'min-h-9 px-3 py-1.5 text-xs',
    md: 'min-h-10 px-4 py-2 text-sm',
    lg: 'min-h-12 px-5 py-2.5 text-base',
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${sizeClass[size]} ${className ?? ''}`}
            {...props}
        >
            {children}
        </button>
    )
}
