import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type LoginRequest } from '../services/auth.service'
import { getApiErrorMessage } from '../services/http'

type User = { id: string; name: string }

type AuthState = {
    token: string | null
    user: User | null
    isLoading: boolean
    error: string | null

    login: (payload: LoginRequest) => Promise<void>
    fetchMe: () => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,
            error: null,

            login: async (payload) => {
                set({ isLoading: true, error: null })
                try {
                    const { access_token } = await authService.login(payload)
                    set({ token: access_token, user: null, isLoading: false })
                } catch (error) {
                    set({ error: getApiErrorMessage(error), isLoading: false })
                    throw error
                }
            },

            fetchMe: async () => {
                const token = get().token
                if (!token) {
                    return
                }

                set({ isLoading: true, error: null })
                try {
                    const user = await authService.me(token)
                    set({ user, isLoading: false })
                } catch {
                    set({ token: null, user: null, isLoading: false })
                }
            },

            logout: () => set({ token: null, user: null, error: null }),
        }),
        { name: 'auth-store' }
    )
)
