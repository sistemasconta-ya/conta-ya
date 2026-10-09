import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AppointmentsClient from './appointments-client'

export default async function AppointmentsPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const profile = await prisma.profile.findUnique({
        where: { clerkId: userId },
    })

    if (!profile) {
        redirect('/sign-in')
    }

    const isProfessional = profile.role === 'PROFESSIONAL'

    // Consultar citas reales desde PostgreSQL mediante Prisma
    const appointments = await prisma.appointment.findMany({
        where: isProfessional
            ? {
                  OR: [
                      { professionalId: profile.id },
                      { status: 'SEARCHING' },
                  ],
              }
            : {
                  patientId: profile.id,
              },
        include: {
            patient: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                },
            },
            professional: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    professionalProfile: {
                        select: {
                            specialty: true,
                            hourlyRate: true,
                            licenseNumber: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <main className="p-4 sm:p-8 md:p-12 max-w-5xl mx-auto space-y-6 bg-slate-50 text-slate-900 font-sans">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {isProfessional ? 'Gestión de Consultas y Pacientes' : 'Mis Consultas Agendadas'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    {isProfessional
                        ? 'Administra tus sesiones, acepta solicitudes entrantes e ingresa a tus salas virtuales.'
                        : 'Visualiza el estado de tus consultas solicitadas y conéctate con tus especialistas en tiempo real.'}
                </p>
            </div>

            <AppointmentsClient
                appointments={appointments as any}
                isProfessional={isProfessional}
            />
        </main>
    )
}
