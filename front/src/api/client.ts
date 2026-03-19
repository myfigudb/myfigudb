import { apiRequest } from '../services/http'

export function apiGet<T>(path: string) {
    return apiRequest<T>(path, { method: 'GET' })
}
