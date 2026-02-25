import { apiRequest } from './http'

export type LoginRequest =
    | { email: string; password: string }
    | { slug: string; password: string }
export type LoginResponse = { access_token: string }

type JwtPayload = {
    user_id: string
    role?: string
    exp?: number
    iat?: number
}

type UserResponse = {
    id: string
    slug: string
    email: string
}

function decodeJwtPayload(token: string): JwtPayload {
    const parts = token.split('.')
    if (parts.length < 2) {
        throw new Error('Invalid token format')
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)

    return JSON.parse(json) as JwtPayload
}

export const authService = {
    login(payload: LoginRequest) {
        return apiRequest<LoginResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },

    me(token: string) {
        const payload = decodeJwtPayload(token)
        return apiRequest<UserResponse>(`/users/${payload.user_id}`, {
            method: 'GET',
        }).then((user) => ({ id: user.id, name: user.slug }))
    },
}
