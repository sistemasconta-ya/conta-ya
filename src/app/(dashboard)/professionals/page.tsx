import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ProfessionalsMapView from './map-view'

export default async function ProfessionalsPage() {
    // 1. Consulta 100% real a la base de datos PostgreSQL vía Prisma
    const dbProfessionals = await prisma.professionalProfile.findMany({
        include: {
            profile: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    avatarUrl: true,
                },
            },
        },
        orderBy: {
            isOnline: 'desc',
        },
    })

    // 2. Mapeo estructurado para la vista y geolocalización en mapa
    const professionals = dbProfessionals.map((pro, index) => {
        const specialtyLower = pro.specialty.toLowerCase()
        let type = 'psychologist'
        if (specialtyLower.includes('acompañante') || specialtyLower.includes('terapéut')) {
            type = 'therapist'
        } else if (specialtyLower.includes('coach')) {
            type = 'coach'
        } else if (specialtyLower.includes('estudiante')) {
            type = 'student'
        }

        // Variación sutil de coordenadas en Santiago del Estero para el mapa interactivo
        const latOffset = ((index % 5) - 2) * 0.007
        const lngOffset = (((index * 3) % 5) - 2) * 0.007

        return {
            id: pro.id,
            profileId: pro.profileId,
            fullName: pro.profile.fullName || 'Profesional de Salud',
            specialty: pro.specialty,
            licenseNumber: pro.licenseNumber,
            collegeName: pro.collegeName,
            hourlyRate: pro.hourlyRate ? Number(pro.hourlyRate) : 0,
            isOnline: pro.isOnline,
            type,
            lat: -27.7833 + latOffset,
            lng: -64.2667 + lngOffset,
            bio: pro.bio,
        }
    })

    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="w-10 h-10 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ProfessionalsMapView professionals={professionals} />
        </Suspense>
    )
}