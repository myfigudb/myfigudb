import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { SkeletonBlock } from './Skeletons'

export type DataTableSortDirection = 'asc' | 'desc' | null
type TableAlignment = 'left' | 'center' | 'right'

export type DataTableColumn<T> = {
    id: string
    header: ReactNode
    renderCell: (row: T, rowIndex: number) => ReactNode
    align?: TableAlignment
    sortable?: boolean
    sortDirection?: DataTableSortDirection
    onSort?: () => void
    headerClassName?: string
    cellClassName?: string
}

type DataTableProps<T> = {
    columns: Array<DataTableColumn<T>>
    rows: T[]
    getRowId: (row: T, rowIndex: number) => string
    caption?: string
    minWidthClassName?: string
    containerClassName?: string
    tableClassName?: string
    rowClassName?: string
    isLoading?: boolean
    loadingRowCount?: number
    error?: string | null
    onRetry?: () => void
    emptyTitle?: string
    emptyDescription?: string
}

function SortIndicator({
    direction,
}: {
    direction: DataTableSortDirection
}) {
    const activeUp = direction === 'asc'
    const activeDown = direction === 'desc'

    return (
        <span className="inline-flex flex-col items-center justify-center gap-0.5 text-[#9f9f9f]">
            <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`size-3 ${activeUp ? 'text-[#0a0a11]' : ''}`}
                fill="currentColor"
            >
                <path d="M6 2 9.5 6H2.5z" />
            </svg>
            <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`size-3 ${activeDown ? 'text-[#0a0a11]' : ''}`}
                fill="currentColor"
            >
                <path d="M6 10 2.5 6h7z" />
            </svg>
        </span>
    )
}

function getAlignClass(align: TableAlignment | undefined) {
    if (align === 'center') {
        return 'text-center'
    }

    if (align === 'right') {
        return 'text-right'
    }

    return 'text-left'
}

export function DataTable<T>({
    columns,
    rows,
    getRowId,
    caption,
    minWidthClassName = 'min-w-[60rem]',
    containerClassName,
    tableClassName,
    rowClassName,
    isLoading = false,
    loadingRowCount = 8,
    error,
    onRetry,
    emptyTitle = 'No rows available',
    emptyDescription = 'There is no data to display yet.',
}: DataTableProps<T>) {
    const loadingRows = Array.from({ length: loadingRowCount })

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />
    }

    if (!isLoading && rows.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />
    }

    return (
        <div className={`overflow-x-auto ${containerClassName ?? ''}`}>
            <table
                className={`w-full ${minWidthClassName} border-separate border-spacing-0 text-sm text-[#0a0a11] ${tableClassName ?? ''}`}
            >
                {caption ? <caption className="sr-only">{caption}</caption> : null}

                <thead>
                    <tr>
                        {columns.map((column, columnIndex) => {
                            const alignClass = getAlignClass(column.align)
                            const isLastColumn = columnIndex === columns.length - 1
                            const sortDirection = column.sortDirection ?? null

                            return (
                                <th
                                    key={column.id}
                                    scope="col"
                                    aria-sort={
                                        sortDirection === 'asc'
                                            ? 'ascending'
                                            : sortDirection === 'desc'
                                              ? 'descending'
                                              : 'none'
                                    }
                                    className={`border-b border-[#e8e8e8] px-4 py-3 text-xs font-medium tracking-[0.01em] text-[#0a0a11] sm:text-sm ${alignClass} ${!isLastColumn ? 'border-r border-[#efebed]' : ''} ${column.headerClassName ?? ''}`}
                                >
                                    {column.sortable && column.onSort ? (
                                        <button
                                            type="button"
                                            onClick={column.onSort}
                                            className={`inline-flex w-full items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/35 ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}
                                        >
                                            <span>{column.header}</span>
                                            <SortIndicator direction={sortDirection} />
                                        </button>
                                    ) : (
                                        <span>{column.header}</span>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                </thead>

                <tbody>
                    {isLoading
                        ? loadingRows.map((_, rowIndex) => (
                              <tr key={`data-table-skeleton-${rowIndex}`}>
                                  {columns.map((column, columnIndex) => (
                                      <td
                                          key={`${column.id}-skeleton-${rowIndex}`}
                                          className={`border-b border-[#f0edef] px-4 py-3 ${columnIndex === 0 ? 'w-12' : ''}`}
                                      >
                                          <SkeletonBlock className="h-4 w-full rounded-md" />
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : rows.map((row, rowIndex) => {
                              const rowId = getRowId(row, rowIndex)

                              return (
                                  <tr
                                      key={rowId}
                                      className={`border-b border-[#f0edef] last:border-b-0 ${rowClassName ?? ''}`}
                                  >
                                      {columns.map((column) => (
                                          <td
                                              key={`${column.id}-${rowId}`}
                                              className={`border-b border-[#f0edef] px-4 py-3 align-middle text-xs text-[#0a0a11] sm:text-sm ${getAlignClass(column.align)} ${column.cellClassName ?? ''}`}
                                          >
                                              {column.renderCell(row, rowIndex)}
                                          </td>
                                      ))}
                                  </tr>
                              )
                          })}
                </tbody>
            </table>
        </div>
    )
}
