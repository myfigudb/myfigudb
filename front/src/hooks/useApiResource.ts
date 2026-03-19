import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getApiErrorMessage } from '../services/http'

type QueryState<T> = {
    data: T | null
    isLoading: boolean
    error: string | null
    retry: () => void
}

type QueryOptions = {
    enabled?: boolean
}

const cache = new Map<string, unknown>()
const inFlight = new Map<string, Promise<unknown>>()

export function clearCachedResource(key: string) {
    cache.delete(key)
    inFlight.delete(key)
}

export function useApiResource<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: QueryOptions = {}
): QueryState<T> {
    const enabled = options.enabled ?? true
    const cached = useMemo(() => cache.get(key) as T | undefined, [key])

    const [data, setData] = useState<T | null>(cached ?? null)
    const [isLoading, setIsLoading] = useState<boolean>(enabled && !cached)
    const [error, setError] = useState<string | null>(null)

    const fetcherRef = useRef(fetcher)
    fetcherRef.current = fetcher

    const load = useCallback(
        async (force = false) => {
            if (!enabled) {
                setIsLoading(false)
                return
            }

            if (!force) {
                const existing = cache.get(key) as T | undefined
                if (existing !== undefined) {
                    setData(existing)
                    setError(null)
                    setIsLoading(false)
                    return
                }
            }

            setIsLoading(true)
            setError(null)

            const existingRequest = inFlight.get(key) as Promise<T> | undefined
            if (existingRequest) {
                try {
                    const result = await existingRequest
                    setData(result)
                    setError(null)
                } catch (e) {
                    setError(getApiErrorMessage(e))
                } finally {
                    setIsLoading(false)
                }
                return
            }

            const request = fetcherRef.current()
            inFlight.set(key, request)

            try {
                const result = await request
                cache.set(key, result)
                setData(result)
                setError(null)
            } catch (e) {
                setError(getApiErrorMessage(e))
            } finally {
                inFlight.delete(key)
                setIsLoading(false)
            }
        },
        [enabled, key]
    )

    useEffect(() => {
        setData(cached ?? null)
        setIsLoading(enabled && !cached)
        setError(null)

        void load(false)
    }, [cached, enabled, key, load])

    const retry = useCallback(() => {
        clearCachedResource(key)
        void load(true)
    }, [key, load])

    return { data, isLoading, error, retry }
}
