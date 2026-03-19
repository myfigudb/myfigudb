import { apiGet } from './client'
import type {
    ApiCharacter,
    ApiEditor,
    ApiFigure,
    ApiLicense,
    ApiMaterial,
} from './types'

export const figurineApi = {
    getFigureById(id: string) {
        return apiGet<ApiFigure>(`/figures/${id}`)
    },

    listFigures() {
        return apiGet<ApiFigure[]>('/figures')
    },

    async searchFigures(name: string) {
        try {
            return await apiGet<ApiFigure[]>(`/figures/search/${encodeURIComponent(name)}`)
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'status' in error &&
                (error as { status?: number }).status === 404
            ) {
                return []
            }

            throw error
        }
    },

    listLicenses() {
        return apiGet<ApiLicense[]>('/licenses')
    },

    listCharacters() {
        return apiGet<ApiCharacter[]>('/characters')
    },

    listEditors() {
        return apiGet<ApiEditor[]>('/editors')
    },

    listMaterials() {
        return apiGet<ApiMaterial[]>('/material')
    },
}
