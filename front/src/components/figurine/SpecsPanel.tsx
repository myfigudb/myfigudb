import { useState } from 'react'
import type { ApiFigure } from '../../api/types'
import { formatDate } from '../../utils/figurine'
import { DropdownSelect } from '../common/DropdownSelect'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { SkeletonBlock } from '../common/Skeletons'
import { NotesAndStats } from './NotesAndStats'
import { logModalAction } from '../../utils/modal'

type SpecsPanelProps = {
    figure: ApiFigure
    editorName: string | null
    rangeName: string | null
    isReferencesLoading: boolean
    referencesError: string | null
    onRetryReferences: () => void
}

type DetailRow = {
    id: string
    label: string
    value: string
    iconSrc: string
}

const statusOptions = [
    { value: '', label: 'Status' },
    { value: 'Ordered', label: 'Ordered' },
    { value: 'Pre-ordered', label: 'Pre-ordered' },
    { value: 'Owned', label: 'Owned' },
    { value: 'Wished', label: 'Wished' },
] as const

const scoreOptions = [
    { value: '', label: 'Score' },
    { value: '10', label: '10/10' },
    { value: '9', label: '9/10' },
    { value: '8', label: '8/10' },
    { value: '7', label: '7/10' },
    { value: '6', label: '6/10' },
    { value: '5', label: '5/10' },
    { value: '4', label: '4/10' },
    { value: '3', label: '3/10' },
    { value: '2', label: '2/10' },
    { value: '1', label: '1/10' },
] as const

function getFigureNames(values: Array<{ name: string }> | undefined) {
    if (!values || values.length === 0) {
        return 'N/A'
    }

    return values.map((value) => value.name).join(', ')
}

export function SpecsPanel({
    figure,
    editorName,
    rangeName,
    isReferencesLoading,
    referencesError,
    onRetryReferences,
}: SpecsPanelProps) {
    const initialStatus = statusOptions.some((option) => option.value === figure.status)
        ? (figure.status ?? '')
        : ''
    const initialScoreValue =
        typeof figure.score === 'number' && Number.isFinite(figure.score)
            ? String(Math.round(figure.score))
            : ''
    const initialScore = scoreOptions.some((option) => option.value === initialScoreValue)
        ? initialScoreValue
        : ''

    const [selectedStatus, setSelectedStatus] = useState(initialStatus)
    const [selectedScore, setSelectedScore] = useState(initialScore)

    const hasHeight = typeof figure.height === 'number' && figure.height > 0
    const unit = figure.unit ?? ''
    const sizeValue =
        figure.scale && hasHeight
            ? `${figure.scale} - ${figure.height}${unit}`
            : figure.scale
            ? figure.scale
            : hasHeight
            ? `${figure.height}${unit}`
            : 'N/A'

    const detailRows: DetailRow[] = [
        {
            id: 'licenses',
            label: 'License(s)',
            value: getFigureNames(figure.licenses),
            iconSrc: '/assets/icons/figure_spec/license.svg',
        },
        {
            id: 'characters',
            label: 'Character(s)',
            value: getFigureNames(figure.characters),
            iconSrc: '/assets/icons/figure_spec/character.svg',
        },
        {
            id: 'series',
            label: 'Series',
            value: rangeName ?? 'N/A',
            iconSrc: '/assets/icons/figure_spec/series.svg',
        },
        {
            id: 'editor',
            label: 'Editor',
            value: editorName ?? 'N/A',
            iconSrc: '/assets/icons/figure_spec/editor.svg',
        },
        {
            id: 'size',
            label: 'Size',
            value: sizeValue,
            iconSrc: '/assets/icons/figure_spec/size.svg',
        },
        {
            id: 'release-date',
            label: 'Release date',
            value: formatDate(figure.release_date),
            iconSrc: '/assets/icons/figure_spec/release_date.svg',
        },
        {
            id: 'materials',
            label: 'Materials',
            value: getFigureNames(figure.materials),
            iconSrc: '/assets/icons/figure_spec/materials.svg',
        },
    ]

    return (
        <section className="space-y-6" id="overview">
            <div className="space-y-3">
                <NotesAndStats figure={figure} />

                <div className="flex flex-col gap-3 rounded border border-[#dbd6d7] bg-[#fbf2f4] px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
                    <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2 sm:gap-3">
                        <DropdownSelect
                            ariaLabel="Filter by status"
                            value={selectedStatus}
                            options={statusOptions.map((option) => ({
                                value: option.value,
                                label: option.label,
                            }))}
                            className="sm:w-40"
                            onChange={(event) => {
                                const nextStatus = event.target.value
                                setSelectedStatus(nextStatus)
                                console.log('[DROPDOWN] status-filter', nextStatus)
                            }}
                        />
                        <DropdownSelect
                            ariaLabel="Filter by score"
                            value={selectedScore}
                            options={scoreOptions.map((option) => ({
                                value: option.value,
                                label: option.label,
                            }))}
                            iconSrc="/assets/icons/misc/note_star.svg"
                            className="sm:w-40"
                            onChange={(event) => {
                                const nextScore = event.target.value
                                setSelectedScore(nextScore)
                                console.log('[DROPDOWN] score-filter', nextScore)
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => logModalAction('manage-figure')}
                        className="inline-flex h-9 w-full items-center justify-center rounded-md bg-[#222] px-4 text-xs font-medium text-[#fffbfc] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222]/40 sm:w-40 sm:text-sm"
                    >
                        Manage Figure
                    </button>
                </div>
            </div>

            {isReferencesLoading ? (
                <div className="rounded border border-[#dbd6d7] bg-[#fbf2f4] p-5">
                    <SkeletonBlock className="h-6 w-44" />
                    <div className="mt-4 space-y-3">
                        <SkeletonBlock className="h-5 w-full" />
                        <SkeletonBlock className="h-5 w-11/12" />
                        <SkeletonBlock className="h-5 w-10/12" />
                        <SkeletonBlock className="h-5 w-9/12" />
                    </div>
                </div>
            ) : null}

            {referencesError ? (
                <ErrorState message={referencesError} onRetry={onRetryReferences} />
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <h2 className="text-base font-semibold text-[#222] sm:text-lg">
                        Figure Details
                    </h2>
                    <dl className="mt-4 space-y-2">
                        {detailRows.map((row) => (
                            <div key={row.id} className="flex items-start gap-3">
                                <img src={row.iconSrc} alt="" className="mt-0.5 size-4 sm:size-5" />
                                <div className="text-sm text-[#222] sm:text-base">
                                    <dt className="inline font-semibold">{row.label}: </dt>
                                    <dd className="inline">{row.value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-[#222] sm:text-lg">
                        Figure Description
                    </h2>
                    {figure.commentary ? (
                        <p className="mt-4 text-justify text-sm font-light leading-6 text-[#222] sm:text-base">
                            {figure.commentary}
                        </p>
                    ) : (
                        <div className="mt-4">
                            <EmptyState
                                title="No description available"
                                description="This figurine currently has no published description in the API."
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
