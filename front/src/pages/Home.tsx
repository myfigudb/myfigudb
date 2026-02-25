import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#fffbfc] text-[#0a0a11]">
            <img
                src="/assets/background/LightBackground.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#fffbfc]/70"
            />

            <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
                <img
                    src="/assets/logos/full_name/myfigudb_logo_lg_dark.svg"
                    alt="myfigudb"
                    className="h-auto w-full max-w-xs sm:max-w-md"
                />

                <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                    <Link
                        to="/login"
                        className="flex-1 rounded-xl border border-[#0a0a11] bg-[#0a0a11] px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="flex-1 rounded-xl border border-[#c8c8c8] bg-white px-5 py-3 text-center text-sm font-semibold text-[#0a0a11] transition-colors hover:bg-[#f6f2f3]"
                    >
                        Register
                    </Link>
                </div>
            </section>
        </main>
    )
}
