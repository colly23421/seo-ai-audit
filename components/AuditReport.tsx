interface AuditReportProps {
  data: any
}

export default function AuditReport({ data }: AuditReportProps) {
  if (data.error) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Błąd</h2>
          <p className="text-red-600">{data.error}</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Raport Audytu</h2>
            <p className="text-gray-600">{data.url}</p>
          </div>
          <div className={`text-center p-6 rounded-xl ${getScoreBg(data.overallScore)}`}>
            <div className={`text-5xl font-bold ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}
            </div>
            <div className="text-sm text-gray-600 mt-1">/ 100</div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
          <h3 className="text-2xl font-bold mb-3">🚀 Potrzebujesz pomocy?</h3>
          <p className="mb-4 text-blue-100">
            Zamów pełny audyt widoczności w AI i otrzymaj szczegółowy raport z rekomendacjami 
            od ekspertów Collytics!
          </p>
          
            href="https://www.collytics.io/audyt-widocznosci-ai.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition transform hover:scale-105"
          >
            Zamów profesjonalny audyt →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">📄</span> Meta Tagi
        </h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-700">Title</h4>
              <StatusBadge status={data.metaTags.title.status} />
            </div>
            <p className="text-gray-900 font-medium">{data.metaTags.title.value || 'Brak'}</p>
            <p className="text-sm text-gray-500 mt-1">
              Długość: {data.metaTags.title.length} znaków 
              {data.metaTags.title.recommendation && ` - ${data.metaTags.title.recommendation}`}
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-700">Meta Description</h4>
              <StatusBadge status={data.metaTags.description.status} />
            </div>
            <p className="text-gray-900">{data.metaTags.description.value || 'Brak'}</p>
            <p className="text-sm text-gray-500 mt-1">
              Długość: {data.metaTags.description.length} znaków
              {data.metaTags.description.recommendation && ` - ${data.metaTags.description.recommendation}`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">💡</span> Rekomendacje
        </h3>
        
        <ul className="space-y-3">
          {data.recommendations.map((rec: string, idx: number) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-blue-600 font-bold">•</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  }

  const labels = {
    good: '✓ Dobry',
    warning: '⚠ Wymaga poprawy',
    error: '✗ Błąd',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.warning}`}>
      {labels[status as keyof typeof labels] || 'Nieznany'}
    </span>
  )
}
