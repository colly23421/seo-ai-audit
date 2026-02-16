import { useState } from 'react'

interface AuditFormProps {
  onSubmit: (url: string) => void
  loading: boolean
}

export default function AuditForm({ onSubmit, loading }: AuditFormProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Proszę wprowadzić adres URL')
      return
    }

    const urlToCheck = url.startsWith('http') ? url : `https://${url}`

    if (!validateUrl(urlToCheck)) {
      setError('Proszę wprowadzić prawidłowy adres URL')
      return
    }

    onSubmit(urlToCheck)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Adres URL strony do audytu
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="np. example.com lub https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
              disabled={loading}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Analizuję...' : 'Rozpocznij audyt'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Co sprawdzamy:</strong> JSON-LD Schema, meta tagi (title, description), 
            strukturę nagłówków H1-H6, FAQ, dane Open Graph, Twitter Cards i wiele więcej!
          </p>
        </div>
      </div>
    </div>
  )
}
