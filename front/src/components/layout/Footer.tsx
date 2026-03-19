import { Link } from 'react-router-dom'

const footerLinks = {
    navigate: [
        { label: 'Home', to: '/' },
        { label: 'Figures', to: '/figures' },
        { label: 'Collection', to: '/collection' },
        { label: 'Wishlist', to: '/wishlist' },
    ],
    about: [
        { label: 'About us', to: '/about' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Support', to: '/support' },
    ],
} as const

export function Footer() {
    return (
        <footer className="bg-[#222] text-[#dbd6d7]">
            <div className="mx-auto w-full max-w-screen-2xl px-4 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20 xl:pb-10 2xl:px-32">
                <div className="grid gap-12 border-b border-[#3a3839] pb-10 md:grid-cols-2 lg:gap-16 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)] xl:gap-24 xl:pb-12">
                    <div className="md:col-span-2 xl:col-span-1">
                        <img
                            src="/assets/logos/full_name/myfigudb_logo_lg_light_pink.svg"
                            alt="My Figurine DB"
                            className="h-auto w-44 sm:w-52"
                        />
                        <p className="mt-5 max-w-xl text-sm font-light leading-relaxed text-[#cfc9cb] sm:text-base lg:text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                            pharetra enim in tempus volutpat.
                        </p>
                        <div className="mt-8 flex items-center gap-6 sm:gap-8">
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X"
                                className="inline-flex size-10 items-center justify-center rounded-full border border-[#3d3a3b] transition hover:border-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                            >
                                <img
                                    src="/assets/icons/social/monochrom/XIconUnicolor.svg"
                                    alt=""
                                    className="size-5"
                                />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="inline-flex size-10 items-center justify-center rounded-full border border-[#3d3a3b] transition hover:border-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                            >
                                <img
                                    src="/assets/icons/social/monochrom/InstagramIconUnicolor.svg"
                                    alt=""
                                    className="size-5"
                                />
                            </a>
                            <a
                                href="https://github.com/myfigudb"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="inline-flex size-10 items-center justify-center rounded-full border border-[#3d3a3b] transition hover:border-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                            >
                                <img
                                    src="/assets/icons/social/monochrom/GitHubIconUnicolor.svg"
                                    alt=""
                                    className="size-5"
                                />
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Discord"
                                className="inline-flex size-10 items-center justify-center rounded-full border border-[#3d3a3b] transition hover:border-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                            >
                                <img
                                    src="/assets/icons/social/monochrom/DiscordIconUnicolor.svg"
                                    alt=""
                                    className="size-5"
                                />
                            </a>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-base font-semibold text-[#fffbfc] sm:text-lg">
                            Navigate
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm font-light sm:text-base">
                            {footerLinks.navigate.map((link) => (
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
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-[#fffbfc] sm:text-lg">
                            About Us
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm font-light sm:text-base">
                            {footerLinks.about.map((link) => (
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
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-[#fffbfc] sm:text-lg">
                            Contact Us
                        </h2>
                        <a
                            href="mailto:contact@myfigudb.net"
                            className="mt-5 block text-sm font-light text-[#dbd6d7] transition-colors hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 sm:text-base"
                        >
                            contact@myfigudb.net
                        </a>
                    </section>
                </div>

                <div className="flex flex-col gap-4 pt-6 text-xs font-light sm:text-sm lg:flex-row lg:items-center lg:justify-between lg:text-sm xl:pt-8">
                    <p>© 2025 MyFigurineDB. All Rights Reserved</p>
                    <p className="flex flex-wrap items-center gap-1.5">
                        <Link
                            to="/privacy"
                            className="hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            Privacy Policy
                        </Link>
                        <span>/</span>
                        <Link
                            to="/cookies"
                            className="hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            Cookies Policy
                        </Link>
                        <span>/</span>
                        <Link
                            to="/sitemap"
                            className="hover:text-[#ed5f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        >
                            Sitemap
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}
