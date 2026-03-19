type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

type PaginationItem = number | 'ellipsis'

function ChevronLeftIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12.5 4.5-5 5 5 5" />
        </svg>
    )
}

function ChevronRightIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7.5 4.5 5 5-5 5" />
        </svg>
    )
}

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const items: PaginationItem[] = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 2)

    if (start > 2) {
        items.push('ellipsis')
    }

    for (let page = start; page <= end; page += 1) {
        items.push(page)
    }

    if (end < totalPages - 1) {
        items.push('ellipsis')
    }

    items.push(totalPages)
    return items
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    const items = buildPaginationItems(currentPage, totalPages)

    return (
        <nav
            aria-label="Search pagination"
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#0a0a11] sm:gap-3 sm:text-base"
        >
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-xl px-2 py-2 font-medium transition hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
            >
                <ChevronLeftIcon />
                <span>Previous</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                {items.map((item, index) =>
                    item === 'ellipsis' ? (
                        <span
                            key={`pagination-ellipsis-${index}`}
                            className="inline-flex size-10 items-center justify-center rounded-xl text-lg"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPageChange(item)}
                            aria-current={item === currentPage ? 'page' : undefined}
                            className={`inline-flex size-10 items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 ${
                                item === currentPage
                                    ? 'bg-[#ffa7b8] text-[#0a0a11]'
                                    : 'text-[#0a0a11] hover:text-[#ed5f7f]'
                            }`}
                        >
                            {item}
                        </button>
                    )
                )}
            </div>

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl px-2 py-2 font-medium transition hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
            >
                <span>Next</span>
                <ChevronRightIcon />
            </button>
        </nav>
    )
}
