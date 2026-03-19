import { FigurineNav } from '../navigation/FigurineNav'

type FigurineHeaderProps = {
    title: string
}

export function FigurineHeader({ title }: FigurineHeaderProps) {
    return (
        <header className="border-b border-[#e9e7e8] bg-[#f3f0f1]">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col px-4 pt-5 sm:px-8 sm:pt-6 lg:px-12 2xl:px-32">
                <h1 className="max-w-6xl text-xl font-medium leading-snug py-2 text-[#222] sm:text-2xl lg:text-3xl">
                    {title}
                </h1>
                <FigurineNav active="overview" className="pt-4 sm:pt-5" />
            </div>
        </header>
    )
}
