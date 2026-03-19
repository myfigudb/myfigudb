export type ApiUser = {
    id: string
    slug?: string
    email?: string
    name?: string
}

export type ApiEditor = {
    id: string
    name: string
}

export type ApiRange = {
    id: string
    name: string
    editor_id?: string
}

export type ApiLicense = {
    id: string
    name: string
}

export type ApiCharacter = {
    id: string
    name: string
    license_id?: string
}

export type ApiMaterial = {
    id: string
    name: string
}

export type ApiFigureImage = {
    url?: string
    priority?: number
    media?: {
        url?: string
        hash?: string
        extension?: string
        folder?: string
    }
}

export type ApiFigureComment = {
    id: string
    content?: string | null
    text?: string | null
    body?: string | null
    created_at?: string | null
    updated_at?: string | null
    likes?: number | null
    dislikes?: number | null
    user_id?: string | null
    username?: string | null
    author?: ApiUser | null
    user?: ApiUser | null
    replies?: ApiFigureComment[]
}

export type ApiFigure = {
    id: string
    name: string
    range_id: string | null
    editor_id: string | null
    scale?: string | null
    height?: number | null
    unit?: string | null
    release_date?: string | null
    commentary?: string | null
    created_at?: string | null
    updated_at?: string | null
    status?: string | null
    score?: number | null
    ranked?: number | null
    owned?: number | null
    ordered?: number | null
    wished?: number | null
    gtin13?: string | null
    editor?: ApiEditor | null
    ranges?: ApiRange | null
    licenses?: ApiLicense[]
    characters?: ApiCharacter[]
    materials?: ApiMaterial[]
    images?: ApiFigureImage[]
    images_urls?: string[]
    comments?: ApiFigureComment[]
    listings?: ApiListing[]
}

export type ApiReseller = {
    id: string
    name: string
    domain?: string
    url?: string
}

export type ApiListing = {
    id: string
    reseller_id?: string
    figure_id?: string
    price?: number
    currency?: string | null
    ref?: string | null
    status?: string | null
    available_at?: string | null
    url?: string
    description?: string | null
    images_urls?: string[]
    reseller?: ApiReseller | null
}
