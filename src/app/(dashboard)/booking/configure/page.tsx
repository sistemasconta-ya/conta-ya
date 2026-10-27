'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Check,
    ChevronDown,
    Clock,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react'

function ConfigureContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialType = searchParams.get('type') || 'psychologist'

    const [selectedType, setSelectedType] = useState(initialType)

    const CATEGORIES: Record<string, { title: string; subtitle: string }> = {
        psychologist: { title: 'Psicólogo/a', subtitle: 'Atención profesional matriculada' },
        therapist: { title: 'Acompañante Terapéutico', subtitle: 'Apoyo y contención especializada' },
        coach: { title: 'Coach Ontológico', subtitle: 'Acompañamiento personal y metas' },
        student: { title: 'Estudiante Avanzado', subtitle: 'Atención supervisada' },
    }

    const currentInfo = CATEGORIES[selectedType] || CATEGORIES.psychologist

    const handleContinue = () => {
        router.push(`/professionals?type=${selectedType}`)
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 p-0 sm:p-6 md:p-8 font-sans flex justify-center items-stretch sm:items-center">
            {/* Contenedor Full Width/Height en Mobile y Card de 2 columnas en Desktop */}
            <div className="w-full min-h-full sm:min-h-0 sm:max-w-4xl bg-white border-0 sm:border border-slate-200/80 rounded-none sm:rounded-[40px] p-4 sm:p-8 md:p-10 shadow-none sm:shadow-xl space-y-6 md:space-y-8 flex flex-col justify-between">

                {/* Cabecera Principal */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 md:pb-6 shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="/professionals"
                            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                Configurá tu atención
                            </h1>
                            <p className="hidden md:block text-slate-500 text-xs mt-0.5">
                                Elegí el tipo de atención y encontrá profesionales disponibles.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-900" /> Atenciones 100% Confidenciales
                    </div>
                </div>

                {/* Grid Adaptable: 1 columna en mobile / 2 columnas en desktop */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start flex-1">

                    {/* Columna Izquierda: Opciones de Selección */}
                    <div className="md:col-span-7 space-y-5 sm:space-y-6">

                        {/* 1. Selector de Tipo de Profesional */}
                        <div className="space-y-2">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider block">
                                Tipo de profesional
                            </label>

                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 pr-10 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-900 focus:bg-white focus:ring-1 focus:ring-emerald-900 shadow-sm transition-all cursor-pointer"
                                >
                                    <option value="psychologist">Psicólogo/a - Atención profesional</option>
                                    <option value="therapist">Acompañante Terapéutico - Apoyo y contención</option>
                                    <option value="coach">Coach Ontológico - Acompañamiento personal</option>
                                    <option value="student">Estudiante Avanzado - Atención supervisada</option>
                                </select>
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <p className="text-xs text-slate-500 pl-1">{currentInfo.subtitle}</p>
                        </div>

                        {/* 2. Duración de la sesión */}
                        <div className="space-y-2">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider block">
                                Duración de la sesión
                            </label>

                            <div className="flex items-center justify-between p-3.5 sm:p-5 rounded-2xl border-2 border-emerald-900/80 bg-emerald-50/30 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center text-white shrink-0">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-base font-bold text-slate-900 block">
                                            Sesión de 30 minutos
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-slate-500">                                        La tarifa se muestra en el perfil seleccionado</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Columna Derecha: Resumen y acción */}
                    <div className="md:col-span-5 space-y-4 sm:space-y-5 bg-slate-50/70 border border-slate-200/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mt-auto md:mt-0">

                        <h2 className="text-[11px] sm:text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                            Preferencias de atención
                        </h2>

                        <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-600 border-b border-slate-200 pb-3 sm:pb-4">
                            <div className="flex justify-between">
                                <span>Especialidad:</span>
                                <strong className="text-slate-900 font-bold">{currentInfo.title}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Duración:</span>
                                <strong className="text-slate-900 font-bold">30 min</strong>
                            </div>
                        </div>

                        {/* Nota de tiempo extra */}
                        <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-emerald-100 flex items-start gap-3 shadow-xs">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shrink-0 mt-0.5">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <p className="text-[11px] sm:text-xs font-medium text-slate-700 leading-tight">
                                Podrás solicitar más tiempo durante la sesión si lo necesitás.
                            </p>
                        </div>

                        {/* Búsqueda de profesional */}
                        <div className="pt-1 sm:pt-2 space-y-3 sm:space-y-4">
                            <button
                                onClick={handleContinue}
                                className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3.5 sm:py-4 rounded-2xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 text-xs sm:text-base cursor-pointer hover:scale-[1.01]"
                            >
                                Ver profesionales disponibles
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </main>
    )
}

export default function ConfigureBookingPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="w-10 h-10 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ConfigureContent />
        </Suspense>
    )
}