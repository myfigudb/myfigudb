// src/services/http.ts
export type ApiError = {
    status: number
    message: string
    details?: unknown
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1' // TODO: make this configurable

async function parseJsonSafe(res: Response) {
    const text = await res.text()
    try {
        return text ? JSON.parse(text) : null
    } catch {
        return text || null
    }
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit & { token?: string } = {}
): Promise<T> {
    const url = `${BASE_URL}${path}`

    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')

    // Si tu envoies du JSON (et pas FormData), on set Content-Type automatiquement
    const isFormData = options.body instanceof FormData
    if (!isFormData && options.body) headers.set('Content-Type', 'application/json')

    if (options.token) headers.set('Authorization', `Bearer ${options.token}`)

    const res = await fetch(url, {
        ...options,
        headers,
    })

    const data = await parseJsonSafe(res)

    if (!res.ok) {
        const message =
            (data && typeof data === 'object' && 'message' in data && (data as any).message) ||
            res.statusText ||
            'Request failed'

        const err: ApiError = { status: res.status, message, details: data }
        throw err
    }

    return data as T
}


