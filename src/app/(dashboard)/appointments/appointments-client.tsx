'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { acceptAppointment, cancelAppointment } from '@/actions/appointments'
import { formatDate, formatCurrency } from '@/lib/utils'
import {
    Calendar,
    Clock,
    User,
    Video,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Search,
    Shield,
    CreditCard,
} from 'lucide-react'

interface AppointmentItem {
    id: string
    status: 'PENDING_PAYMENT' | 'SEARCHING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
    scheduledAt: Date | string | null
    startedAt: Date | string | null
    endedAt: Date | string | null
    durationMinutes: number
    roomUrl: string | null
    createdAt: Date | string
    patient: {
        id: string
        fullName: string
        email: string
        phone: string | null
    }
    professional?: {
        id: string
        fullName: string
        email: string
        professionalProfile?: {
            specialty: string
            hourlyRate: any
            licenseNumber: string
        } | null
    } | null
}

interface AppointmentsClientProps {
    appointments: AppointmentItem[]
    isProfessional: boolean
}

export default function AppointmentsClient({
    appointments,
    isProfessional,
}: AppointmentsClientProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')

    const handleAccept = async (id: string) => {
        setLoadingId(id)
        try {
            await acceptAppointment(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingId(null)
        }
    }

    const handleCancel = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta consulta?')) return
        setLoadingId(id)
        try {
            await cancelAppointment(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingId(null)
        }
    }

    const filteredAppointments = appointments.filter((app) => {
        if (filter === 'active') return app.status === 'ACCEPTED' || app.status === 'IN_PROGRESS'
        if (filter === 'pending') return app.status === 'SEARCHING' || app.status === 'PENDING_PAYMENT'
        if (filter === 'completed') return app.status === 'COMPLETED' || app.status === 'CANCELLED'
        return true
    })

    const getStatusBadge = (status: AppointmentItem['status']) => {
        switch (status) {
            case 'PENDING_PAYMENT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        <AlertCircle className="w-3.5 h-3.5 text-sky-600" /> Pago pendiente
                    </span>
                )
            case 'SEARCHING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Buscando / Pendiente
                    </span>
                )
            case 'ACCEPTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aceptada
                    </span>
                )
            case 'IN_PROGRESS':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 animate-pulse">
                        <Video className="w-3.5 h-3.5 text-blue-600" /> En Curso
                    </span>
                )
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Finalizada
                    </span>
                )
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Cancelada
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {status}
                    </span>
                )
        }
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            filter === 'all'
                                ? 'bg-emerald-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        Todas ({appointments.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            filter === 'active'
                                ? 'bg-emerald-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        En Curso / Aceptadas
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            filter === 'pending'
                                ? 'bg-emerald-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            filter === 'completed'
                                ? 'bg-emerald-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        Historial
                    </button>
                </div>

                {!isProfessional && (
                    <Link
                        href="/professionals"
                        className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-900 hover:bg-emerald-950 text-white px-4 py-2 rounded-xl shadow-sm transition-all"
                    >
                        <Search className="w-3.5 h-3.5" /> Solicitar Nueva Consulta
                    </Link>
                )}
            </div>

            {/* Listado de Consultas */}
            {filteredAppointments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">No hay consultas en esta sección</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                        {isProfessional
                            ? 'Las solicitudes de los pacientes aparecerán aquí en tiempo real cuando sean asignadas.'
                            : 'Puedes explorar los especialistas disponibles y solicitar una consulta inmediata.'}
                    </p>
                    {!isProfessional && (
                        <Link
                            href="/professionals"
                            className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-900 text-white px-5 py-2.5 rounded-xl"
                        >
                            Ver Especialistas Disponibles <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAppointments.map((app) => {
                        const targetName = isProfessional
                            ? app.patient.fullName || 'Paciente'
                            : app.professional?.fullName || 'Buscando especialista...'

                        const targetSub = isProfessional
                            ? `DNI / Tel: ${app.patient.phone || 'No registrado'}`
                            : app.professional?.professionalProfile?.specialty || 'Atención personalizada (30 min)'

                        const canJoinCall =
                            app.status === 'ACCEPTED' || app.status === 'IN_PROGRESS'

                        const roomUrl = app.roomUrl || `/call/${app.id}`

                        return (
                            <div
                                key={app.id}
                                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-sm">{targetName}</h3>
                                                {getStatusBadge(app.status)}
                                            </div>
                                            <p className="text-xs text-slate-500">{targetSub}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {formatDate(app.scheduledAt || app.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {app.durationMinutes} minutos
                                        </span>
                                        {app.professional?.professionalProfile?.hourlyRate && (
                                            <span className="font-semibold text-slate-700">
                                                {formatCurrency(Number(app.professional.professionalProfile.hourlyRate))}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    {isProfessional && app.status === 'SEARCHING' && (
                                        <button
                                            onClick={() => handleAccept(app.id)}
                                            disabled={loadingId === app.id}
                                            className="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                        >
                                            {loadingId === app.id ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Aceptando...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Aceptar Consulta
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {canJoinCall && (
                                        <Link
                                            href={roomUrl}
                                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20"
                                        >
                                            <Video className="w-3.5 h-3.5" /> Entrar a la Sala de Consulta
                                        </Link>
                                    )}

                                    {!isProfessional && app.status === 'PENDING_PAYMENT' && (
                                        <Link
                                            href={`/booking/payment?appointmentId=${app.id}`}
                                            className="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                                        >
                                            <CreditCard className="w-3.5 h-3.5" /> Continuar con el pago
                                        </Link>
                                    )}

                                    {(app.status === 'PENDING_PAYMENT' || app.status === 'SEARCHING' || app.status === 'ACCEPTED') && (
                                        <button
                                            onClick={() => handleCancel(app.id)}
                                            disabled={loadingId === app.id}
                                            className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
