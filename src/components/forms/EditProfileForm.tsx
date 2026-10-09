'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, ProfileActionState } from '@/actions/profile'
import {
    User,
    ShieldCheck,
    ArrowLeft,
    Loader2,
    Phone,
    CreditCard,
    HeartPulse,
    Calendar,
    Users,
    Stethoscope,
    Building2,
    Award,
    DollarSign,
    FileText,
    CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

interface EditProfileFormProps {
    profile: {
        id: string
        clerkId: string
        email: string
        fullName: string
        documentId: string | null
        birthday: Date | string | null
        gender: string | null
        healthInsurance: string | null
        role: 'PATIENT' | 'PROFESSIONAL' | 'ADMIN'
        phone: string | null
        professionalProfile?: {
            id: string
            licenseNumber: string
            collegeName: string
            specialty: string
            documentId: string
            hourlyRate: number | null
            bio: string | null
            verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
        } | null
    }
}

const initialState: ProfileActionState = {}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)
    const [activeTab, setActiveTab] = useState<'personal' | 'professional'>('personal')
    const [showSuccessToast, setShowSuccessToast] = useState(false)

    // Formatear la fecha para la etiqueta <input type="date" /> (YYYY-MM-DD)
    const formattedBirthday = profile.birthday
        ? new Date(profile.birthday).toISOString().split('T')[0]
        : ''

    const isProfessional = profile.role === 'PROFESSIONAL' || !!profile.professionalProfile

    useEffect(() => {
        if (state.success) {
            setShowSuccessToast(true)
            const timer = setTimeout(() => {
                setShowSuccessToast(false)
                router.refresh()
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [state.success, router])

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xl relative">
                
                {/* Enlaces de retorno */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Panel
                    </Link>

                    {!isProfessional ? (
                        <Link
                            href="/onboarding/professional"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-900 hover:text-emerald-950 font-bold transition-colors"
                        >
                            <Stethoscope className="w-3.5 h-3.5" /> ¿Sos profesional? Registrá tu matrícula
                        </Link>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Stethoscope className="w-3.5 h-3.5" /> Cuenta Profesional
                        </span>
                    )}
                </div>

                {/* Cabecera */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-900 shadow-sm">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Editar Perfil
                        </h1>
                        <p className="text-slate-500 text-xs">{profile.email}</p>
                    </div>
                </div>

                <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                    Mantén tus datos actualizados para una mejor atención y registro en la plataforma.
                </p>

                {/* Pestañas de navegación */}
                <div className="flex border-b border-slate-200 mb-6 gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('personal')}
                        className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                            activeTab === 'personal'
                                ? 'text-emerald-900 border-b-2 border-emerald-900'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Datos Personales
                    </button>

                    {isProfessional && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('professional')}
                            className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                                activeTab === 'professional'
                                    ? 'text-emerald-900 border-b-2 border-emerald-900'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Datos Profesionales
                        </button>
                    )}
                </div>

                {/* Mensajes de Estado */}
                {state.error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium">
                        {state.error}
                    </div>
                )}

                {showSuccessToast && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        {state.message || 'Perfil actualizado correctamente.'}
                    </div>
                )}

                {/* Formulario con noValidate para permitir validación en servidor sin bloquear controles ocultos */}
                <form action={formAction} noValidate className="space-y-4">
                    
                    {/* TAB: DATOS PERSONALES */}
                    <div className={activeTab === 'personal' ? 'space-y-4' : 'hidden'}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-emerald-900" />
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={profile.fullName || ''}
                                placeholder="Tu nombre y apellido"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-emerald-900" />
                                    DNI / Documento *
                                </label>
                                <input
                                    type="text"
                                    name="documentId"
                                    defaultValue={profile.documentId || ''}
                                    placeholder="Ej: 38123456"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-emerald-900" />
                                    Teléfono (WhatsApp) *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={profile.phone || ''}
                                    placeholder="Ej: +54 385 1234567"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-emerald-900" />
                                    Género *
                                </label>
                                <select
                                    name="gender"
                                    defaultValue={profile.gender || ''}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMENINO">Femenino</option>
                                    <option value="OTRO">Otro / Prefiero no decir</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-900" />
                                    Fecha de Nacimiento *
                                </label>
                                <input
                                    type="date"
                                    name="birthday"
                                    defaultValue={formattedBirthday}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <HeartPulse className="w-3.5 h-3.5 text-emerald-900" />
                                Obra Social o Prepaga (Opcional)
                            </label>
                            <input
                                type="text"
                                name="healthInsurance"
                                defaultValue={profile.healthInsurance || ''}
                                placeholder="Ej: OSDE, Swiss Medical, Particular..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                            />
                        </div>
                    </div>

                    {/* TAB: DATOS PROFESIONALES */}
                    {isProfessional && (
                        <div className={activeTab === 'professional' ? 'space-y-4' : 'hidden'}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Stethoscope className="w-3.5 h-3.5 text-emerald-900" />
                                    Especialidad Principal
                                </label>
                                <input
                                    type="text"
                                    name="specialty"
                                    defaultValue={profile.professionalProfile?.specialty || ''}
                                    placeholder="Ej: Psicología Clínica, Psiquiatría..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-emerald-900" />
                                        Número de Matrícula
                                    </label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        defaultValue={profile.professionalProfile?.licenseNumber || ''}
                                        placeholder="Ej: MP 12345"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-emerald-900" />
                                        Colegio Profesional / Entidad Emisora
                                    </label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        defaultValue={profile.professionalProfile?.collegeName || ''}
                                        placeholder="Ej: Colegio de Psicólogos de Santiago del Estero"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-900" />
                                        Arancel por Consulta (ARS) <span className="text-slate-400 font-normal">(Opcional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        step="any"
                                        defaultValue={
                                            profile.professionalProfile?.hourlyRate !== undefined &&
                                            profile.professionalProfile?.hourlyRate !== null
                                                ? Number(profile.professionalProfile.hourlyRate)
                                                : ''
                                        }
                                        placeholder="Ej: 15000"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-emerald-900" />
                                        DNI / CUIT Profesional
                                    </label>
                                    <input
                                        type="text"
                                        name="proDocumentId"
                                        defaultValue={profile.professionalProfile?.documentId || profile.documentId || ''}
                                        placeholder="Ej: 38123456"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-emerald-900" />
                                    Biografía / Presentación Profesional
                                </label>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    defaultValue={profile.professionalProfile?.bio || ''}
                                    placeholder="Breve descripción de tu experiencia, enfoque terapéutico y formación..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900 focus:ring-1 focus:ring-emerald-900 transition-all resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-start gap-3 mt-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                            Tus datos se guardan de forma segura y se sincronizan con tus consultas en la plataforma.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 text-sm cursor-pointer"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Guardando cambios...
                            </>
                        ) : (
                            'Guardar Cambios'
                        )}
                    </button>
                </form>
            </div>
        </main>
    )
}
