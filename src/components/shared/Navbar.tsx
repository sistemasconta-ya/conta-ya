'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton, useAuth } from '@clerk/nextjs'
import { ArrowDownToLine, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { isSignedIn, isLoaded } = useAuth()

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 shadow-[0_2px_16px_rgba(15,23,42,0.04)] backdrop-blur-md">
            <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 sm:px-8">

                {/* Logo Principal */}
                <Link href="/" className="group flex shrink-0 items-center gap-2.5">
                    <div className="relative h-10 w-10 shrink-0">
                        <Image
                            src="/conta-ya-mark.png"
                            alt=""
                            fill
                            sizes="40px"
                            className="object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
                        CONTA <span className="text-emerald-700">YA!</span>
                        <span className="mt-0.5 hidden text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:block">Contención emocional inmediata</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-6 text-xs font-semibold text-slate-600 lg:flex xl:gap-8">
                    <a href="#" className="border-b-2 border-emerald-600 py-2 text-emerald-700">Inicio</a>
                    <a href="#como-funciona" className="transition-colors hover:text-emerald-800">Cómo funciona</a>
                    <a href="#profesionales" className="transition-colors hover:text-emerald-800">Profesionales</a>
                    <a href="#beneficios" className="transition-colors hover:text-emerald-800">Beneficios</a>
                    <a href="#preguntas" className="transition-colors hover:text-emerald-800">Preguntas frecuentes</a>
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden items-center gap-3 md:flex">
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
                                className="px-2 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
                            >
                                Ingresar
                            </Link>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                            >
                                <ArrowDownToLine className="h-3.5 w-3.5" />
                                Empezar ahora
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
                            href="#"
                            onClick={toggleMobileMenu}
                            className="py-1 transition-colors hover:text-emerald-900"
                        >
                            Inicio
                        </a>
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
                        <a
                            href="#preguntas"
                            onClick={toggleMobileMenu}
                            className="py-1 transition-colors hover:text-emerald-900"
                        >
                            Preguntas frecuentes
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
