import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const loginBackgroundSrc = '/assets/background/LoginBackground.png'
const logoSrc = '/assets/logos/icon/myfigudb_logo_sm_dark_pink.svg'

const socialButtons = [
    {
        label: 'Login with Google',
        iconSrc: '/assets/social/GoogleIcon.svg',
    },
    {
        label: 'Login with Apple',
        iconSrc: '/assets/social/AppleIcon.svg',
    },
    {
        label: 'Login with GitHub',
        iconSrc: '/assets/social/GitHubIcon.svg',
    },
    {
        label: 'Login with Discord',
        iconSrc: '/assets/social/DiscordIcon.svg',
    },
] as const

function EyeIcon({ crossed }: { crossed: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="3" />
            {crossed && <path d="M4 4l16 16" />}
        </svg>
    )
}

const fieldClassName =
    'h-12 w-full rounded-xl border border-[#c8c8c8] bg-[#fffbfc] px-4 text-base font-light text-[#0a0a11] outline-none placeholder:text-[#9f9f9f] focus:border-[#ed5f7f] focus:ring-2 focus:ring-[#ed5f7f]/15'

export default function Login() {
    const login = useAuthStore((s) => s.login)
    const fetchMe = useAuthStore((s) => s.fetchMe)
    const logout = useAuthStore((s) => s.logout)
    const token = useAuthStore((s) => s.token)
    const user = useAuthStore((s) => s.user)
    const isLoading = useAuthStore((s) => s.isLoading)
    const error = useAuthStore((s) => s.error)

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (token && !user) {
            void fetchMe()
        }
    }, [fetchMe, token, user])

    const canSubmit = identifier.trim().length > 0 && password.length > 0

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!canSubmit || isLoading) return

        const trimmedIdentifier = identifier.trim()
        const payload = trimmedIdentifier.includes('@')
            ? { email: trimmedIdentifier, password }
            : { slug: trimmedIdentifier, password }

        try {
            await login(payload)
        } catch {
            // Error state is already stored in authStore.
        }
    }

    return (
        <main className="min-h-screen bg-[#fffbfc] text-[#0a0a11]">
            <div className="grid min-h-screen xl:grid-cols-2">
                <section className="relative flex items-center justify-center px-4 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
                    <Link
                        to="/"
                        aria-label="Go to home"
                        className="absolute left-4 top-4 sm:left-8 sm:top-8 lg:left-12 lg:top-10 xl:left-16"
                    >
                        <img
                            src={logoSrc}
                            alt="Myfigudb"
                            className="size-10 sm:size-12"
                        />
                    </Link>

                    <div className="w-full max-w-xl">
                        <div className="flex flex-col items-center gap-8 sm:gap-10">
                            <header className="w-full text-center">
                                <h1 className="text-4xl font-semibold leading-tight text-[#0a0a11] sm:text-5xl">
                                    Welcome Back.
                                </h1>
                                <p className="mt-3 text-sm text-[#9f9f9f] sm:text-lg">
                                    Enter your email and password to access your
                                    account.
                                </p>
                            </header>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="w-full max-w-lg"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="identifier"
                                            className="block text-sm font-medium sm:text-base"
                                        >
                                            Email or Username
                                        </label>
                                        <input
                                            id="identifier"
                                            type="text"
                                            autoComplete="username"
                                            value={identifier}
                                            onChange={(e) =>
                                                setIdentifier(e.target.value)
                                            }
                                            placeholder="Enter your email address or username"
                                            className={fieldClassName}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium sm:text-base"
                                            >
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(e.target.value)
                                                    }
                                                    placeholder="Enter your password"
                                                    className={`${fieldClassName} pr-12`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword((value) => !value)
                                                    }
                                                    aria-label={
                                                        showPassword
                                                            ? 'Hide password'
                                                            : 'Show password'
                                                    }
                                                    className="absolute inset-y-0 right-3 flex items-center text-[#9f9f9f] transition-colors hover:text-[#0a0a11] focus:outline-none"
                                                >
                                                    <EyeIcon crossed={!showPassword} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:text-base">
                                            <label className="flex items-center gap-2 text-[#9f9f9f]">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) =>
                                                        setRememberMe(e.target.checked)
                                                    }
                                                    className="size-4 rounded border border-[#9f9f9f] accent-[#ed5f7f]"
                                                />
                                                <span>Remember me</span>
                                            </label>

                                            <button
                                                type="button"
                                                className="text-left font-medium text-[#ed5f7f] transition-opacity hover:opacity-80 sm:text-right"
                                            >
                                                Forgot Your Password?
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isLoading}
                                        className="flex h-12 w-full items-center justify-center rounded-xl border border-[#9f9f9f] bg-[#0a0a11] px-4 text-sm font-semibold text-[#fffbfc] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                    >
                                        {isLoading ? 'Logging In...' : 'Log In'}
                                    </button>

                                    {error && (
                                        <p role="alert" className="text-sm text-[#d64667]">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </form>

                            <div className="flex w-full max-w-lg items-center gap-4 text-[#9f9f9f]">
                                <div className="h-px flex-1 bg-[#c8c8c8]" />
                                <span className="shrink-0 text-sm sm:text-base">
                                    Or Login With
                                </span>
                                <div className="h-px flex-1 bg-[#c8c8c8]" />
                            </div>

                            <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                                {socialButtons.map(({ label, iconSrc }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        aria-label={label}
                                        className="flex h-14 items-center justify-center rounded-xl border border-[#c8c8c8] bg-[#e8e8e8] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#ed5f7f]/30"
                                    >
                                        <img
                                            src={iconSrc}
                                            alt=""
                                            className="size-5 object-contain sm:size-6"
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="text-center text-sm sm:text-base">
                                {user ? (
                                    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                                        <span className="text-[#9f9f9f]">
                                            Logged in as {user.name}.
                                        </span>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="font-medium text-[#ed5f7f] transition-opacity hover:opacity-80"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <p>
                                        <span className="text-[#9f9f9f]">
                                            Don&apos;t have an Account?{' '}
                                        </span>
                                        <Link
                                            to="/register"
                                            className="font-medium text-[#ed5f7f] transition-opacity hover:opacity-80"
                                        >
                                            Register Now
                                        </Link>
                                        <span className="text-[#9f9f9f]">.</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="relative hidden min-h-screen xl:block">
                    <img
                        src={loginBackgroundSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>
            </div>
        </main>
    )
}
