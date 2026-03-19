import { getStoredAuthToken } from './authToken'

export type ApiError = {
    status: number
    message: string
    details?: unknown
}

type ApiRequestOptions = RequestInit & {
    token?: string
    auth?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

async function parseJsonSafe(res: Response) {
    const text = await res.text()
    try {
        return text ? JSON.parse(text) : null
    } catch {
        return text || null
    }
}

function extractErrorMessage(data: unknown) {
    if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = (data as { message?: unknown }).message
        if (typeof message === 'string' && message.trim().length > 0) {
            return message
        }
    }

    return null
}

export function getApiErrorMessage(error: unknown, fallback = 'Request failed') {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === 'string' && message.trim().length > 0) {
            return message
        }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message
    }

    return fallback
}

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const url = `${API_BASE_URL}${path}`

    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')

    const isFormData = options.body instanceof FormData
    if (!isFormData && options.body) {
        headers.set('Content-Type', 'application/json')
    }

    const shouldAttachToken = options.auth !== false
    if (shouldAttachToken) {
        const token = options.token ?? getStoredAuthToken()
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }

    const res = await fetch(url, {
        ...options,
        headers,
    })

    const data = await parseJsonSafe(res)

    if (!res.ok) {
        const message = extractErrorMessage(data) ?? res.statusText ?? 'Request failed'

        const err: ApiError = { status: res.status, message, details: data }
        throw err
    }

    return data as T
}
