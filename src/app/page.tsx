import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import { Shield, Video, Calendar, ArrowRight } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const { userId } = await auth()

  // Si el usuario ya inició sesión, lo redirigimos al dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-900 selection:text-white">
      {/* Header Responsivo con Auth de Clerk */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50 to-slate-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-8 tracking-wide uppercase shadow-sm">
            <Shield className="w-3.5 h-3.5 text-emerald-800" /> Sesiones 100% confidenciales y seguras
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-8 leading-[1.1] text-slate-900">
            Tu bienestar mental, <br />
            <span className="bg-gradient-to-r from-emerald-800 to-emerald-950 bg-clip-text text-transparent">
              a un solo clic de distancia.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-normal">
            Conectamos profesionales de la salud mental con pacientes mediante una plataforma segura, reservas instantáneas y pagos protegidos en garantía.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.02]"
            >
              Encontrar un terapeuta <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-up?role=professional"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              Soy profesional
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="como-funciona" className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Diseñado para tu total tranquilidad</h2>
            <p className="text-slate-500">Un ecosistema pensado para eliminar fricciones y cuidar cada detalle de tu terapia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm transition-all hover:border-slate-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Búsqueda y Reserva Rápida</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Filtra especialistas por disponibilidad, especialidad y arancel. Reserva tu turno de forma inmediata en el horario que mejor se adapte a ti.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm transition-all hover:border-slate-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Pagos en Escrow Protegidos</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tu dinero queda resguardado de forma segura hasta que la sesión se complete con éxito, garantizando confianza tanto para pacientes como profesionales.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm transition-all hover:border-slate-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Videollamada Integrada</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Accede a tu sala de consulta virtual de alta calidad directamente desde el navegador, sin necesidad de instalar aplicaciones externas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Conta YA! Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}