const AUTH_STORE_KEY = 'auth-store'

type PersistedAuthState = {
    token?: string | null
}

type PersistedAuthStore = {
    state?: PersistedAuthState
}

export function getStoredAuthToken(): string | null {
    if (typeof window === 'undefined') {
        return null
    }

    const rawStore = window.localStorage.getItem(AUTH_STORE_KEY)
    if (!rawStore) {
        return null
    }

    try {
        const parsed = JSON.parse(rawStore) as PersistedAuthStore
        const token = parsed?.state?.token

        return typeof token === 'string' && token.length > 0 ? token : null
    } catch {
        return null
    }
}
