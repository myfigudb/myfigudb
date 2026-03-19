import { useMemo } from 'react'
import { figurineApi } from '../api/figurine.api'
import type {
    ApiEditor,
    ApiFigure,
    ApiFigureComment,
    ApiListing,
    ApiRange,
} from '../api/types'
import { useApiResource } from './useApiResource'

function toArray<T>(value: T[] | undefined | null): T[] {
    return Array.isArray(value) ? value : []
}

function getFigureListings(figure: ApiFigure | null) {
    return toArray<ApiListing>(figure?.listings)
}

export function useFigureDetails(figureId: string | undefined) {
    return useApiResource<ApiFigure>(
        `figure:${figureId ?? 'none'}`,
        () => figurineApi.getFigureById(figureId as string),
        { enabled: Boolean(figureId) }
    )
}

export function useFigureReferences(
    figure: ApiFigure | null
) {
    return useMemo(() => {
        const editor: ApiEditor | null = figure?.editor ?? null
        const range: ApiRange | null = figure?.ranges ?? null

        return {
            data: { editor, range },
            isLoading: false,
            error: null as string | null,
            retry: () => {},
        }
    }, [figure])
}

export function useFigureResellers(
    figureId: string | undefined,
    figure: ApiFigure | null
) {
    return useApiResource<ApiListing[]>(
        `figure-resellers:${figureId ?? 'none'}:${figure?.updated_at ?? 'none'}`,
        async () => getFigureListings(figure),
        { enabled: Boolean(figureId) && Boolean(figure) }
    )
}

export function useFigureSuggestions(
    figureId: string | undefined,
    currentFigure: ApiFigure | null
) {
    return useApiResource<ApiFigure[]>(
        `figure-suggestions:${figureId ?? 'none'}:${currentFigure?.range_id ?? 'none'}`,
        async () => {
            const allFigures = await figurineApi.listFigures()
            const withoutCurrent = allFigures.filter((figure) => figure.id !== figureId)

            if (currentFigure?.range_id) {
                const sameRange = withoutCurrent.filter(
                    (figure) => figure.range_id === currentFigure.range_id
                )

                if (sameRange.length > 0) {
                    return sameRange.slice(0, 10)
                }
            }

            return withoutCurrent.slice(0, 10)
        },
        { enabled: Boolean(figureId) }
    )
}

export function useFigureComments(figure: ApiFigure | null) {
    return useMemo(() => {
        return toArray<ApiFigureComment>(figure?.comments)
    }, [figure])
}
