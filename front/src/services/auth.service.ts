import { apiRequest } from './http'

export type LoginRequest = { email: string; password: string }
export type LoginResponse = { token: string; user: { id: string; name: string } }

export const authService = {
    login(payload: LoginRequest) {
        return apiRequest<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },

    me(token: string) {
        return apiRequest<{ id: string; name: string }>('/auth/me', {
            method: 'GET',
            token,
        })
    },
}
