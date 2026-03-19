import type { ReactNode } from 'react'

type FigurineNavSection =
    | 'overview'
    | 'resellers'
    | 'comments'
    | 'stats'
    | 'related'
    | 'gallery'

type FigurineNavProps = {
    active?: FigurineNavSection
    className?: string
}

type TabConfig = {
    id: FigurineNavSection
    label: string
    iconSrc: string
    href: string
}

const tabs: TabConfig[] = [
    {
        id: 'overview',
        label: 'Overview',
        iconSrc: '/assets/icons/figure_navbar/overview.svg',
        href: '#overview',
    },
    {
        id: 'resellers',
        label: 'Resellers',
        iconSrc: '/assets/icons/figure_navbar/resellers.svg',
        href: '#resellers',
    },
    {
        id: 'comments',
        label: 'Comments',
        iconSrc: '/assets/icons/figure_navbar/comments.svg',
        href: '#comments',
    },
    {
        id: 'stats',
        label: 'Stats',
        iconSrc: '/assets/icons/figure_navbar/stats.svg',
        href: '#stats',
    },
    {
        id: 'related',
        label: 'Related',
        iconSrc: '/assets/icons/figure_navbar/related.svg',
        href: '#related',
    },
    {
        id: 'gallery',
        label: 'Gallery',
        iconSrc: '/assets/icons/figure_navbar/gallery.svg',
        href: '#gallery',
    },
]

function NavItem({
    active,
    label,
    icon,
    href,
}: {
    active: boolean
    label: string
    icon: ReactNode
    href: string
}) {
    return (
        <a
            href={href}
            className={`group inline-flex items-center gap-1.5 border-b-2 pb-2 text-xs transition sm:gap-2 sm:text-sm lg:text-base ${
                active
                    ? 'border-[#ed5f7f] font-semibold text-[#222]'
                    : 'border-transparent font-medium text-[#222] hover:text-[#ed5f7f]'
            }`}
        >
            <span className="inline-flex size-4 items-center justify-center sm:size-5 lg:size-6">
                {icon}
            </span>
            <span>{label}</span>
        </a>
    )
}

export function FigurineNav({ active = 'overview', className }: FigurineNavProps) {
    return (
        <nav
            aria-label="Figure sections"
            className={`overflow-x-auto ${className ?? ''}`}
        >
            <div className="flex min-w-max items-center gap-4 sm:gap-5 lg:gap-7">
                {tabs.map((tab) => (
                    <NavItem
                        key={tab.id}
                        active={tab.id === active}
                        href={tab.href}
                        label={tab.label}
                        icon={<img src={tab.iconSrc} alt="" className="size-4 sm:size-5 lg:size-6" />}
                    />
                ))}
            </div>
        </nav>
    )
}
