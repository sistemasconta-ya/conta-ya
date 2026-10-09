'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { acceptAppointment } from '@/actions/appointments'
import { CheckCircle2, Loader2, Video, Clock, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface PendingAppointmentProps {
    appointments: Array<{
        id: string
        status: string
        scheduledAt: Date | string | null
        durationMinutes: number
        createdAt: Date | string
        roomUrl: string | null
        patient: {
            id: string
            fullName: string
            email: string
            phone: string | null
        }
    }>
}

export function ProfessionalPendingRequests({ appointments }: PendingAppointmentProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleAccept = async (id: string) => {
        setLoadingId(id)
        try {
            await acceptAppointment(id)
            router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    if (appointments.length === 0) {
        return (
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium">No hay solicitudes de consulta pendientes en este momento.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {appointments.map((app) => (
                <div
                    key={app.id}
                    className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{app.patient.fullName}</h4>
                            <p className="text-xs text-slate-500">
                                Tel: {app.patient.phone || 'No especificado'} • Solicitado: {formatDate(app.createdAt)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleAccept(app.id)}
                        disabled={loadingId === app.id}
                        className="inline-flex items-center justify-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
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
                </div>
            ))}
        </div>
    )
}

interface ActiveSessionsProps {
    sessions: Array<{
        id: string
        status: string
        roomUrl: string | null
        patient?: { fullName: string }
        professional?: { fullName: string; professionalProfile?: { specialty: string } | null }
        durationMinutes: number
        scheduledAt: Date | string | null
    }>
    isProfessional: boolean
}

export function ActiveSessionsList({ sessions, isProfessional }: ActiveSessionsProps) {
    if (sessions.length === 0) return null

    return (
        <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Consultas Activas y Confirmadas</h3>
            <div className="grid gap-3">
                {sessions.map((session) => {
                    const name = isProfessional
                        ? session.patient?.fullName || 'Paciente'
                        : session.professional?.fullName || 'Profesional Asignado'
                    const roomUrl = session.roomUrl || `/call/${session.id}`

                    return (
                        <div
                            key={session.id}
                            className="p-4 bg-emerald-50/60 border-2 border-emerald-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shrink-0">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 uppercase">
                                            {session.status === 'IN_PROGRESS' ? 'En Curso' : 'Confirmada'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                                        <Clock className="w-3.5 h-3.5 text-emerald-900" />
                                        Sesión de {session.durationMinutes} minutos lista para iniciar
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={roomUrl}
                                className="inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/20 shrink-0"
                            >
                                <Video className="w-4 h-4" /> Entrar a la Sala Virtual
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
