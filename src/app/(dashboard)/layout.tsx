'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, Search, User, Menu, X, Calendar } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

export default function AuthenticatedAppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            {/* Navbar Superior Unificado para la App */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="relative w-28 h-[48px] shrink-0">
                                <Image
                                    src="/conta-ya-l.jpg"
                                    alt="Conta YA! Logo"
                                    fill
                                    sizes="112px"
                                    className="object-contain p-0.5 transition-transform group-hover:scale-105"
                                    priority
                                />
                            </div>
                            <span className="hidden sm:inline-block text-xl font-bold tracking-tight text-slate-900">
                                Conta<span className="text-emerald-900">YA!</span>
                            </span>
                        </Link>

                        {/* Enlaces de Navegación Desktop */}
                        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-emerald-900" /> Panel
                            </Link>
                            <Link
                                href="/professionals"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                                <Search className="w-4 h-4 text-emerald-900" /> Buscar Especialistas
                            </Link>
                            <Link
                                href="/appointments"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                                <Calendar className="w-4 h-4 text-emerald-900" /> Mis Consultas
                            </Link>
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                                <User className="w-4 h-4 text-emerald-900" /> Mi Perfil
                            </Link>
                        </nav>
                    </div>

                    {/* Menú de Usuario y Hamburguesa Móvil */}
                    <div className="flex items-center gap-3">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'w-9 h-9 border border-emerald-900/30 shadow-sm',
                                },
                            }}
                        />

                        <button
                            onClick={toggleMobileMenu}
                            aria-label="Abrir Menú"
                            className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menú Desplegable Móvil */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-2 shadow-lg">
                        <Link
                            href="/dashboard"
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-emerald-900" /> Panel
                        </Link>
                        <Link
                            href="/professionals"
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <Search className="w-4 h-4 text-emerald-900" /> Buscar Especialistas
                        </Link>
                        <Link
                            href="/appointments"
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-emerald-900" /> Mis Consultas
                        </Link>
                        <Link
                            href="/profile"
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <User className="w-4 h-4 text-emerald-900" /> Mi Perfil
                        </Link>
                    </div>
                )}
            </header>

            {/* Contenido Dinámico de las Páginas */}
            <div className="flex-1 bg-slate-50">
                {children}
            </div>
        </div>
    )
}