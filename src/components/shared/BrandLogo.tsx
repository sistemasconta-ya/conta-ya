import Image from 'next/image'

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
    return (
        <span className="inline-flex items-center gap-2" aria-label="Conta YA!">
            <picture>
                <source
                    srcSet="/conta-ya-mark-dark.png"
                    media="(prefers-color-scheme: dark)"
                />
                <Image
                    src="/conta-ya-mark.png"
                    alt=""
                    width={compact ? 34 : 40}
                    height={compact ? 34 : 40}
                    priority
                    className="brand-mark"
                />
            </picture>
            <span
                className={`auth-brand-name whitespace-nowrap leading-none ${compact ? 'text-[17px]' : 'text-xl'}`}
            >
                <span className="text-black">CONTA</span>{' '}
                <span className="text-emerald-700">YA!</span>
            </span>
        </span>
    )
}
