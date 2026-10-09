'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface ProfileActionState {
    error?: string
    success?: boolean
    message?: string
}

export async function updateProfile(
    prevState: ProfileActionState,
    formData: FormData
): Promise<ProfileActionState> {
    const { userId } = await auth()

    if (!userId) {
        return { error: 'Usuario no autenticado' }
    }

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const documentId = formData.get('documentId') as string
    const gender = formData.get('gender') as string
    const birthdayStr = formData.get('birthday') as string
    const healthInsurance = formData.get('healthInsurance') as string

    // Professional fields (if applicable)
    const specialty = formData.get('specialty') as string
    const licenseNumber = formData.get('licenseNumber') as string
    const collegeName = formData.get('collegeName') as string
    const proDocumentId = (formData.get('proDocumentId') as string) || documentId
    const hourlyRateStr = formData.get('hourlyRate') as string
    const bio = formData.get('bio') as string

    if (!phone || !documentId || !gender || !birthdayStr) {
        return { error: 'DNI, teléfono, género y fecha de nacimiento son obligatorios' }
    }

    // Parse birthday safely
    const birthday = new Date(`${birthdayStr}T00:00:00`)
    if (isNaN(birthday.getTime())) {
        return { error: 'Fecha de nacimiento inválida' }
    }

    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { clerkId: userId },
            include: { professionalProfile: true },
        })

        if (!existingProfile) {
            return { error: 'No se encontró el perfil del usuario' }
        }

        // 1. Actualizar datos base del perfil
        const updatedProfile = await prisma.profile.update({
            where: { id: existingProfile.id },
            data: {
                fullName: fullName && fullName.trim() !== '' ? fullName.trim() : existingProfile.fullName,
                phone,
                documentId,
                gender,
                birthday,
                healthInsurance: healthInsurance || null,
            },
        })

        // 2. Si el usuario es PROFESIONAL o envió datos profesionales, actualizamos/hacemos upsert en ProfessionalProfile
        const hasProData = specialty || licenseNumber || collegeName || existingProfile.role === 'PROFESSIONAL'

        if (hasProData) {
            let hourlyRate = 0
            if (hourlyRateStr && hourlyRateStr.trim() !== '') {
                const parsedRate = parseFloat(hourlyRateStr)
                if (!isNaN(parsedRate) && parsedRate >= 0) {
                    hourlyRate = parsedRate
                }
            } else if (existingProfile.professionalProfile?.hourlyRate) {
                hourlyRate = Number(existingProfile.professionalProfile.hourlyRate)
            }

            const currentLicense = licenseNumber || existingProfile.professionalProfile?.licenseNumber || ''
            const currentCollege = collegeName || existingProfile.professionalProfile?.collegeName || ''
            const currentSpecialty = specialty || existingProfile.professionalProfile?.specialty || ''

            if (currentLicense && currentCollege && currentSpecialty) {
                await prisma.professionalProfile.upsert({
                    where: { profileId: existingProfile.id },
                    update: {
                        specialty: currentSpecialty,
                        licenseNumber: currentLicense,
                        collegeName: currentCollege,
                        documentId: proDocumentId || documentId,
                        hourlyRate,
                        bio: bio || null,
                    },
                    create: {
                        profileId: existingProfile.id,
                        specialty: currentSpecialty,
                        licenseNumber: currentLicense,
                        collegeName: currentCollege,
                        documentId: proDocumentId || documentId,
                        hourlyRate,
                        bio: bio || null,
                    },
                })
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/profile')
        revalidatePath('/appointments')
        return { success: true, message: 'Perfil actualizado con éxito' }
    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        return { error: 'Ocurrió un error al guardar los cambios en la base de datos' }
    }
}
