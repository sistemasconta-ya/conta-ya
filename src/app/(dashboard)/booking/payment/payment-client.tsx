'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Check,
    Clipboard,
    Clock3,
    CreditCard,
    Info,
    Landmark,
    UserRound,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PaymentDetails {
    alias: string | null
    cbu: string | null
    holder: string | null
}

interface BookingPaymentClientProps {
    durationMinutes: number
    professional: {
        fullName: string
        avatarUrl: string | null
        specialty: string
        hourlyRate: number
        isOnline: boolean
    }
    paymentDetails: PaymentDetails | null
}

export default function BookingPaymentClient({
    durationMinutes,
    professional,
    paymentDetails,
}: BookingPaymentClientProps) {
    const router = useRouter()
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [copyError, setCopyError] = useState<string | null>(null)
    const alias = paymentDetails?.alias
    const cbu = paymentDetails?.cbu

    const copyPaymentDetail = async (field: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value)
            setCopiedField(field)
            setCopyError(null)
            window.setTimeout(() => setCopiedField(null), 2000)
        } catch (error) {
            console.error('No se pudo copiar el dato de transferencia:', error)
            setCopyError('No se pudo copiar el dato. Seleccionalo y copialo manualmente.')
        }
    }

    return (
        <main className="min-h-screen bg-background px-3 pb-8 pt-3 text-slate-900 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-xl">
                <header className="mb-4 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push('/professionals')}
                        aria-label="Volver a profesionales"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-700 transition hover:bg-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                        Confirmá tu sesión
                    </h1>
                </header>

                <section className="mb-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                            <UserRound className="h-7 w-7" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-bold sm:text-base">
                                {professional.specialty}
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Sesión de {durationMinutes} minutos
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            {professional.hourlyRate > 0 ? (
                                <>
                                    <p className="text-sm font-bold text-emerald-800 sm:text-base">
                                        {formatCurrency(professional.hourlyRate)}
                                    </p>
                                    <p className="text-[11px] text-slate-500">por sesión</p>
                                </>
                            ) : (
                                <p className="max-w-24 text-xs font-semibold text-slate-600">
                                    Precio a confirmar
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mb-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="mb-3 text-sm font-bold">Profesional seleccionado</h2>
                    <div className="flex items-center gap-3">
                        {professional.avatarUrl ? (
                            <Image
                                src={professional.avatarUrl}
                                alt=""
                                width={52}
                                height={52}
                                unoptimized
                                className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <UserRound className="h-7 w-7" aria-hidden="true" />
                            </span>
                        )}
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold">{professional.fullName}</h3>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                {professional.specialty}
                                {professional.isOnline ? ' · En línea' : ''}
                                {' · '}
                                {durationMinutes} minutos
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                    <h2 className="mb-3 text-sm font-bold">Método de pago</h2>
                    <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-700 bg-white px-3 py-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                            <Landmark className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">Transferencia bancaria</p>
                            <p className="text-xs text-slate-500">Datos de cobro de Conta YA!</p>
                        </div>
                        {paymentDetails && (
                            <Check className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                        )}
                    </div>

                    {paymentDetails ? (
                        <div className="payment-account-details mt-3 space-y-2 rounded-2xl bg-slate-50 p-3.5">
                            <h3 className="text-xs font-semibold text-slate-800">Datos de la cuenta</h3>
                            {alias && (
                                <PaymentDetail
                                    label="Alias"
                                    value={alias}
                                    copied={copiedField === 'alias'}
                                    onCopy={() => copyPaymentDetail('alias', alias)}
                                />
                            )}
                            {cbu && (
                                <PaymentDetail
                                    label="CBU"
                                    value={cbu}
                                    copied={copiedField === 'cbu'}
                                    onCopy={() => copyPaymentDetail('cbu', cbu)}
                                />
                            )}
                            {paymentDetails.holder && (
                                <div className="flex items-start gap-3 text-xs">
                                    <span className="w-14 shrink-0 text-slate-500">Titular</span>
                                    <span className="font-medium text-slate-800">{paymentDetails.holder}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="payment-warning mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-950">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <p>
                                Los datos bancarios aún no están configurados. No realices una transferencia
                                hasta que Conta YA! publique los datos oficiales de pago.
                            </p>
                        </div>
                    )}
                    {copyError && (
                        <p role="alert" className="mt-2 text-xs text-rose-700">
                            {copyError}
                        </p>
                    )}
                </section>

                <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-sky-50 p-3.5 text-xs leading-relaxed text-slate-700">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-800" aria-hidden="true" />
                    La solicitud está pendiente de pago. La conexión no se iniciará hasta que el pago sea
                    acreditado.
                </div>

                <button
                    type="button"
                    disabled
                    className="payment-submit-button flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white opacity-60"
                >
                    {paymentDetails ? (
                        <>
                            <Clock3 className="h-4 w-4" aria-hidden="true" />
                            Confirmación de pago no disponible
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4 w-4" aria-hidden="true" />
                            Datos de pago no configurados
                        </>
                    )}
                </button>

                <div className="mt-5 flex items-start justify-center gap-2 px-4 text-center text-xs leading-relaxed text-slate-500">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                        {paymentDetails
                            ? 'La verificación automática de pagos todavía no está habilitada. Tu reserva permanece pendiente.'
                            : 'Configura los datos oficiales de pago para que el paciente pueda continuar con la reserva.'}
                    </span>
                </div>

                <Link
                    href="/professionals"
                    className="mt-5 block text-center text-xs font-semibold text-emerald-800 underline-offset-4 hover:underline"
                >
                    Volver a profesionales
                </Link>
            </div>
        </main>
    )
}

function PaymentDetail({
    label,
    value,
    copied,
    onCopy,
}: {
    label: string
    value: string
    copied: boolean
    onCopy: () => void
}) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="w-14 shrink-0 text-slate-500">{label}</span>
            <span className="min-w-0 flex-1 break-all font-medium text-slate-800">{value}</span>
            <button
                type="button"
                onClick={onCopy}
                aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-emerald-800"
            >
                {copied ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Clipboard className="h-4 w-4" aria-hidden="true" />
                )}
            </button>
        </div>
    )
}
