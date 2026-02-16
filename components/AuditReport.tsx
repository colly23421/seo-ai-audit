export default function AuditReport({ data }: { data: any }) {
  if (data.error) {
    return (
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-red-800">Błąd</h2>
          <p className="text-red-600">{data.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto">
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Raport Audytu</h2>
        <p className="text-gray-600 mb-4">{data.url}</p>
        <div className="text-5xl font-bold text-blue-600 mb-4">{data.overallScore} / 100</div>
        
        <div className="mt-6 p-6 bg-blue-600 rounded-xl text-white">
          <h3 className="text-2xl font-bold mb-3">Potrzebujesz pomocy?</h3>
          <a href="https://www.collytics.io/audyt-widocznosci-ai.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg">
            Zamów audyt
          </a>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">Meta Tagi</h3>
        <p>Title: {data.metaTags.title.value || 'Brak'} ({data.metaTags.title.length} znaków)</p>
        <p>Description: {data.metaTags.description.value || 'Brak'} ({data.metaTags.description.length} znaków)</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">Nagłówki</h3>
        <p>H1: {data.headings.h1.count}</p>
        <p>H2: {data.headings.h2.count}</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">JSON-LD</h3>
        <p>{data.jsonLd.found ? `Znaleziono ${data.jsonLd.count} struktur` : 'Brak struktur'}</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">FAQ</h3>
        <p>{data.faq.found ? `Znaleziono ${data.faq.count} pytań` : 'Brak FAQ'}</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">Rekomendacje</h3>
        <ul className="list-disc pl-6">
          {data.recommendations.map((rec: string, idx: number) => (
            <li key={idx} className="mb-2">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
