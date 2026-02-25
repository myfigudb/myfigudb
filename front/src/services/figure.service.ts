import { apiRequest } from './http'
import type { Figure } from '../types/figure'

export const figureService = {
    list() {
        return apiRequest<Figure[]>('/figures')
    },

    getById(id: string) {
        return apiRequest<Figure>(`/figures/${id}`)
    },

    searchByName(name: string) {
        return apiRequest<Figure[]>(`/figures/search/${encodeURIComponent(name)}`)
    },
}
