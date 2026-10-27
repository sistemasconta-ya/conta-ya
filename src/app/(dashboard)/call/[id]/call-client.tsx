'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeAppointment, startAppointmentSession } from '@/actions/appointments'
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    User,
    Shield,
    Clock,
    Loader2,
} from 'lucide-react'

interface CallClientProps {
    appointment: {
        id: string
        status: string
        startedAt: Date | string | null
        durationMinutes: number
        patient: {
            id: string
            fullName: string
            email: string
            avatarUrl?: string | null
        }
        professional?: {
            id: string
            fullName: string
            email: string
            professionalProfile?: {
                specialty: string
                licenseNumber: string
            } | null
        } | null
    }
    isProfessional: boolean
}

export default function CallClient({ appointment, isProfessional }: CallClientProps) {
    const router = useRouter()
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isEnding, setIsEnding] = useState(false)
    const [status, setStatus] = useState(appointment.status)
    const [secondsLeft, setSecondsLeft] = useState(appointment.durationMinutes * 60)

    useEffect(() => {
        // Si la cita está aceptada y entran a la sala, iniciar la sesión
        if (status === 'ACCEPTED') {
            startAppointmentSession(appointment.id).then(() => {
                setStatus('IN_PROGRESS')
            })
        }
    }, [appointment.id, status])

    useEffect(() => {
        if (status !== 'IN_PROGRESS') return

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [status])

    const formatTimer = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleEndCall = async () => {
        if (!confirm('¿Estás seguro de que deseas finalizar la sesión de consulta?')) return
        setIsEnding(true)
        await completeAppointment(appointment.id)
        router.push('/appointments')
        router.refresh()
    }

    const otherPartyName = isProfessional
        ? appointment.patient.fullName
        : appointment.professional?.fullName || 'Profesional Asignado'

    const otherPartyRole = isProfessional ? 'Paciente' : appointment.professional?.professionalProfile?.specialty || 'Especialista'

    return (
        <main className="call-page min-h-[calc(100vh-4rem)] p-2 font-sans text-white sm:p-4 md:p-6">
            <div className="call-room-shell mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl sm:min-h-[calc(100vh-6rem)] sm:gap-6 sm:rounded-[32px] sm:p-5 md:p-7">
            {/* Header de la Sala */}
            <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-3.5">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="min-w-0">
                        <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-slate-100 sm:text-sm">
                            <span>Consulta en Vivo: {otherPartyName}</span>
                            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 sm:text-xs">
                                {otherPartyRole}
                            </span>
                        </h1>
                        <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">ID de Sesión: {appointment.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-2 py-1.5 font-mono text-xs font-bold text-slate-200 sm:px-3">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{formatTimer(secondsLeft)}</span>
                    </div>

                    <div className="hidden items-center gap-1 text-[11px] text-slate-400 lg:flex">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Encriptado de extremo a extremo</span>
                    </div>
                </div>
            </div>

            {/* Video Streams Grid */}
            <div className="my-0 grid w-full flex-1 grid-cols-1 gap-3 sm:my-1 sm:gap-4 md:grid-cols-2">
                {/* Remoto */}
                <div className="relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-800/95 to-slate-900 shadow-2xl sm:min-h-[300px]">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-900/40 text-emerald-400 shadow-lg shadow-emerald-500/10">
                        <User className="h-12 w-12" />
                    </div>
                    <p className="text-sm font-bold text-slate-200">{otherPartyName}</p>
                    <p className="text-xs text-slate-500">{otherPartyRole}</p>

                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md sm:left-4 sm:top-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Conectado
                    </div>
                </div>

                {/* Local */}
                <div className="relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-800/95 to-slate-900 shadow-2xl sm:min-h-[300px]">
                    {isVideoOff ? (
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                            <VideoOff className="w-10 h-10" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 mb-4">
                            <User className="w-12 h-12" />
                        </div>
                    )}
                    <p className="text-sm font-bold text-slate-200">Tú ({isProfessional ? 'Profesional' : 'Paciente'})</p>
                    <p className="text-xs text-slate-500">{isVideoOff ? 'Cámara desactivada' : 'Cámara activa'}</p>

                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md sm:left-4 sm:top-4">
                        <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {isMuted ? 'Micrófono Silenciado' : 'Micrófono Activo'}
                    </div>
                </div>
            </div>

            {/* Controles de Llamada */}
            <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3 rounded-3xl border border-slate-700 bg-slate-800/90 px-3 py-3 shadow-xl backdrop-blur-md sm:gap-4 sm:px-6 sm:py-4">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all cursor-pointer sm:h-14 sm:w-14 ${
                        isMuted
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                    }`}
                    title={isMuted ? 'Activar Micrófono' : 'Silenciar Micrófono'}
                >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    aria-label={isVideoOff ? 'Activar cámara' : 'Desactivar cámara'}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all cursor-pointer sm:h-14 sm:w-14 ${
                        isVideoOff
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                    }`}
                    title={isVideoOff ? 'Activar Cámara' : 'Desactivar Cámara'}
                >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                <button
                    onClick={handleEndCall}
                    disabled={isEnding}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:px-6 sm:py-3.5"
                >
                    {isEnding ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Finalizando...
                        </>
                    ) : (
                        <>
                            <PhoneOff className="w-5 h-5" /> Finalizar Consulta
                        </>
                    )}
                </button>
            </div>
            </div>
        </main>
    )
}
