import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audyt SEO & Widoczność w AI | Collytics',
  description: 'Sprawdź widoczność Twojej strony w SEO i chatach AI. Kompleksowy audyt struktury JSON-LD, meta tagów, nagłówków i wizytówki Google.',
  keywords: 'audyt SEO, widoczność AI, JSON-LD, schema markup, Google Business Profile',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
