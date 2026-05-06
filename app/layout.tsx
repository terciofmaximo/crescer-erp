import type { Metadata } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Crescer ERP — Gestão Escolar',
  description: 'Plataforma de gestão escolar Crescer',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  )
}
