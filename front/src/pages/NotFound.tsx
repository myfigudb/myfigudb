import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/common/Button'

export default function NotFound() {
    return (
        <AppLayout>
            <section className="mx-auto flex min-h-[55vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#ed5f7f]">
                    404
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-[#222] sm:text-4xl">
                    Y'a rien ici chef
                </h1>
                <p className="mt-3 text-sm text-[#6f6b6d] sm:text-base">
                    Bro j'ai pas eu le temps d'implémenter ça encore désolé
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link to="/">
                        <Button variant="dark">Back to home</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="secondary">Go to login</Button>
                    </Link>
                </div>
            </section>
        </AppLayout>
    )
}
