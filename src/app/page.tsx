import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowDownToLine,
  ArrowRight,
  Brain,
  Clock3,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Phone,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'

const steps = [
  {
    number: '1',
    icon: ArrowDownToLine,
    title: 'Creá tu cuenta',
    description: 'Registrate en minutos con tu correo electrónico.',
  },
  {
    number: '2',
    icon: Search,
    title: 'Elegí un profesional',
    description: 'Encontrá el perfil que mejor se adapta a vos.',
  },
  {
    number: '3',
    icon: MapPin,
    title: 'Conectá en tiempo real',
    description: 'Buscá profesionales cercanos y disponibles.',
  },
  {
    number: '4',
    icon: Video,
    title: 'Iniciá tu sesión',
    description: 'Conectate de forma segura desde donde estés.',
  },
]

const specialties = [
  {
    icon: Brain,
    title: 'Psicólogos',
    description: 'Asistencia en salud mental',
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañantes terapéuticos',
    description: 'Acompañamiento y contención',
    color: 'bg-violet-50 text-violet-700',
  },
  {
    icon: UsersRound,
    title: 'Coaches',
    description: 'Orientación y desarrollo personal',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    icon: GraduationCap,
    title: 'Estudiantes avanzados',
    description: 'Escucha y acompañamiento supervisado',
    color: 'bg-sky-50 text-sky-700',
  },
]

const benefits = [
  {
    icon: Clock3,
    title: 'Atención cuando la necesitás',
    description: 'Encontrá opciones disponibles para dar el primer paso en el momento justo.',
  },
  {
    icon: ShieldCheck,
    title: 'Un espacio seguro',
    description: 'Tus sesiones y tus datos personales se mantienen privados y protegidos.',
  },
  {
    icon: Video,
    title: 'Sin complicaciones',
    description: 'Reservá y conectate desde tu celular o computadora, sin instalar nada.',
  },
]

function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[660px] aspect-[1086/918]">
      <Image
        src="/contaya-hero-phones-2x.png"
        alt="Dos teléfonos completos con las pantallas de Conta YA! de inicio de sesión y profesionales cercanos"
        width={1086}
        height={918}
        sizes="(max-width: 1024px) 100vw, 600px"
        className="absolute inset-0 h-full w-full scale-110 object-contain"
        priority
        unoptimized
      />
    </div>
  )
}

export default async function LandingPage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="landing-page min-h-screen overflow-hidden bg-white text-slate-950 selection:bg-emerald-200 selection:text-emerald-950">
      <Navbar />

      <main>
        <section className="landing-hero relative isolate">
          <div className="relative mx-auto grid max-w-7xl items-center gap-3 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:min-h-[590px] lg:grid-cols-[1.03fr_0.97fr] lg:gap-0 lg:pb-14 lg:pt-8">
            <div className="relative z-10 max-w-2xl py-5 lg:py-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Salud emocional al alcance de todos
              </span>
              <h1 className="mt-6 text-[clamp(2.5rem,4.7vw,3.9rem)] font-extrabold leading-[1.04] tracking-[-0.055em] text-slate-950">
                Contención emocional{' '}
                <span className="text-emerald-600">inmediata, 24/7</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Conectá en minutos con profesionales de la salud mental, acompañantes terapéuticos, coaches y estudiantes avanzados. Desde Santiago del Estero, para toda la región.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <Phone className="h-4 w-4" />
                  Encontrá un profesional
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-700/50 bg-white/80 px-6 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Conocé cómo funciona
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Confidencial y seguro</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-emerald-700" /> Atención desde donde estés</span>
              </div>
            </div>

            <div className="relative -mx-4 sm:mx-0">
              <PhonePreview />
            </div>
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 pb-10 sm:px-8 md:grid-cols-4 md:gap-5 lg:pb-12">
            {[
              { icon: Clock3, title: 'Conectá', detail: 'en minutos' },
              { icon: UsersRound, title: 'Profesionales', detail: 'verificados' },
              { icon: ShieldCheck, title: 'Entorno seguro', detail: 'y confidencial' },
              { icon: Sparkles, title: 'Disponible', detail: 'cuando lo necesites' },
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-center gap-3 rounded-2xl border border-emerald-50 bg-white/80 p-3 sm:justify-center sm:border-0 sm:bg-transparent sm:p-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-900 sm:text-sm">{title}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-500 sm:text-xs">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 border-y border-emerald-100/70 bg-[#f3fbf7]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Simple y cerca tuyo</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">¿Cómo funciona?</h2>
              </div>
              <Link href="/sign-up" className="hidden items-center gap-1 text-sm font-bold text-emerald-800 sm:inline-flex">
                Empezar ahora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {steps.map(({ number, icon: Icon, title, description }, index) => (
                <div key={number} className="relative flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-extrabold text-white shadow-sm shadow-emerald-900/10">
                    {number}
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-600">{description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="absolute -right-1 top-3 hidden h-4 w-4 text-slate-400 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="profesionales" className="scroll-mt-24 bg-white py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.7fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">A tu alcance</p>
              <h2 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                Profesionales para acompañarte
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                Diferentes perfiles para encontrar la escucha y el apoyo que necesitás, en cada momento.
              </p>
              <Link href="/sign-up" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950">
                Encontrá el tuyo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {specialties.map(({ icon: Icon, title, description, color }) => (
                <Link
                  key={title}
                  href="/sign-up"
                  className="group flex min-h-28 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">{title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="beneficios" className="scroll-mt-24 bg-[#f6fbf8] py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-8 max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Tu bienestar, primero</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Un espacio pensado para vos</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-emerald-100/80 bg-white p-6 shadow-sm sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="preguntas" className="scroll-mt-24 bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="mb-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Estamos para ayudarte</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Preguntas frecuentes</h2>
            </div>
            <div className="divide-y divide-slate-200">
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-900">
                  ¿Cómo encuentro un profesional?
                  <span className="text-xl font-normal text-emerald-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Creá tu cuenta y explorá perfiles por especialidad y disponibilidad para encontrar el acompañamiento adecuado para vos.</p>
              </details>
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-900">
                  ¿Puedo conectarme desde cualquier lugar?
                  <span className="text-xl font-normal text-emerald-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Sí. Podés usar Conta YA! desde tu celular o computadora y acceder a tus sesiones en línea.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="bg-emerald-800 px-5 py-10 text-center text-white sm:px-8 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Dar el primer paso puede cambiarlo todo.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-emerald-50/90">Encontrá el acompañamiento que necesitás. Estamos cerca para escucharte.</p>
            <Link href="/sign-up" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">
              Crear mi cuenta <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-5 py-7 text-center text-xs text-slate-300 sm:px-8">
        <p>© {new Date().getFullYear()} Conta YA! Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
