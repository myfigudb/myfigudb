import { apiRequest } from './http'

export type RegisterRequest = {
    slug: string
    email: string
    password: string
}

export type RegisterResponse = {
    id: string
    slug: string
    email: string
}

export const userService = {
    create(payload: RegisterRequest) {
        return apiRequest<RegisterResponse>('/users', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
}
