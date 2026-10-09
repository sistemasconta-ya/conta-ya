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
    Sparkles,
    Loader2,
    CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
            {/* Header de la Sala */}
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                        <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                            <span>Consulta en Vivo: {otherPartyName}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {otherPartyRole}
                            </span>
                        </h1>
                        <p className="text-[11px] text-slate-400">ID de Sesión: {appointment.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-slate-200">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{formatTimer(secondsLeft)}</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Encriptado de extremo a extremo</span>
                    </div>
                </div>
            </div>

            {/* Video Streams Grid */}
            <div className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Remoto */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
                    <div className="w-24 h-24 rounded-full bg-emerald-900/40 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                        <User className="w-12 h-12" />
                    </div>
                    <p className="text-sm font-bold text-slate-200">{otherPartyName}</p>
                    <p className="text-xs text-slate-500">{otherPartyRole}</p>

                    <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Conectado
                    </div>
                </div>

                {/* Local */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
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

                    <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {isMuted ? 'Micrófono Silenciado' : 'Micrófono Activo'}
                    </div>
                </div>
            </div>

            {/* Controles de Llamada */}
            <div className="max-w-xl w-full mx-auto bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-800 flex items-center justify-center gap-4 shadow-xl">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer ${
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
                    className={`p-4 rounded-2xl transition-all cursor-pointer ${
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
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-rose-600/20 cursor-pointer disabled:opacity-50"
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
    )
}
