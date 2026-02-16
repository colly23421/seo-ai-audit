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

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    // Pobierz HTML strony
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)',
      },
      timeout: 15000,
      maxRedirects: 5,
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Analiza meta tagów
    const metaTags = analyzeMetaTags($)

    // Analiza nagłówków
    const headings = analyzeHeadings($)

    // Analiza JSON-LD
    const jsonLd = analyzeJsonLd($)

    // Analiza FAQ
    const faq = analyzeFaq($, jsonLd)

    // Analiza tagów social media
    const socialTags = analyzeSocialTags($)

    // Oblicz ogólny wynik
    const overallScore = calculateOverallScore({
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
    })

    // Generuj rekomendacje
    const recommendations = generateRecommendations({
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
    })

    res.status(200).json({
      url,
      overallScore,
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
      recommendations,
    })
  } catch (error: any) {
    console.error('Audit error:', error)
    res.status(500).json({
      error: 'Nie udało się przeanalizować strony. Sprawdź, czy URL jest poprawny i dostępny.',
    })
  }
}

function analyzeMetaTags($: cheerio.CheerioAPI) {
  const title = $('title').text().trim()
  const description = $('meta[name="description"]').attr('content') || ''
  const canonical = $('link[rel="canonical"]').attr('href') || ''

  return {
    title: {
      value: title,
      length: title.length,
      status: title.length >= 30 && title.length <= 60 ? 'good' : 'warning',
      recommendation:
        title.length < 30
          ? 'Tytuł jest za krótki (min 30 znaków)'
          : title.length > 60
          ? 'Tytuł jest za długi (max 60 znaków)'
          : 'Długość tytułu jest optymalna',
    },
    description: {
      value: description,
      length: description.length,
      status:
        description.length >= 120 && description.length <= 160
          ? 'good'
          : 'warning',
      recommendation:
        description.length < 120
          ? 'Description jest za krótki (min 120 znaków)'
          : description.length > 160
          ? 'Description jest za długi (max 160 znaków)'
          : 'Długość description jest optymalna',
    },
    canonical,
  }
}

function analyzeHeadings($: cheerio.CheerioAPI) {
  const headings: any = {
    h1: { count: 0, values: [] },
    h2: { count: 0, values: [] },
    h3: { count: 0, values: [] },
    h4: { count: 0, values: [] },
    h5: { count: 0, values: [] },
    h6: { count: 0, values: [] },
  }

  ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    $(tag).each((_, el) => {
      const text = $(el).text().trim()
      if (text) {
        headings[tag].count++
        headings[tag].values.push(text)
      }
    })
  })

  return headings
}

function analyzeJsonLd($: cheerio.CheerioAPI) {
  const jsonLdScripts: any[] = []
  let found = false

  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html()
    if (content) {
      try {
        const data = JSON.parse(content)
        const schema = {
          type: data['@type'] || (Array.isArray(data) ? data[0]['@type'] : 'Unknown'),
          valid: true,
          errors: [] as string[],
          data,
        }

        // Podstawowa walidacja
        if (!data['@context']) {
          schema.valid = false
          schema.errors.push('Brak @context')
        }
        if (!data['@type']) {
          schema.valid = false
          schema.errors.push('Brak @type')
        }

        jsonLdScripts.push(schema)
        found = true
      } catch (e) {
        jsonLdScripts.push({
          type: 'Invalid',
          valid: false,
          errors: ['Nieprawidłowy format JSON'],
          data: content,
        })
      }
    }
  })

  return {
    found,
    count: jsonLdScripts.length,
    schemas: jsonLdScripts,
  }
}

function analyzeFaq($: cheerio.CheerioAPI, jsonLd: any) {
  let found = false
  let count = 0
  const items: any[] = []

  // Sprawdź FAQ w JSON-LD
  jsonLd.schemas.forEach((schema: any) => {
    if (schema.type === 'FAQPage' && schema.data.mainEntity) {
      found = true
      schema.data.mainEntity.forEach((item: any) => {
        if (item['@type'] === 'Question') {
          count++
          items.push({
            question: item.name || '',
            answer: item.acceptedAnswer?.text || '',
          })
        }
      })
    }
  })

  // Jeśli nie ma w JSON-LD, szukaj w HTML
  if (!found) {
    const faqSelectors = [
      '.faq',
      '#faq',
      '[class*="faq"]',
      '[id*="faq"]',
      'section:has(h2:contains("FAQ"))',
      'section:has(h2:contains("Pytania"))',
    ]

    faqSelectors.forEach((selector) => {
      $(selector).find('dt, .question, [class*="question"]').each((_, el) => {
        const question = $(el).text().trim()
        const answer = $(el).next().text().trim()
        
        if (question && answer) {
          found = true
          count++
          items.push({ question, answer })
        }
      })
    })
  }

  return { found, count, items }
}

