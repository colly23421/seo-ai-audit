'use client'

import { useState } from 'react'

interface AuditFormProps {
  onSubmit: (input: string, mode: 'url' | 'html') => void
  loading: boolean
}

export default function AuditForm({ onSubmit, loading }: AuditFormProps) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'url' | 'html'>('url')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim(), mode)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                mode === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔗 Podaj URL strony
            </button>
            <button
              type="button"
              onClick={() => setMode('html')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                mode === 'html'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📄 Wklej kod HTML
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'url' ? (
            <div className="mb-6">
              <label htmlFor="url" className="block text-gray-700 font-semibold mb-2">
                Adres URL strony do audytu
              </label>
              <input
                type="url"
                id="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Wpisz pełny adres URL strony, którą chcesz przeanalizować
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label htmlFor="html" className="block text-gray-700 font-semibold mb-2">
                Kod źródłowy HTML strony
              </label>
              <textarea
                id="html"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Wklej tutaj cały kod HTML strony (Ctrl+U na stronie → Kopiuj wszystko)"
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
                disabled={loading}
              />
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  💡 Jak pobrać kod źródłowy strony:
                </p>
                <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                  <li>Wejdź na stronę, którą chcesz przeanalizować</li>
                  <li>Naciśnij <kbd className="px-2 py-1 bg-white rounded">Ctrl+U</kbd> (Windows) lub <kbd className="px-2 py-1 bg-white rounded">Cmd+Option+U</kbd> (Mac)</li>
                  <li>Zaznacz wszystko (<kbd className="px-2 py-1 bg-white rounded">Ctrl+A</kbd>) i skopiuj (<kbd className="px-2 py-1 bg-white rounded">Ctrl+C</kbd>)</li>
                  <li>Wklej tutaj i kliknij &quot;Rozpocznij audyt&quot;</li>
                </ol>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Analizuję...' : 'Rozpocznij audyt'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Wskazówka:</strong> Tryb &quot;Wklej kod HTML&quot; działa zawsze i daje najbardziej
            dokładne wyniki, ponieważ analizuje dokładnie to, co widzisz w przeglądarce.
          </p>
        </div>
      </div>
    </div>
  )
}
