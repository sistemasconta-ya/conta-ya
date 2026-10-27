import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingPaymentClient from './payment-client'

interface BookingPaymentPageProps {
    searchParams: Promise<{ appointmentId?: string | string[] }>
}

export default async function BookingPaymentPage({
    searchParams,
}: BookingPaymentPageProps) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const { appointmentId: appointmentIdParam } = await searchParams
    const appointmentId = Array.isArray(appointmentIdParam)
        ? appointmentIdParam[0]
        : appointmentIdParam

    if (!appointmentId) {
        redirect('/professionals')
    }

    const patient = await prisma.profile.findUnique({
        where: { clerkId: userId },
        select: { id: true },
    })

    if (!patient) {
        redirect('/sign-in')
    }

    const appointment = await prisma.appointment.findFirst({
        where: {
            id: appointmentId,
            patientId: patient.id,
            status: 'PENDING_PAYMENT',
            professionalId: { not: null },
        },
        include: {
            professional: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    professionalProfile: {
                        select: {
                            specialty: true,
                            hourlyRate: true,
                            isOnline: true,
                        },
                    },
                },
            },
        },
    })

    const professional = appointment?.professional
    const professionalDetails = professional?.professionalProfile

    if (!appointment || !professional || !professionalDetails) {
        redirect('/professionals')
    }

    const transferAlias = process.env.CONTA_Y_TRANSFER_ALIAS
    const transferCbu = process.env.CONTA_Y_TRANSFER_CBU
    const transferHolder = process.env.CONTA_Y_TRANSFER_HOLDER
    const paymentDetails = transferAlias || transferCbu || transferHolder
        ? {
              alias: transferAlias ?? null,
              cbu: transferCbu ?? null,
              holder: transferHolder ?? null,
          }
        : null

    return (
        <BookingPaymentClient
            durationMinutes={appointment.durationMinutes}
            professional={{
                fullName: professional.fullName,
                avatarUrl: professional.avatarUrl,
                specialty: professionalDetails.specialty,
                hourlyRate: Number(professionalDetails.hourlyRate),
                isOnline: professionalDetails.isOnline,
            }}
            paymentDetails={paymentDetails}
        />
    )
}
