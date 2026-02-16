'use client'

import { useState } from 'react'
import AuditForm from '@/components/AuditForm'
import AuditReport from '@/components/AuditReport'

export default function Home() {
  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAudit = async (url: string) => {
    setLoading(true)
    setAuditData(null)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setAuditData(data)
    } catch (error) {
      console.error('Błąd podczas audytu:', error)
      setAuditData({ error: 'Wystąpił błąd podczas analizy strony' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Audyt SEO & Widoczność w AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sprawdź, jak Twoja strona jest zoptymalizowana pod kątem SEO i widoczności w chatach AI. 
            Analiza JSON-LD, meta tagów, struktury nagłówków i wizytówki Google.
          </p>
        </div>

        <AuditForm onSubmit={handleAudit} loading={loading} />

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Analizuję stronę...</p>
          </div>
        )}

        {auditData && !loading && <AuditReport data={auditData} />}
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>
          Powered by{' '}
          <a
            href="https://www.collytics.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Collytics.io
          </a>
        </p>
      </footer>
    </main>
  )
}
