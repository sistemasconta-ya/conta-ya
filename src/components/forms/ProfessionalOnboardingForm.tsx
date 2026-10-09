'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeProfessionalOnboarding, OnboardingState } from '@/actions/onboarding'
import { Stethoscope, ShieldCheck, Loader2 } from 'lucide-react'

const initialState: OnboardingState = {}

export default function ProfessionalOnboardingForm() {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(completeProfessionalOnboarding, initialState)

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard')
            router.refresh()
        }
    }, [state.success, router])

    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Stethoscope className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-50">Registro de Profesional</h1>
            </div>

            <p className="text-slate-400 text-sm mb-6">
                Completa tus datos profesionales para verificar tu matrícula y comenzar a recibir consultas.
            </p>

            {state.error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Especialidad
                    </label>
                    <input
                        type="text"
                        name="specialty"
                        required
                        placeholder="Ej: Psicología Clínica, Acompañante Terapéutico, Psiquiatría..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Número de Matrícula
                        </label>
                        <input
                            type="text"
                            name="licenseNumber"
                            required
                            placeholder="Ej: MP 12345"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Colegio Profesional / Entidad
                        </label>
                        <input
                            type="text"
                            name="collegeName"
                            required
                            placeholder="Ej: Colegio de Psicólogos"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Documento / DNI
                        </label>
                        <input
                            type="text"
                            name="documentId"
                            required
                            placeholder="Ej: 38123456"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Arancel por Consulta (ARS) <span className="text-slate-500 font-normal">(Opcional)</span>
                        </label>
                        <input
                            type="number"
                            name="hourlyRate"
                            step="any"
                            placeholder="Ej: 15000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-start gap-3 mt-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Tu solicitud quedará guardada y tu perfil pasará automáticamente al rol <span className="text-emerald-400 font-semibold">Profesional</span>.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Guardando registro...
                        </>
                    ) : (
                        'Completar Registro Profesional'
                    )}
                </button>
            </form>
        </div>
    )
}
