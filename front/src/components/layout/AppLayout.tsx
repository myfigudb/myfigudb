import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

type AppLayoutProps = {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-[#fffbfc] text-[#222]">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}
