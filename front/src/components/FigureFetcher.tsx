import { useCallback, useEffect, useState } from 'react'
import { figureService } from '../services/figure.service'
import type { ApiError } from '../services/http'
import type { Figure } from '../types/figure'

type Mode = 'all' | 'id' | 'search'

export default function FigureFetcher() {
    const [figures, setFigures] = useState<Figure[]>([])
    const [mode, setMode] = useState<Mode>('all')
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleError = useCallback((e: unknown) => {
        const err = e as ApiError
        setError(err?.message ?? 'Request failed')
    }, [])

    const loadAll = useCallback(async () => {
        setMode('all')
        setIsLoading(true)
        setError(null)
        try {
            const data = await figureService.list()
            setFigures(data)
        } catch (e) {
            setFigures([])
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }, [handleError])

    const loadById = useCallback(async () => {
        const trimmedId = id.trim()
        if (!trimmedId) return
        setMode('id')
        setIsLoading(true)
        setError(null)
        try {
            const data = await figureService.getById(trimmedId)
            setFigures([data])
        } catch (e) {
            setFigures([])
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }, [handleError, id])

    const searchByName = useCallback(async () => {
        const trimmedName = name.trim()
        if (!trimmedName) return
        setMode('search')
        setIsLoading(true)
        setError(null)
        try {
            const data = await figureService.searchByName(trimmedName)
            setFigures(data)
        } catch (e) {
            setFigures([])
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }, [handleError, name])

    useEffect(() => {
        void loadAll()
    }, [loadAll])

    const canLoadById = id.trim().length > 0
    const canSearchByName = name.trim().length > 0

    return (
        <section>
            <h2>Figures</h2>

            <div>
                <button onClick={loadAll} disabled={isLoading}>
                    Load all
                </button>
            </div>

            <div>
                <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Figure id"
                />
                <button onClick={loadById} disabled={isLoading || !canLoadById}>
                    Load by id
                </button>
            </div>

            <div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name"
                />
                <button onClick={searchByName} disabled={isLoading || !canSearchByName}>
                    Search
                </button>
            </div>

            <p>Mode: {mode}</p>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && figures.length === 0 && <p>No results</p>}

            {figures.length > 0 && (
                <ul>
                    {figures.map((figure) => (
                        <li key={figure.id}>
                            <strong>{figure.name}</strong>
                            <div>ID: {figure.id}</div>
                            <div>Editor: {figure.editor_id ?? 'n/a'}</div>
                            <div>Range: {figure.range_id ?? 'n/a'}</div>
                            <div>Scale: {figure.scale ?? 'n/a'}</div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
