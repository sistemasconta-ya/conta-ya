'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface AppointmentActionState {
    error?: string
    success?: boolean
    appointmentId?: string
}

export async function createAppointment(
    targetProfessionalId?: string | null,
    notes?: string
): Promise<AppointmentActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    try {
        const patientProfile = await prisma.profile.findUnique({
            where: { clerkId: userId },
        })

        if (!patientProfile) {
            return { error: 'Perfil de paciente no encontrado' }
        }

        // Si se especificó un targetProfessionalId, verificar que exista
        let verifiedProfessionalId: string | null = null
        if (targetProfessionalId) {
            const proProfile = await prisma.profile.findUnique({
                where: { id: targetProfessionalId },
            })
            if (proProfile) {
                verifiedProfessionalId = proProfile.id
            }
        }

        // Crear la cita en estado SEARCHING
        const appointment = await prisma.appointment.create({
            data: {
                patientId: patientProfile.id,
                professionalId: verifiedProfessionalId,
                status: 'SEARCHING',
                durationMinutes: 30,
                scheduledAt: new Date(),
            },
        })

        // Generar URL de sala dinámica
        const roomUrl = `/call/${appointment.id}`
        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { roomUrl },
        })

        revalidatePath('/dashboard')
        revalidatePath('/appointments')
        revalidatePath('/professionals')

        return { success: true, appointmentId: appointment.id }
    } catch (error) {
        console.error('Error al crear la cita:', error)
        return { error: 'Error al solicitar la consulta. Inténtalo nuevamente.' }
    }
}

export async function acceptAppointment(
    appointmentId: string
): Promise<AppointmentActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    try {
        const professionalProfile = await prisma.profile.findUnique({
            where: { clerkId: userId },
        })

        if (!professionalProfile) {
            return { error: 'Perfil no encontrado' }
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        })

        if (!appointment) {
            return { error: 'Cita no encontrada' }
        }

        if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
            return { error: 'La cita ya no está disponible para ser aceptada' }
        }

        const roomUrl = appointment.roomUrl || `/call/${appointment.id}`

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                professionalId: professionalProfile.id,
                status: 'ACCEPTED',
                startedAt: new Date(),
                roomUrl,
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/appointments')

        return { success: true, appointmentId }
    } catch (error) {
        console.error('Error al aceptar cita:', error)
        return { error: 'No se pudo aceptar la cita' }
    }
}

export async function startAppointmentSession(
    appointmentId: string
): Promise<AppointmentActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    try {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/appointments')
        revalidatePath(`/call/${appointmentId}`)

        return { success: true, appointmentId }
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return { error: 'No se pudo iniciar la sesión' }
    }
}

export async function completeAppointment(
    appointmentId: string
): Promise<AppointmentActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    try {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'COMPLETED',
                endedAt: new Date(),
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/appointments')

        return { success: true, appointmentId }
    } catch (error) {
        console.error('Error al completar cita:', error)
        return { error: 'No se pudo finalizar la cita' }
    }
}

export async function cancelAppointment(
    appointmentId: string
): Promise<AppointmentActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    try {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
                endedAt: new Date(),
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/appointments')

        return { success: true, appointmentId }
    } catch (error) {
        console.error('Error al cancelar cita:', error)
        return { error: 'No se pudo cancelar la cita' }
    }
}
