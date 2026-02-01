import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type LoginRequest } from '../services/auth.service'
import type { ApiError } from '../services/http'

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
          const { token, user } = await authService.login(payload)
          set({ token, user, isLoading: false })
        } catch (e) {
          const err = e as ApiError
          set({ error: err.message, isLoading: false })
          throw e
        }
      },

      fetchMe: async () => {
        const token = get().token
        if (!token) return
        set({ isLoading: true, error: null })
        try {
          const user = await authService.me(token)
          set({ user, isLoading: false })
        } catch (e) {
          // token invalide => on déconnecte
          set({ token: null, user: null, isLoading: false })
        }
      },

      logout: () => set({ token: null, user: null, error: null }),
    }),
    { name: 'auth-store' }
  )
)
