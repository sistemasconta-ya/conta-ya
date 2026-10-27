import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conta YA! - Plataforma de Salud Mental",
  description: "Conectando pacientes y profesionales de la salud mental en tiempo real.",
};

const customSpanish = {
  ...esES,
  signIn: {
    ...esES.signIn,
    start: {
      ...esES.signIn?.start,
      actionText: "¿Aún no tenés cuenta?",
      actionLink: "Registrarme",
    },
  },
  signUp: {
    ...esES.signUp,
    start: {
      ...esES.signUp?.start,
      actionText: "¿Ya tenés cuenta?",
      actionLink: "Iniciar sesión",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={customSpanish}
      appearance={{
        variables: {
          colorPrimary: "var(--primary)",
          colorBackground: "var(--surface)",
          colorNeutral: "var(--foreground)",
          borderRadius: "1rem",
        },
        elements: {
          formFieldInput: "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-800",
        },
      }}
    >
      <html lang="es">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}