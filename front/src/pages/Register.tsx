import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ApiError } from '../services/http'
import { userService } from '../services/user.service'

const registerBackgroundSrc = '/assets/background/RegisterBackground.png'
const logoSrc = '/assets/logos/icon/myfigudb_logo_sm_dark_pink.svg'

const socialButtons = [
    {
        label: 'Register with Google',
        iconSrc: '/assets/social/GoogleIcon.svg',
    },
    {
        label: 'Register with Apple',
        iconSrc: '/assets/social/AppleIcon.svg',
    },
    {
        label: 'Register with GitHub',
        iconSrc: '/assets/social/GitHubIcon.svg',
    },
    {
        label: 'Register with Discord',
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

type PasswordFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    showValue: boolean
    onToggleVisibility: () => void
    autoComplete: string
    placeholder: string
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    showValue,
    onToggleVisibility,
    autoComplete,
    placeholder,
}: PasswordFieldProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium sm:text-base">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showValue ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${fieldClassName} pr-12`}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    aria-label={showValue ? `Hide ${label}` : `Show ${label}`}
                    className="absolute inset-y-0 right-3 flex items-center text-[#9f9f9f] transition-colors hover:text-[#0a0a11] focus:outline-none"
                >
                    <EyeIcon crossed={!showValue} />
                </button>
            </div>
        </div>
    )
}

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const usernameTooShort =
        trimmedUsername.length > 0 && trimmedUsername.length < 3
    const passwordTooShort = password.length > 0 && password.length < 8
    const passwordsMismatch =
        confirmPassword.length > 0 && password !== confirmPassword

    const canSubmit =
        trimmedUsername.length >= 3 &&
        trimmedEmail.length > 0 &&
        password.length >= 8 &&
        confirmPassword.length > 0 &&
        !passwordsMismatch &&
        !isSubmitting

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setSuccess(null)

        if (trimmedUsername.length < 3) {
            setError('Username must be at least 3 characters long.')
            return
        }

        if (!trimmedEmail) {
            setError('Email is required.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)

        try {
            const createdUser = await userService.create({
                slug: trimmedUsername,
                email: trimmedEmail,
                password,
            })

            setSuccess(
                `Account created for ${createdUser.slug}. You can sign in now.`
            )
            setPassword('')
            setConfirmPassword('')
        } catch (e) {
            const err = e as ApiError
            setError(err?.message ?? 'Registration failed')
        } finally {
            setIsSubmitting(false)
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
                                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                    Create an account
                                </h1>
                                <p className="mt-3 text-sm text-[#9f9f9f] sm:text-lg">
                                    Create your own collection and share it to
                                    the community
                                </p>
                            </header>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="w-full max-w-lg"
                            >
                                <div className="space-y-5 sm:space-y-6">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="username"
                                            className="block text-sm font-medium sm:text-base"
                                        >
                                            Username (unique)
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            autoComplete="username"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            placeholder="Choose a unique username"
                                            className={fieldClassName}
                                        />
                                        {usernameTooShort && (
                                            <p className="text-xs text-[#d64667]">
                                                Minimum 3 characters.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium sm:text-base"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className={fieldClassName}
                                        />
                                    </div>

                                    <PasswordField
                                        id="password"
                                        label="Password"
                                        value={password}
                                        onChange={setPassword}
                                        showValue={showPassword}
                                        onToggleVisibility={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        autoComplete="new-password"
                                        placeholder="Create a password (min. 8 characters)"
                                    />

                                    {passwordTooShort && (
                                        <p className="-mt-2 text-xs text-[#d64667]">
                                            Password must be at least 8
                                            characters.
                                        </p>
                                    )}

                                    <PasswordField
                                        id="confirm-password"
                                        label="Confirm Password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        showValue={showConfirmPassword}
                                        onToggleVisibility={() =>
                                            setShowConfirmPassword(
                                                (value) => !value
                                            )
                                        }
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                    />

                                    {passwordsMismatch && (
                                        <p className="-mt-2 text-xs text-[#d64667]">
                                            Passwords do not match.
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="flex h-12 w-full items-center justify-center rounded-xl border border-[#9f9f9f] bg-[#0a0a11] px-4 text-sm font-semibold text-[#fffbfc] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                    >
                                        {isSubmitting ? 'Registering...' : 'Register'}
                                    </button>

                                    {error && (
                                        <p role="alert" className="text-sm text-[#d64667]">
                                            {error}
                                        </p>
                                    )}

                                    {success && (
                                        <p role="status" className="text-sm text-[#2f7d52]">
                                            {success}
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

                            <p className="text-center text-sm sm:text-base">
                                <span className="text-[#9f9f9f]">
                                    Already Have An Account?{' '}
                                </span>
                                <Link
                                    to="/login"
                                    className="font-medium text-[#ed5f7f] transition-opacity hover:opacity-80"
                                >
                                    Sign In
                                </Link>
                                <span className="text-[#9f9f9f]">.</span>
                            </p>
                        </div>
                    </div>
                </section>

                <aside className="relative hidden min-h-screen xl:block">
                    <img
                        src={registerBackgroundSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>
            </div>
        </main>
    )
}
