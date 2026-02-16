import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { input, mode, results } = req.body

  try {
    let finalResults: any

    if (mode === 'results' && results) {
      finalResults = results
      finalResults.url = 'HTML wklejony przez użytkownika'
    }
    else if ((mode === 'url' || !mode) && input) {
      const url = input
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
        maxRedirects: 5,
      })

      let html = response.data
      html = html.replace(/></g, '> <')
      html = html.replace(/<(title|meta|link|script|h1|h2|h3)/gi, '\n<$1')

      const $ = cheerio.load(html, { xml: { decodeEntities: true } })

      finalResults = {
        url,
        metaTags: analyzeMetaTags($),
        headings: analyzeHeadings($),
        jsonLd: analyzeJsonLd($),
        socialTags: analyzeSocialTags($),
        technical: await checkTechnicalSEO(url, html),
      }
      
      // FAQ analysis integration
      finalResults.faq = analyzeFaq($, finalResults.jsonLd)
    }
    else {
      return res.status(400).json({ error: 'Nieprawidłowe zapytanie' })
    }

    const overallScore = calculateOverallScore(finalResults)
    const recommendations = generateRecommendations(finalResults)

    res.status(200).json({
      ...finalResults,
      overallScore,
      recommendations,
      aiVisibility: {
        note: 'Analiza widoczności AI (Retrievability & EEAT) została uwzględniona w raporcie.',
        recommendation: 'Zamów pełny audyt na collytics.io/audyt-widocznosci-ai.html',
      },
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Błąd audytu',
      details: error.message,
    })
  }
}

function analyzeMetaTags($: cheerio.CheerioAPI) {
  const title = $('title').first().text().trim()
  const description = $('meta[name="description"]').first().attr('content')?.trim() || ''
  const canonical = $('link[rel="canonical"]').first().attr('href') || ''

  return {
    title: {
      value: title,
      length: title.length,
      status: title.length >= 30 && title.length <= 60 ? 'good' : 'warning',
      recommendation: title.length === 0 ? 'Brak tytułu strony!' : title.length < 30 ? 'Tytuł jest za krótki' : title.length > 60 ? 'Tytuł jest za długi' : 'Optymalny',
    },
    description: {
      value: description,
      length: description.length,
      status: description.length >= 120 && description.length <= 160 ? 'good' : 'warning',
      recommendation: description.length === 0 ? 'Brak meta description!' : 'Wymaga optymalizacji długości',
    },
    canonical,
  }
}

function analyzeHeadings($: cheerio.CheerioAPI) {
  const headings: any = { h1: { count: 0, values: [] }, h2: { count: 0, values: [] } }
  ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    $(tag).each((_, el) => {
      const text = $(el).text().trim()
      if (text) {
        if (!headings[tag]) headings[tag] = { count: 0, values: [] }
        headings[tag].count++
        if (headings[tag].values.length < 5) headings[tag].values.push(text)
      }
    })
  })
  return headings
}

function analyzeJsonLd($: cheerio.CheerioAPI) {
  const schemas: any[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}')
      const items = Array.isArray(data) ? data : [data]
      
      items.forEach(item => {
        const type = item['@type'] || 'Unknown'
        const issues: string[] = []
        let eeatScore = 0
        let geoScore = 0

        // E-E-A-T Analysis
        if (item.author || item.creator) eeatScore += 50
        if (item.publisher || item.brand) eeatScore += 50
        if (eeatScore < 100) issues.push(`Słabe sygnały E-E-A-T dla ${type}`)

        // GEO Analysis
        if (item.address || item.geo || item.location) geoScore = 100
        if (['LocalBusiness', 'Organization'].includes(type) && geoScore === 0) {
          issues.push(`Brak danych GEO dla ${type}`)
        }

        schemas.push({
          type,
          valid: !!item['@context'],
          eeatScore,
          geoScore,
          warnings: issues,
          data: item
        })
      })
    } catch (e) {}
  })

  return { 
    found: schemas.length > 0, 
    count: schemas.length, 
    schemas,
    hasCriticalIssues: schemas.some(s => s.warnings.length > 0)
  }
}

function analyzeFaq($: cheerio.CheerioAPI, jsonLd: any) {
  let found = false
  const items: any[] = []
  jsonLd.schemas.forEach((s: any) => {
    if (s.type === 'FAQPage' && s.data.mainEntity) {
      found = true
      s.data.mainEntity.forEach((i: any) => items.push({ q: i.name }))
    }
  })
  return { found, count: items.length }
}

function analyzeSocialTags($: cheerio.CheerioAPI) {
  return {
    openGraph: { found: $('meta[property^="og:"]').length > 0 },
    twitter: { found: $('meta[name^="twitter:"]').length > 0 }
  }
}

async function checkTechnicalSEO(url: string, html: string) {
  const isCrawlable = !html.includes('noindex') && !html.includes('disallow')
  return {
    ssl: url.startsWith('https'),
    retrievability: isCrawlable ? 'Wysoka' : 'Niska (Zablokowana przez noindex)',
    aiReadiness: html.includes('application/ld+json') ? 'Gotowy na AI Overview' : 'Brak danych strukturalnych'
  }
}

function calculateOverallScore(data: any): number {
  let score = 0
  if (data.metaTags?.title?.status === 'good') score += 20
  if (data.jsonLd?.found) score += 30
  if (data.technical?.ssl) score += 10
  if (data.technical?.retrievability === 'Wysoka') score += 20
  if (data.headings?.h1?.count === 1) score += 20
  return score
}

function generateRecommendations(data: any): string[] {
  const recs: string[] = []

  if (data.metaTags?.title?.length === 0) recs.push('🚨 KRYTYCZNE: Brak tytułu strony!')
  if (!data.jsonLd?.found) recs.push('🚨 KRYTYCZNE: Brak struktur JSON-LD (Niewidoczność dla AI Overview)')

  // Detailed JSON-LD/GEO/EEAT Recommendations
  data.jsonLd?.schemas?.forEach((s: any) => {
    s.warnings.forEach((w: string) => recs.push(`⚠️ ${w}`))
  })

  if (data.technical?.retrievability !== 'Wysoka') recs.push('🚨 Retrievability: Strona blokuje roboty indeksujące!')

  // Personalizowane CTA sprzedażowe
  recs.push('💎 Twoja strona wymaga profesjonalnego wdrożenia E-E-A-T i GEO pod Google AI.')
  recs.push('🎯 Zamów pełny audyt i pakiet optymalizacji na: https://www.collytics.io/audyt-widocznosci-ai.html')

  return recs
}
