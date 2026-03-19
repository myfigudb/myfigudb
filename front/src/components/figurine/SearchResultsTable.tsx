import { Link } from 'react-router-dom'
import type { ApiFigure } from '../../api/types'
import {
    DataTable,
    type DataTableColumn,
    type DataTableSortDirection,
} from '../common/DataTable'
import type { FigureSearchSort } from '../../types/search'
import {
    extractFigureImageUrls,
    getFigureCharacterLabel,
    getFigureLicenseLabel,
    getFigureMinimumPriceLabel,
    getFigureScoreLabel,
} from '../../utils/figurine'
import { getSearchResultsEmptyDescription } from './searchResults.helpers'

type SearchResultsTableProps = {
    figures: ApiFigure[]
    isLoading: boolean
    error: string | null
    onRetry: () => void
    searchTerm: string
    currentPage: number
    pageSize: number
    sort: FigureSearchSort
    onSortChange: (nextSort: FigureSearchSort) => void
}

const sortableColumns = {
    title: {
        asc: 'name-asc',
        desc: 'name-desc',
    },
    license: {
        asc: 'license-asc',
        desc: 'license-desc',
    },
    character: {
        asc: 'character-asc',
        desc: 'character-desc',
    },
    score: {
        asc: 'rating-asc',
        desc: 'rating-desc',
    },
    price: {
        asc: 'price-asc',
        desc: 'price-desc',
    },
} satisfies Record<
    string,
    {
        asc: FigureSearchSort
        desc: FigureSearchSort
    }
>

function getColumnSortDirection(
    currentSort: FigureSearchSort,
    columnKey: keyof typeof sortableColumns
): DataTableSortDirection {
    const config = sortableColumns[columnKey]

    if (currentSort === config.asc) {
        return 'asc'
    }

    if (currentSort === config.desc) {
        return 'desc'
    }

    return null
}

function getNextColumnSort(
    currentSort: FigureSearchSort,
    columnKey: keyof typeof sortableColumns
) {
    return getColumnSortDirection(currentSort, columnKey) === 'asc'
        ? sortableColumns[columnKey].desc
        : sortableColumns[columnKey].asc
}

function ScoreCell({ value }: { value: string }) {
    return (
        <span className="inline-flex items-center justify-center gap-1 text-xs font-medium text-[#0a0a11] sm:text-sm">
            <img src="/assets/icons/misc/note_star.svg" alt="" className="size-3.5 shrink-0" />
            <span>{value}</span>
        </span>
    )
}

export function SearchResultsTable({
    figures,
    isLoading,
    error,
    onRetry,
    searchTerm,
    currentPage,
    pageSize,
    sort,
    onSortChange,
}: SearchResultsTableProps) {
    const rankOffset = (currentPage - 1) * pageSize

    const columns: Array<DataTableColumn<ApiFigure>> = [
        {
            id: 'rank',
            header: '#',
            align: 'center',
            headerClassName: 'w-12',
            cellClassName: 'w-12 text-[#4f4b4d]',
            renderCell: (_figure, rowIndex) => (
                <span>{rankOffset + rowIndex + 1}</span>
            ),
        },
        {
            id: 'image',
            header: 'Image',
            headerClassName: 'w-24',
            cellClassName: 'w-24',
            renderCell: (figure) => {
                const imageUrl = extractFigureImageUrls(figure)[0] ?? null

                return (
                    <span className="block w-14 overflow-hidden rounded-lg border border-black/10 bg-[#f3f1f2]">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={figure.name}
                                className="aspect-square w-full object-cover"
                            />
                        ) : (
                            <span className="flex aspect-square w-full items-center justify-center px-1 text-[0.625rem] text-[#8d898a]">
                                N/A
                            </span>
                        )}
                    </span>
                )
            },
        },
        {
            id: 'title',
            header: 'Figure title',
            sortable: true,
            sortDirection: getColumnSortDirection(sort, 'title'),
            onSort: () => onSortChange(getNextColumnSort(sort, 'title')),
            cellClassName: 'min-w-0 max-w-[24rem]',
            renderCell: (figure) => (
                <Link
                    to={`/figures/${figure.id}`}
                    className="line-clamp-2 text-xs font-medium leading-snug text-[#0a0a11] transition hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 sm:text-sm"
                >
                    {figure.name}
                </Link>
            ),
        },
        {
            id: 'license',
            header: 'License',
            sortable: true,
            sortDirection: getColumnSortDirection(sort, 'license'),
            onSort: () => onSortChange(getNextColumnSort(sort, 'license')),
            cellClassName: 'w-[16%] text-[#4f4b4d]',
            renderCell: (figure) => getFigureLicenseLabel(figure) ?? 'N/A',
        },
        {
            id: 'character',
            header: 'Character',
            sortable: true,
            sortDirection: getColumnSortDirection(sort, 'character'),
            onSort: () => onSortChange(getNextColumnSort(sort, 'character')),
            cellClassName: 'w-[16%] text-[#4f4b4d]',
            renderCell: (figure) => getFigureCharacterLabel(figure) ?? 'N/A',
        },
        {
            id: 'score',
            header: 'Score',
            align: 'center',
            sortable: true,
            sortDirection: getColumnSortDirection(sort, 'score'),
            onSort: () => onSortChange(getNextColumnSort(sort, 'score')),
            headerClassName: 'w-24',
            cellClassName: 'w-24',
            renderCell: (figure) => <ScoreCell value={getFigureScoreLabel(figure)} />,
        },
        {
            id: 'price',
            header: 'Price',
            align: 'right',
            sortable: true,
            sortDirection: getColumnSortDirection(sort, 'price'),
            onSort: () => onSortChange(getNextColumnSort(sort, 'price')),
            headerClassName: 'w-24',
            cellClassName: 'w-24 font-medium',
            renderCell: (figure) => getFigureMinimumPriceLabel(figure),
        },
    ]

    return (
        <DataTable
            caption="Search results table"
            columns={columns}
            rows={figures}
            getRowId={(figure) => figure.id}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            emptyTitle="No figures found"
            emptyDescription={getSearchResultsEmptyDescription(searchTerm)}
        />
    )
}
