import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CallClient from './call-client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CallPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const { id } = await params

    const profile = await prisma.profile.findUnique({
        where: { clerkId: userId },
    })

    if (!profile) {
        redirect('/sign-in')
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
            patient: true,
            professional: {
                include: {
                    professionalProfile: true,
                },
            },
        },
    })

    if (!appointment) {
        notFound()
    }

    if (appointment.status === 'PENDING_PAYMENT') {
        if (appointment.patientId === profile.id) {
            redirect(`/booking/payment?appointmentId=${appointment.id}`)
        }
        redirect('/appointments')
    }

    // Verificar si el usuario tiene permiso para unirse a esta sesión
    const isPatient = appointment.patientId === profile.id
    const isProfessional = appointment.professionalId === profile.id || profile.role === 'PROFESSIONAL'

    if (!isPatient && !isProfessional && profile.role !== 'ADMIN') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-xl font-bold text-slate-800 mb-2">Acceso No Autorizado</h1>
                <p className="text-sm text-slate-500 mb-6">No tienes permiso para unirte a esta consulta médica.</p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm bg-emerald-900 text-white px-4 py-2 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                </Link>
            </div>
        )
    }

    return <CallClient appointment={appointment} isProfessional={isProfessional} />
}
