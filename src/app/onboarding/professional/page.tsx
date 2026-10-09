import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProfessionalOnboardingForm from '@/components/forms/ProfessionalOnboardingForm'

export default function ProfessionalOnboardingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </Link>

                <ProfessionalOnboardingForm />
            </div>
        </main>
    )
}