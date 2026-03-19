import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Avatar } from '../common/Avatar'
import { logModalAction } from '../../utils/modal'

const navLinks = [
    { label: 'Figures', to: '/figures' },
    { label: 'Collection', to: '/collection' },
    { label: 'Wishlist', to: '/wishlist' },
] as const

export function Navbar() {
    const navigate = useNavigate()
    const token = useAuthStore((state) => state.token)
    const user = useAuthStore((state) => state.user)
    const fetchMe = useAuthStore((state) => state.fetchMe)
    const logout = useAuthStore((state) => state.logout)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (token && !user) {
            void fetchMe()
        }
    }, [fetchMe, token, user])

    useEffect(() => {
        if (!isProfileMenuOpen) {
            return
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                event.target instanceof Node &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setIsProfileMenuOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsProfileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isProfileMenuOpen])

    function handleLogout() {
        setIsProfileMenuOpen(false)
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="border-b border-[#ece9ea] bg-[#fffbfc]">
            <nav
                className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3 px-3 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-10 2xl:px-12"
                aria-label="Main navigation"
            >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:gap-14">
                    <Link to="/" className="shrink-0" aria-label="Go to home">
                        <img
                            src="/assets/logos/full_name/myfigudb_logo_lg_dark_pink.svg"
                            alt="My Figurine DB"
                            className="h-auto w-36 sm:w-44 lg:w-52"
                        />
                    </Link>

                    <ul className="hidden items-center gap-7 py-2 text-sm font-light text-[#222] lg:flex xl:text-base">
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="transition-colors hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        onClick={() => logModalAction('navigation-menu')}
                        className="inline-flex size-7 items-center justify-center rounded-full text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 lg:hidden"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="size-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M4 7h16" />
                            <path d="M4 12h16" />
                            <path d="M4 17h16" />
                        </svg>
                    </button>

                    <label
                        htmlFor="navbar-search"
                        className="hidden h-11 w-72 items-center gap-2 rounded-full border-2 border-[#fbf2f4] bg-[#fffbfc] px-3 text-sm font-light text-[#9f9f9f] xl:flex"
                    >
                        <img src="/assets/icons/misc/search.svg" alt="" className="size-5" />
                        <input
                            id="navbar-search"
                            type="search"
                            placeholder="Search for something..."
                            className="w-full bg-transparent text-sm text-[#222] outline-none placeholder:text-[#9f9f9f]"
                            onFocus={() => logModalAction('search')}
                            readOnly
                        />
                    </label>

                    <button
                        type="button"
                        aria-label="Open rewards"
                        onClick={() => logModalAction('rewards')}
                        className="relative hidden size-7 items-center justify-center rounded-full text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 sm:inline-flex lg:size-8"
                    >
                        <img
                            src="/assets/icons/navbar/daily_chest_off.svg"
                            alt=""
                            className="size-7 lg:size-8"
                        />
                    </button>

                    <button
                        type="button"
                        aria-label="Open messages"
                        onClick={() => logModalAction('messaging')}
                        className="inline-flex size-7 items-center justify-center rounded-full text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 lg:size-8"
                    >
                        <img
                            src="/assets/icons/navbar/messages.svg"
                            alt=""
                            className="size-7 lg:size-8"
                        />
                    </button>

                    <button
                        type="button"
                        aria-label="Open notifications"
                        onClick={() => logModalAction('notifications')}
                        className="relative inline-flex size-7 items-center justify-center rounded-full text-[#222] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 lg:size-8"
                    >
                        <img
                            src="/assets/icons/navbar/notification_off.svg"
                            alt=""
                            className="size-7 lg:size-8"
                        />
                    </button>

                    <div ref={profileMenuRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsProfileMenuOpen((previous) => !previous)}
                            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                            aria-label="Open profile menu"
                            aria-haspopup="menu"
                            aria-expanded={isProfileMenuOpen}
                        >
                            <Avatar
                                src="/assets/misc/profile_pick_example.jpg"
                                name={user?.name ?? 'Profile'}
                                size="md"
                                className="size-9 border-0 sm:size-10 lg:size-12"
                            />
                        </button>

                        {isProfileMenuOpen ? (
                            <div
                                role="menu"
                                aria-label="Profile actions"
                                className="absolute right-0 top-full z-30 mt-3 min-w-44 rounded-xl border border-[#ddd9db] bg-[#fffbfc] p-2 shadow-[0_0.75rem_2rem_rgba(10,10,17,0.18)]"
                            >
                                <div className="border-b border-[#ece9ea] px-3 py-2">
                                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8c8889]">
                                        Connected as
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-[#0a0a11]">
                                        {user?.name ?? 'Profile'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-[#141416] px-3 py-2 text-sm font-medium text-[#fffbfc] transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141416]/30"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </nav>
        </header>
    )
}
