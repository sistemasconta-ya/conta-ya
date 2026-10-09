import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditProfileForm from '@/components/forms/EditProfileForm'

export default async function ProfilePage() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    // 1. Cargar el perfil del usuario desde Supabase/Prisma incluyendo datos profesionales
    let profile = await prisma.profile.findUnique({
        where: { clerkId: userId },
        include: {
            professionalProfile: true,
        },
    })

    // Si aún no existe el registro en la base de datos (por ejemplo, primer login), auto-crear perfil base
    if (!profile) {
        const user = await currentUser()
        if (user) {
            const userEmail = user.emailAddresses[0]?.emailAddress || ''
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario'

            profile = await prisma.profile.create({
                data: {
                    clerkId: userId,
                    email: userEmail,
                    fullName: fullName,
                    role: 'PATIENT',
                },
                include: {
                    professionalProfile: true,
                },
            })
        }
    }

    if (!profile) {
        redirect('/sign-in')
    }

    // 2. Serializar tipos complejos como Prisma.Decimal a primitives (number / null) para el Client Component
    const profileData = {
        ...profile,
        professionalProfile: profile.professionalProfile
            ? {
                  ...profile.professionalProfile,
                  hourlyRate: profile.professionalProfile.hourlyRate
                      ? Number(profile.professionalProfile.hourlyRate)
                      : null,
              }
            : null,
    }

    return <EditProfileForm profile={profileData} />
}
