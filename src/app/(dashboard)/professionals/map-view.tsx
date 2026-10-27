'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Heart,
    House,
    Loader2,
    MapPin,
    Navigation,
    Search,
    Sparkles,
    UserRound,
    Video,
} from 'lucide-react'
import { createAppointment } from '@/actions/appointments'
import BrandLogo from '@/components/shared/BrandLogo'
import ProfessionalCategoryIcon from '@/components/shared/ProfessionalCategoryIcon'
import {
    getProfessionalCategory,
    PROFESSIONAL_CATEGORIES,
} from '@/components/shared/professional-categories'
import { formatCurrency } from '@/lib/utils'

const MapReal = dynamic(() => import('./map-real'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-xs text-slate-500">
            Cargando mapa...
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
    const [selectionError, setSelectionError] = useState<string | null>(null)
    const bookingRequestInFlight = useRef(false)
    const filteredProfessionals = professionals.filter((pro) => pro.type === selectedType)

    const handleSelectCategory = (type: string) => {
        router.push(`/professionals?type=${type}`)
    }

    const handleSelectProfessional = async (profileId: string) => {
        if (bookingRequestInFlight.current) return

        bookingRequestInFlight.current = true
        setRequestingId(profileId)
        setSelectionError(null)
        try {
            const result = await createAppointment(profileId)
            if (result.success && result.appointmentId) {
                router.push(`/booking/payment?appointmentId=${result.appointmentId}`)
            } else {
                setSelectionError(result.error || 'No se pudo iniciar la reserva. Inténtalo nuevamente.')
            }
        } catch (error) {
            console.error(error)
            setSelectionError('No se pudo iniciar la reserva. Inténtalo nuevamente.')
        } finally {
            bookingRequestInFlight.current = false
            setRequestingId(null)
        }
    }

    const handleQuickSearch = async () => {
        setGeneralLoading(true)
        try {
            const result = await createAppointment(null)
            if (result.success) {
                router.push('/appointments')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setGeneralLoading(false)
        }
    }

    const counts = {
        psychologist: professionals.filter((pro) => pro.type === 'psychologist').length,
        therapist: professionals.filter((pro) => pro.type === 'therapist').length,
        coach: professionals.filter((pro) => pro.type === 'coach').length,
        student: professionals.filter((pro) => pro.type === 'student').length,
    }

    return (
        <main className="professionals-page min-h-screen bg-background pb-[76px] text-slate-900 md:pb-0">
            <header className="professionals-mobile-header sticky top-0 z-20 flex h-[58px] items-center justify-between border-b border-emerald-100 bg-white/95 px-4 backdrop-blur-md md:hidden">
                <Link href="/dashboard" className="flex items-center gap-2" aria-label="Conta YA! - Inicio">
                    <BrandLogo compact />
                </Link>
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="hidden text-xs font-semibold sm:inline">Santiago del Estero</span>
                    <MapPin className="h-4 w-4 text-emerald-700 sm:hidden" aria-hidden="true" />
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                        <Heart className="h-[18px] w-[18px] text-slate-600" aria-hidden="true" />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                    </span>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-5 md:gap-5 md:px-8 md:py-7">
                <div className="hidden items-center justify-between md:flex">
                    <div>
                        <p className="text-sm font-semibold text-emerald-800">Encontrá apoyo cerca tuyo</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">Profesionales en tu zona</h1>
                    </div>
                    <button
                        onClick={handleQuickSearch}
                        disabled={generalLoading}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                    >
                        {generalLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                        Búsqueda instantánea
                    </button>
                </div>

                <div className="grid gap-3 md:grid-cols-12 md:gap-5">
                    <section className="flex min-w-0 flex-col gap-3 md:col-span-7">
                        <div className="flex items-center justify-between px-1 md:hidden">
                            <div>
                                <h1 className="text-sm font-bold">Encontrá apoyo en tu zona</h1>
                                <p className="mt-0.5 text-[11px] text-slate-500">Profesionales disponibles 24/7</p>
                            </div>
                            <button
                                onClick={handleQuickSearch}
                                disabled={generalLoading}
                                aria-label="Búsqueda instantánea"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                            >
                                {generalLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {PROFESSIONAL_CATEGORIES.map((category) => {
                                const categoryProfessionals = professionals.filter(
                                    (pro) => pro.type === category.type && pro.hourlyRate > 0,
                                )
                                const lowestRate = categoryProfessionals.length
                                    ? Math.min(...categoryProfessionals.map((pro) => pro.hourlyRate))
                                    : null
                                const isSelected = selectedType === category.type

                                return (
                                    <button
                                        key={category.type}
                                        onClick={() => handleSelectCategory(category.type)}
                                        aria-pressed={isSelected}
                                        className={`flex min-h-[62px] cursor-pointer items-center gap-2.5 rounded-2xl border bg-white px-2.5 py-2 text-left shadow-sm transition sm:px-3 ${
                                            isSelected
                                                ? `${category.activeClass} ring-1 ring-black/5`
                                                : 'border-slate-100 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${category.iconClass}`}>
                                            <ProfessionalCategoryIcon
                                                type={category.type}
                                                className="h-[19px] w-[19px]"
                                            />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[11px] font-bold leading-tight sm:text-xs">
                                                {category.label}
                                            </span>
                                            <span className={`mt-1 block text-[10px] font-semibold leading-tight ${category.priceClass}`}>
                                                {lowestRate === null
                                                    ? `${counts[category.type as keyof typeof counts]} disponibles`
                                                    : `${formatCurrency(lowestRate)} por sesión`}
                                            </span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="professionals-map-panel relative h-[34vh] min-h-[230px] overflow-hidden rounded-[24px] border border-white bg-emerald-50 shadow-sm md:h-[min(62vh,620px)] md:min-h-[500px] md:rounded-[28px]">
                            <MapReal
                                onSelectProfessional={handleSelectProfessional}
                                professionals={professionals.map((pro) => ({
                                    id: pro.id,
                                    profileId: pro.profileId,
                                    name: pro.fullName,
                                    specialty: pro.specialty,
                                    type: pro.type,
                                    lat: pro.lat,
                                    lng: pro.lng,
                                }))}
                            />
                            <div className="pointer-events-none absolute left-3 top-3 z-[400] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-md backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {professionals.length} profesionales en tu zona
                            </div>
                            <div className="pointer-events-none absolute bottom-3 left-3 z-[400] flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                                <Navigation className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                                Santiago del Estero
                            </div>
                        </div>

                    </section>

                    <section className="min-w-0 md:col-span-5">
                        <div className="rounded-[24px] border border-slate-100 bg-white p-3 shadow-sm sm:p-4 md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto md:rounded-[28px] md:p-5">
                            {selectionError && (
                                <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                                    {selectionError}
                                </p>
                            )}
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-sm font-bold sm:text-base">Profesionales disponibles 24/7</h2>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        {filteredProfessionals.length} en esta categoría
                                    </p>
                                </div>
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <Search className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </div>

                            {filteredProfessionals.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                                    <UserRound className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
                                    <p className="mt-2 text-xs font-semibold text-slate-700">
                                        Todavía no hay profesionales en esta categoría
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Podés solicitar una búsqueda general y te ayudamos a encontrar apoyo.
                                    </p>
                                    <button
                                        onClick={handleQuickSearch}
                                        disabled={generalLoading}
                                        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                                    >
                                        {generalLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                        Solicitar búsqueda general
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredProfessionals.map((professional) => {
                                        const category = getProfessionalCategory(professional.type)

                                        return (
                                            <article
                                                key={professional.id}
                                                className="flex items-center gap-2.5 py-3 first:pt-1 last:pb-1 sm:gap-3"
                                            >
                                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${category?.iconClass ?? 'bg-slate-100 text-slate-600'}`}>
                                                    <ProfessionalCategoryIcon
                                                        type={professional.type}
                                                        className="h-5 w-5"
                                                    />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                                                        {professional.fullName}
                                                    </h3>
                                                    <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-[11px]">
                                                        {professional.specialty} · {professional.isOnline ? 'En línea' : 'Consultá disponibilidad'}
                                                    </p>
                                                    {professional.hourlyRate > 0 && (
                                                        <p className="mt-1 text-xs font-bold text-emerald-800">
                                                            {formatCurrency(professional.hourlyRate)}
                                                            <span className="ml-1 text-[10px] font-normal text-slate-400">por sesión</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex shrink-0 flex-col items-end gap-1">
                                                    <button
                                                        onClick={() => handleSelectProfessional(professional.profileId)}
                                                        disabled={requestingId === professional.profileId}
                                                        className="inline-flex min-w-[88px] cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-700 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50 sm:min-w-[100px] sm:text-[11px]"
                                                    >
                                                        {requestingId === professional.profileId ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Video className="h-3 w-3" aria-hidden="true" />
                                                        )}
                                                        {requestingId === professional.profileId ? 'Preparando' : 'Conectate'}
                                                    </button>
                                                    <ChevronRight className="mr-1 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            )}

                            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50/80 p-3 text-[10px] leading-relaxed text-emerald-900">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                Atención confidencial y acompañamiento cuando lo necesites.
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <nav className="professionals-bottom-nav fixed inset-x-0 bottom-0 z-[500] grid h-[68px] grid-cols-4 border-t border-slate-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md md:hidden">
                <Link href="/dashboard" className="flex flex-col items-center justify-center gap-1 text-slate-500">
                    <House className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="text-[9px] font-medium">Inicio</span>
                </Link>
                <Link href="/appointments" className="flex flex-col items-center justify-center gap-1 text-slate-500">
                    <CalendarDays className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="text-[9px] font-medium">Mis turnos</span>
                </Link>
                <Link href="/professionals" aria-current="page" className="flex flex-col items-center justify-center gap-1 text-emerald-700">
                    <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="text-[9px] font-bold">Buscar</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center justify-center gap-1 text-slate-500">
                    <UserRound className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="text-[9px] font-medium">Mi cuenta</span>
                </Link>
            </nav>
        </main>
    )
}
