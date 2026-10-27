import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignUpPage() {
    return (
        <div className="auth-page min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-6">
                <picture>
                    <source
                        srcSet="/conta-ya-mark-dark.png"
                        media="(prefers-color-scheme: dark)"
                    />
                    <Image
                        src="/conta-ya-mark.png"
                        alt=""
                        width={88}
                        height={84}
                        className="brand-mark mx-auto mb-1 object-contain"
                        priority
                    />
                </picture>
                <h1 className="auth-brand-name text-[34px] leading-none">
                    <span className="text-black">CONTA</span>{' '}
                    <span className="text-emerald-700">YA!</span>
                </h1>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-900">
                    Plataforma de contención emocional inmediata
                </p>
            </div>

            <SignUp fallbackRedirectUrl="/dashboard" />
        </div>
    )
}
