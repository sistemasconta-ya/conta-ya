'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton, useAuth } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { isSignedIn, isLoaded } = useAuth()

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo Principal */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-28 h-[52px] shrink-0">
                        <Image
                            src="/conta-ya-l.jpg"
                            alt="Conta YA! Logo"
                            fill
                            sizes="112px"
                            className="object-contain p-0.5 transition-transform group-hover:scale-105"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Conta <span className="text-emerald-900">- YA!</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#como-funciona" className="hover:text-emerald-900 transition-colors">Cómo funciona</a>
                    <a href="#beneficios" className="hover:text-emerald-900 transition-colors">Beneficios</a>
                    <a href="#profesionales" className="hover:text-emerald-900 transition-colors">Profesionales</a>
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden md:flex items-center gap-4">
                    {!isLoaded ? (
                        <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                    ) : isSignedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 transition-colors"
                            >
                                Mi Panel
                            </Link>
                            <UserButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 transition-colors"
                            >
                                Ingresar
                            </Link>
                            <Link
                                href="/sign-up"
                                className="text-sm font-semibold bg-emerald-900 hover:bg-emerald-950 text-white px-5 py-2.5 rounded-xl shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02]"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex md:hidden items-center gap-3">
                    {isLoaded && isSignedIn && <UserButton />}

                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Toggle Menu"
                        className="p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-b border-slate-200 bg-white px-6 pt-4 pb-6 space-y-4 shadow-lg">
                    <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-600">
                        <a
                            href="#como-funciona"
                            onClick={toggleMobileMenu}
                            className="hover:text-emerald-900 transition-colors py-1"
                        >
                            Cómo funciona
                        </a>
                        <a
                            href="#beneficios"
                            onClick={toggleMobileMenu}
                            className="hover:text-emerald-900 transition-colors py-1"
                        >
                            Beneficios
                        </a>
                        <a
                            href="#profesionales"
                            onClick={toggleMobileMenu}
                            className="hover:text-emerald-900 transition-colors py-1"
                        >
                            Profesionales
                        </a>
                    </nav>

                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                        {isLoaded && (
                            isSignedIn ? (
                                <Link
                                    href="/dashboard"
                                    onClick={toggleMobileMenu}
                                    className="w-full text-center text-sm font-semibold bg-emerald-900 hover:bg-emerald-950 text-white py-2.5 rounded-xl shadow-md"
                                >
                                    Ir a Mi Panel
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/sign-in"
                                        onClick={toggleMobileMenu}
                                        className="w-full text-center text-sm font-medium text-slate-700 hover:text-slate-900 py-2 border border-slate-200 rounded-xl"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        onClick={toggleMobileMenu}
                                        className="w-full text-center text-sm font-semibold bg-emerald-900 hover:bg-emerald-950 text-white py-2.5 rounded-xl shadow-md shadow-emerald-900/10"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
