import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

type RequireAuthProps = {
    children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
    const location = useLocation()
    const token = useAuthStore((state) => state.token)
    const user = useAuthStore((state) => state.user)
    const isLoading = useAuthStore((state) => state.isLoading)
    const fetchMe = useAuthStore((state) => state.fetchMe)

    useEffect(() => {
        if (token && !user && !isLoading) {
            void fetchMe()
        }
    }, [fetchMe, isLoading, token, user])

    if (!token) {
        const from = `${location.pathname}${location.search}${location.hash}`
        return <Navigate to="/login" replace state={{ from }} />
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fffbfc] px-4">
                <p className="text-sm text-[#6e6a6b] sm:text-base">Checking account session...</p>
            </div>
        )
    }

    return <>{children}</>
}
