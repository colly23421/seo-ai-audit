'use client'

import { useState } from 'react'
import AuditForm from '../components/AuditForm'
import AuditReport from '../components/AuditReport'
import { analyzeHTML } from '../lib/analyzer'

export default function Home() {
  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

const handleAudit = async (input: string, mode: 'url' | 'html') => {
  setLoading(true)
  setAuditData(null)

  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, mode }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      setAuditData({
        error: data.error || 'Wystąpił błąd podczas audytu',
        details: data.details || '',
      })
    } else {
      setAuditData(data)
    }
  } catch (error: any) {
    console.error('Audit error:', error)
    setAuditData({
      error: 'Wystąpił błąd podczas audytu. Spróbuj ponownie.',
      details: error.message,
    })
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Audyt SEO & Widoczność w AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sprawdź, jak Twoja strona jest widziana przez wyszukiwarki i sztuczną inteligencję
            (ChatGPT, Claude, Gemini). Uzyskaj szczegółowy raport z rekomendacjami.
          </p>
        </div>

        <AuditForm onSubmit={handleAudit} loading={loading} />

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analizuję stronę...</p>
          </div>
        )}

        {auditData && <AuditReport data={auditData} />}
      </div>
    </main>
  )
}