function analyzeSocialTags($: cheerio.CheerioAPI) {
  return {
    openGraph: {
      found: $('meta[property^="og:"]').length > 0,
      title: $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      url: $('meta[property="og:url"]').attr('content') || '',
    },
    twitter: {
      found: $('meta[name^="twitter:"]').length > 0,
      card: $('meta[name="twitter:card"]').attr('content') || '',
      title: $('meta[name="twitter:title"]').attr('content') || '',
      description: $('meta[name="twitter:description"]').attr('content') || '',
      image: $('meta[name="twitter:image"]').attr('content') || '',
    },
  }
}

function calculateOverallScore(data: any): number {
  let score = 0
  let maxScore = 0

  // Meta tagi (30 punktów)
  maxScore += 30
  if (data.metaTags.title.status === 'good') score += 15
  else if (data.metaTags.title.value) score += 8
  
  if (data.metaTags.description.status === 'good') score += 15
  else if (data.metaTags.description.value) score += 8

  // Nagłówki (20 punktów)
  maxScore += 20
  if (data.headings.h1.count === 1) score += 10
  else if (data.headings.h1.count > 0) score += 5
  
  if (data.headings.h2.count > 0) score += 10

  // JSON-LD (25 punktów)
  maxScore += 25
  if (data.jsonLd.found) {
    score += 15
    const validSchemas = data.jsonLd.schemas.filter((s: any) => s.valid).length
    score += Math.min(10, validSchemas * 5)
  }

  // FAQ (10 punktów)
  maxScore += 10
  if (data.faq.found) score += 10

  // Social tags (15 punktów)
  maxScore += 15
  if (data.socialTags.openGraph.found) score += 8
  if (data.socialTags.twitter.found) score += 7

  return Math.round((score / maxScore) * 100)
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = []

  if (data.metaTags.title.status !== 'good') {
    recommendations.push(
      `Popraw tytuł strony: ${data.metaTags.title.recommendation}`
    )
  }

  if (data.metaTags.description.status !== 'good') {
    recommendations.push(
      `Popraw meta description: ${data.metaTags.description.recommendation}`
    )
  }

  if (data.headings.h1.count === 0) {
    recommendations.push('Dodaj nagłówek H1 na stronie')
  } else if (data.headings.h1.count > 1) {
    recommendations.push(
      'Użyj tylko jednego nagłówka H1 na stronie (obecnie: ' +
        data.headings.h1.count +
        ')'
    )
  }

  if (!data.jsonLd.found) {
    recommendations.push(
      'Dodaj struktury JSON-LD (Schema.org) aby poprawić widoczność w wyszukiwarkach i AI'
    )
  } else {
    const invalidSchemas = data.jsonLd.schemas.filter((s: any) => !s.valid)
    if (invalidSchemas.length > 0) {
      recommendations.push(
        'Napraw błędy w strukturach JSON-LD - znaleziono ' +
          invalidSchemas.length +
          ' nieprawidłowych'
      )
    }
  }

  if (!data.faq.found) {
    recommendations.push(
      'Dodaj sekcję FAQ ze schema markup FAQPage aby zwiększyć widoczność w Google i chatach AI'
    )
  }

  if (!data.socialTags.openGraph.found) {
    recommendations.push(
      'Dodaj tagi Open Graph dla lepszego wyświetlania w mediach społecznościowych'
    )
  }

  if (!data.socialTags.twitter.found) {
    recommendations.push('Dodaj Twitter Card meta tagi')
  }

  if (!data.metaTags.canonical) {
    recommendations.push(
      'Dodaj canonical URL aby uniknąć problemów z duplikacją treści'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Świetna robota! Twoja strona jest dobrze zoptymalizowana. Rozważ regularne audyty aby utrzymać wysoki standard.'
    )
  }

  return recommendations
}
