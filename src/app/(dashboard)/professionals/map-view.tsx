'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Info,
    User,
    Heart,
    Star,
    GraduationCap,
    Sparkles,
    ChevronDown,
    MapPin,
    Calendar,
    Loader2,
    CheckCircle2,
} from 'lucide-react'
import { createAppointment } from '@/actions/appointments'
import { formatCurrency } from '@/lib/utils'

const MapReal = dynamic(() => import('./map-real'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
            Cargando mapa en tiempo real...
        </div>
    ),
})

export interface ProfessionalItem {
    id: string
    profileId: string
    fullName: string
    specialty: string
    licenseNumber: string
    collegeName: string
    hourlyRate: number
    isOnline: boolean
    type: string
    lat: number
    lng: number
    bio: string | null
}

export default function ProfessionalsMapView({
    professionals,
}: {
    professionals: ProfessionalItem[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedType = searchParams.get('type') || 'psychologist'
    const [requestingId, setRequestingId] = useState<string | null>(null)
    const [generalLoading, setGeneralLoading] = useState(false)

    const filteredProfessionals = professionals.filter(
        (p) => p.type === selectedType
    )

    const handleSelectCategory = (type: string) => {
        router.push(`/professionals?type=${type}`)
    }

    const handleBookDirect = async (proProfileId: string) => {
        setRequestingId(proProfileId)
        try {
            const res = await createAppointment(proProfileId)
            if (res.success && res.appointmentId) {
                router.push('/appointments')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setRequestingId(null)
        }
    }

    const handleQuickSearch = async () => {
        setGeneralLoading(true)
        try {
            const res = await createAppointment(null)
            if (res.success) {
                router.push('/appointments')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setGeneralLoading(false)
        }
    }

    // Contadores reales por tipo
    const counts = {
        psychologist: professionals.filter((p) => p.type === 'psychologist').length,
        therapist: professionals.filter((p) => p.type === 'therapist').length,
        coach: professionals.filter((p) => p.type === 'coach').length,
        student: professionals.filter((p) => p.type === 'student').length,
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 p-0 sm:p-6 font-sans flex justify-center items-stretch sm:items-center">
            {/* Contenedor Principal */}
            <div className="w-full min-h-full sm:min-h-0 sm:max-w-6xl bg-white border-0 sm:border border-slate-200/80 rounded-none sm:rounded-[40px] p-4 sm:p-8 shadow-none sm:shadow-xl space-y-4 md:space-y-6 flex flex-col justify-between">

                {/* Encabezado */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>

                        <div>
                            <div className="flex items-center gap-1.5 font-black text-slate-900 text-base md:text-xl">
                                <MapPin className="w-4 h-4 text-emerald-900" />
                                <span>Santiago del Estero</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-[11px] md:text-xs font-medium text-slate-500">
                                Disponibilidad en tiempo real desde la base de datos
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleQuickSearch}
                        disabled={generalLoading}
                        className="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        {generalLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5" /> Búsqueda Instantánea
                            </>
                        )}
                    </button>
                </div>

                {/* Grid Responsivo */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-stretch flex-1">

                    {/* Columna Mapa */}
                    <div className="md:col-span-7 flex flex-col flex-1 min-h-[300px] sm:min-h-[380px] md:min-h-[480px]">
                        <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden relative border border-slate-200 shadow-inner bg-slate-100 flex-1">
                            <MapReal
                                professionals={filteredProfessionals.map((p) => ({
                                    id: p.id,
                                    name: p.fullName,
                                    specialty: p.specialty,
                                    type: p.type,
                                    lat: p.lat,
                                    lng: p.lng,
                                }))}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha: Categorías y Lista de Profesionales */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-4 shrink-0 overflow-y-auto max-h-[500px] pr-1">

                        <div className="space-y-3">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider block">
                                Seleccioná el tipo de atención
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleSelectCategory('psychologist')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                        selectedType === 'psychologist'
                                            ? 'border-emerald-900 bg-emerald-50/40 ring-2 ring-emerald-900/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-900 shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">
                                            Psicólogos
                                        </span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-900">{counts.psychologist}</span>
                                </button>

                                <button
                                    onClick={() => handleSelectCategory('therapist')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                        selectedType === 'therapist'
                                            ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">
                                            Acompañantes
                                        </span>
                                    </div>
                                    <span className="text-sm font-black text-purple-700">{counts.therapist}</span>
                                </button>

                                <button
                                    onClick={() => handleSelectCategory('coach')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                        selectedType === 'coach'
                                            ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                            <Star className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">
                                            Coaches
                                        </span>
                                    </div>
                                    <span className="text-sm font-black text-amber-600">{counts.coach}</span>
                                </button>

                                <button
                                    onClick={() => handleSelectCategory('student')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                        selectedType === 'student'
                                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">
                                            Estudiantes
                                        </span>
                                    </div>
                                    <span className="text-sm font-black text-blue-600">{counts.student}</span>
                                </button>
                            </div>
                        </div>

                        {/* Listado Dinámico de Especialistas Disponibles */}
                        <div className="space-y-2.5">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider block">
                                Especialistas en tu zona ({filteredProfessionals.length})
                            </label>

                            {filteredProfessionals.length === 0 ? (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                                    <p className="text-xs text-slate-500 mb-2">No hay especialistas registrados en esta categoría aún.</p>
                                    <button
                                        onClick={handleQuickSearch}
                                        className="text-xs font-bold text-emerald-900 hover:underline"
                                    >
                                        Solicitar búsqueda general
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredProfessionals.map((pro) => (
                                        <div
                                            key={pro.id}
                                            className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{pro.fullName}</h4>
                                                <p className="text-[11px] text-slate-500">{pro.specialty} • MP {pro.licenseNumber}</p>
                                                {pro.hourlyRate > 0 && (
                                                    <p className="text-xs font-bold text-emerald-900 mt-0.5">
                                                        {formatCurrency(pro.hourlyRate)} (30m)
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleBookDirect(pro.profileId)}
                                                disabled={requestingId === pro.profileId}
                                                className="inline-flex items-center gap-1 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                                            >
                                                {requestingId === pro.profileId ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin" /> Solicitando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-3 h-3" /> Solicitar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Banner Informativo */}
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-emerald-900 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium text-emerald-950 leading-snug">
                                Tu consulta creará una cita directa en el panel del profesional y abrirá la sala de videollamada.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </main>
    )
}