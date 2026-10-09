import { SignIn } from '@clerk/nextjs'
import { Heart } from 'lucide-react'

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Cabecera integrada */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-900 mx-auto mb-3 shadow-sm">
                    <Heart className="w-8 h-8 fill-emerald-900" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-0.5">
                    Bienvenido a
                </span>
                <h1 className="text-2xl font-black text-emerald-950 tracking-tight">
                    CONTA YA!
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                    Contención emocional inmediata, 24/7
                </p>
            </div>

            {/* Componente Clerk limpio */}
            <SignIn fallbackRedirectUrl="/dashboard" />
        </div>
    )
}
