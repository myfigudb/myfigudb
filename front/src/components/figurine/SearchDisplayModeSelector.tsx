import type { ReactNode } from 'react'
import type { SearchViewMode } from '../../types/search'

type SearchDisplayModeSelectorProps = {
    viewMode: SearchViewMode
    onChange: (nextViewMode: SearchViewMode) => void
}

function ListIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M7 5h8" />
            <path d="M7 10h8" />
            <path d="M7 15h8" />
            <path d="M4.5 5h.01" />
            <path d="M4.5 10h.01" />
            <path d="M4.5 15h.01" />
        </svg>
    )
}

function GridIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="3.5" width="5" height="5" rx="1" />
            <rect x="11.5" y="3.5" width="5" height="5" rx="1" />
            <rect x="3.5" y="11.5" width="5" height="5" rx="1" />
            <rect x="11.5" y="11.5" width="5" height="5" rx="1" />
        </svg>
    )
}

function TableIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="14" height="12" rx="1.5" />
            <path d="M3 8h14" />
            <path d="M8.5 4v12" />
        </svg>
    )
}

const viewOptions: Array<{
    value: SearchViewMode
    label: string
    icon: ReactNode
}> = [
    { value: 'list', label: 'List', icon: <ListIcon /> },
    { value: 'cards', label: 'Cards', icon: <GridIcon /> },
    { value: 'table', label: 'Table', icon: <TableIcon /> },
]

export function SearchDisplayModeSelector({
    viewMode,
    onChange,
}: SearchDisplayModeSelectorProps) {
    return (
        <div className="grid w-full grid-cols-3 rounded-xl bg-[#e8e6e7] p-1 sm:w-auto sm:min-w-[16.5rem]">
            {viewOptions.map((option) => {
                const isActive = option.value === viewMode

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(option.value)}
                        className={`inline-flex items-center justify-center gap-2 rounded-[0.625rem] px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 sm:text-sm ${
                            isActive
                                ? 'bg-[#fffbfc] text-[#0a0a11] shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                                : 'text-[#9f9f9f] hover:text-[#222]'
                        }`}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
