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

  console.log('=== AUDIT REQUEST ===')
  console.log('Mode:', mode)
  console.log('Has results:', !!results)

  try {
    let finalResults: any

    // TRYB 1: Otrzymaliśmy już przeanalizowane wyniki z frontendu (HTML paste mode)
    if (mode === 'results' && results) {
      console.log('Using pre-analyzed results from client')
      finalResults = results
      finalResults.url = 'HTML wklejony przez użytkownika'
    }
    // TRYB 2: URL mode - pobierz i analizuj na backendzie
    else if (mode === 'url' && input) {
      console.log('URL mode - fetching:', input)
      const url = input

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
        maxRedirects: 5,
      })

      let html = response.data
      
      // Normalizacja HTML
      html = html.replace(/></g, '> <')
      html = html.replace(/<(title|meta|link|script|h1|h2|h3)/gi, '\n<$1')

      const $ = cheerio.load(html, {
        
        xml: { decodeEntities: true }
      })

      // Analiza
      const metaTags = analyzeMetaTags($)
      const headings = analyzeHeadings($)
      const jsonLd = analyzeJsonLd($)
      const faq = analyzeFaq($, jsonLd)
      const socialTags = analyzeSocialTags($)
      const technical = await checkTechnicalSEO(url)

      finalResults = {
        url,
        metaTags,
        headings,
        jsonLd,
        faq,
        socialTags,
        technical,
      }
    }
    // TRYB 3: Fallback - stary tryb (dla kompatybilności)
    else if (req.body.url) {
      console.log('Legacy URL mode')
      const url = req.body.url

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)',
        },
        timeout: 15000,
        maxRedirects: 5,
      })

      let html = response.data
      html = html.replace(/></g, '> <')
      
      const $ = cheerio.load(html)

      const metaTags = analyzeMetaTags($)
      const headings = analyzeHeadings($)
      const jsonLd = analyzeJsonLd($)
      const faq = analyzeFaq($, jsonLd)
      const socialTags = analyzeSocialTags($)
      const technical = await checkTechnicalSEO(url)

      finalResults = {
        url,
        metaTags,
        headings,
        jsonLd,
        faq,
        socialTags,
        technical,
      }
    }
    else {
      return res.status(400).json({ 
        error: 'Invalid request - missing input, mode, or results' 
      })
    }

    // Oblicz wynik i rekomendacje
    const overallScore = calculateOverallScore(finalResults)
    const recommendations = generateRecommendations(finalResults)

    console.log('=== AUDIT SUCCESS ===')
    console.log('Score:', overallScore)

    res.status(200).json({
      ...finalResults,
      overallScore,
      recommendations,
      aiVisibility: {
        note: 'Sprawdzanie widoczności w Google AI Overview wymaga dedykowanego API',
        recommendation: 'Zamów pełny audyt na collytics.io/audyt-widocznosci-ai.html',
      },
    })
  } catch (error: any) {
    console.error('=== AUDIT ERROR ===')
    console.error('Error:', error.message)
    
    res.status(500).json({
      error: 'Nie udało się przeanalizować strony. Sprawdź, czy URL jest poprawny i dostępny.',
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
      recommendation:
        title.length === 0
          ? 'KRYTYCZNE: Brak tytułu strony!'
          : title.length < 30
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
        description.length === 0
          ? 'KRYTYCZNE: Brak meta description!'
          : description.length < 120
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
    h1: { count: 0, values: [] as string[] },
    h2: { count: 0, values: [] as string[] },
    h3: { count: 0, values: [] as string[] },
    h4: { count: 0, values: [] as string[] },
    h5: { count: 0, values: [] as string[] },
    h6: { count: 0, values: [] as string[] },
  }

  ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    $(tag).each((_, el) => {
      const text = $(el).text().trim()
      if (text) {
        headings[tag].count++
        if (headings[tag].values.length < 5) {
          headings[tag].values.push(text)
        }
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
        const schemas = Array.isArray(data) ? data : [data]
        
        schemas.forEach((schemaData) => {
          const schema: any = {
            type: schemaData['@type'] || 'Unknown',
            valid: true,
            errors: [] as string[],
            warnings: [] as string[],
            missingFields: [] as string[],
            data: schemaData,
          }

          // Walidacja podstawowa
          if (!schemaData['@context']) {
            schema.valid = false
            schema.errors.push('Brak wymaganego pola @context')
          }
          if (!schemaData['@type']) {
            schema.valid = false
            schema.errors.push('Brak wymaganego pola @type')
          }

          // Szczegółowa walidacja według typu
          const type = schemaData['@type']

          if (type === 'Organization' || type === 'LocalBusiness') {
            if (!schemaData.name) schema.missingFields.push('name (nazwa firmy)')
            if (!schemaData.url) schema.missingFields.push('url (adres strony)')
            if (!schemaData.logo) schema.warnings.push('Brak logo - zalecane dla lepszej widoczności')
            if (!schemaData.address) schema.missingFields.push('address (adres fizyczny)')
            if (!schemaData.telephone) schema.warnings.push('Brak numeru telefonu')
            if (!schemaData.email) schema.warnings.push('Brak adresu email')
            if (!schemaData.sameAs) schema.warnings.push('Brak linków do social media (sameAs)')
            
            if (type === 'LocalBusiness' && !schemaData.geo) {
              schema.warnings.push('Brak współrzędnych GPS (geo) - ważne dla lokalnego SEO')
            }
            if (type === 'LocalBusiness' && !schemaData.openingHours) {
              schema.warnings.push('Brak godzin otwarcia (openingHours)')
            }
          }

          if (type === 'WebSite') {
            if (!schemaData.name) schema.missingFields.push('name')
            if (!schemaData.url) schema.missingFields.push('url')
            if (!schemaData.potentialAction) {
              schema.warnings.push('Brak SearchAction - strona nie będzie miała search box w Google')
            }
          }

          if (type === 'Product') {
            if (!schemaData.name) schema.missingFields.push('name (nazwa produktu)')
            if (!schemaData.image) schema.missingFields.push('image (zdjęcie produktu)')
            if (!schemaData.description) schema.missingFields.push('description')
            if (!schemaData.offers) {
              schema.errors.push('Brak offers - wymagane dla produktów e-commerce!')
            } else {
              const offer = schemaData.offers
              if (!offer.price) schema.missingFields.push('offers.price (cena)')
              if (!offer.priceCurrency) schema.missingFields.push('offers.priceCurrency (PLN/EUR)')
              if (!offer.availability) schema.warnings.push('Brak availability (dostępność)')
            }
            if (!schemaData.brand) schema.warnings.push('Brak brand - zalecane')
            if (!schemaData.sku) schema.warnings.push('Brak SKU produktu')
            if (!schemaData.aggregateRating) schema.warnings.push('Brak ocen klientów (aggregateRating)')
          }

          if (type === 'FAQPage') {
            if (!schemaData.mainEntity || schemaData.mainEntity.length === 0) {
              schema.errors.push('FAQPage bez pytań (mainEntity)')
            } else {
              schema.warnings.push(`Znaleziono ${schemaData.mainEntity.length} pytań w FAQ`)
            }
          }

          if (type === 'Article' || type === 'BlogPosting') {
            if (!schemaData.headline) schema.missingFields.push('headline (tytuł)')
            if (!schemaData.author) schema.missingFields.push('author (autor)')
            if (!schemaData.datePublished) schema.missingFields.push('datePublished (data publikacji)')
            if (!schemaData.image) schema.warnings.push('Brak obrazka głównego')
            if (!schemaData.publisher) schema.warnings.push('Brak informacji o wydawcy')
          }

          if (type === 'BreadcrumbList') {
            if (!schemaData.itemListElement || schemaData.itemListElement.length === 0) {
              schema.errors.push('BreadcrumbList bez elementów')
            }
          }

          // Oceń severity
          if (schema.errors.length > 0) {
            schema.valid = false
            schema.severity = 'critical'
          } else if (schema.missingFields.length > 2) {
            schema.severity = 'warning'
          } else if (schema.warnings.length > 0) {
            schema.severity = 'info'
          } else {
            schema.severity = 'good'
          }

          jsonLdScripts.push(schema)
          found = true
        })
      } catch (e) {
        jsonLdScripts.push({
          type: 'Invalid',
          valid: false,
          errors: ['Nieprawidłowy format JSON - nie można sparsować'],
          warnings: [] as string[],
          missingFields: [] as string[],
          severity: 'critical',
          data: content?.substring(0, 200) + '...',
        })
      }
    }
  })

  return {
    found,
    count: jsonLdScripts.length,
    schemas: jsonLdScripts,
    hasErrors: jsonLdScripts.some(s => s.errors.length > 0),
    hasCriticalIssues: jsonLdScripts.some(s => s.severity === 'critical'),
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
    ]

    faqSelectors.forEach((selector) => {
      $(selector).find('dt, .question, [class*="question"]').each((_, el) => {
        const question = $(el).text().trim()
        const answer = $(el).next().text().trim()
        
        if (question && answer && items.length < 10) {
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

async function checkTechnicalSEO(url: string) {
  const urlObj = new URL(url)
  const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`
  const technical: any = {
    robotsTxt: { found: false, url: '', allows: true },
    sitemap: { found: false, url: '' },
    ssl: urlObj.protocol === 'https:',
  }

  // Check robots.txt
  try {
    const robotsResponse = await axios.get(`${baseUrl}/robots.txt`, {
      timeout: 5000,
      validateStatus: (status) => status < 500,
    })
    if (robotsResponse.status === 200) {
      technical.robotsTxt.found = true
      technical.robotsTxt.url = `${baseUrl}/robots.txt`
      const robotsContent = robotsResponse.data
      
      if (robotsContent.includes('Disallow: /')) {
        technical.robotsTxt.allows = false
      }
      
      const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i)
      if (sitemapMatch) {
        technical.sitemap.found = true
        technical.sitemap.url = sitemapMatch[1].trim()
      }
    }
  } catch (e) {
    // robots.txt doesn't exist
  }

  // Check sitemap.xml
  if (!technical.sitemap.found) {
    try {
      const sitemapResponse = await axios.get(`${baseUrl}/sitemap.xml`, {
        timeout: 5000,
        validateStatus: (status) => status < 500,
      })
      if (sitemapResponse.status === 200) {
        technical.sitemap.found = true
        technical.sitemap.url = `${baseUrl}/sitemap.xml`
      }
    } catch (e) {
      // sitemap doesn't exist
    }
  }

  return technical
}

function calculateOverallScore(data: any): number {
  let score = 0
  let maxScore = 100

  // Meta tagi (30 punktów)
  if (data.metaTags?.title?.status === 'good') score += 15
  else if (data.metaTags?.title?.value) score += 8
  
  if (data.metaTags?.description?.status === 'good') score += 15
  else if (data.metaTags?.description?.value) score += 8

  // Nagłówki (20 punktów)
  if (data.headings?.h1?.count === 1) score += 10
  else if (data.headings?.h1?.count > 0) score += 5
  
  if (data.headings?.h2?.count > 0) score += 10

  // JSON-LD (25 punktów)
  if (data.jsonLd?.found) {
    score += 10
    const validSchemas = data.jsonLd.schemas.filter((s: any) => s.valid).length
    score += Math.min(15, validSchemas * 8)
  }

  // FAQ (10 punktów)
  if (data.faq?.found) score += 10

  // Social tags (15 punktów)
  if (data.socialTags?.openGraph?.found) score += 8
  if (data.socialTags?.twitter?.found) score += 7

  return Math.round(score)
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = []

  // Meta tagi
  if (data.metaTags?.title?.length === 0) {
    recommendations.push('🚨 KRYTYCZNE: Dodaj tytuł strony (tag <title>)')
  } else if (data.metaTags?.title?.status !== 'good') {
    recommendations.push(`⚠️ ${data.metaTags.title.recommendation}`)
  }

  if (data.metaTags?.description?.length === 0) {
    recommendations.push('🚨 KRYTYCZNE: Dodaj meta description')
  } else if (data.metaTags?.description?.status !== 'good') {
    recommendations.push(`⚠️ ${data.metaTags.description.recommendation}`)
  }

  // Nagłówki
  if (data.headings?.h1?.count === 0) {
    recommendations.push('🚨 Dodaj nagłówek H1 na stronie')
  } else if (data.headings?.h1?.count > 1) {
    recommendations.push(`⚠️ Użyj tylko jednego H1 (obecnie: ${data.headings.h1.count})`)
  }

  // JSON-LD
  if (!data.jsonLd?.found) {
    recommendations.push(
      '🚨 Brak struktur JSON-LD! Dodaj Schema.org markup dla lepszej widoczności w Google i AI'
    )
  } else if (data.jsonLd?.hasCriticalIssues) {
    recommendations.push('🚨 Krytyczne błędy w JSON-LD - sprawdź szczegóły')
  }

  // FAQ
  if (!data.faq?.found) {
    recommendations.push('💡 Dodaj sekcję FAQ ze schema markup FAQPage')
  }

  // Social
  if (!data.socialTags?.openGraph?.found) {
    recommendations.push('💡 Dodaj tagi Open Graph')
  }

  // Technical
  if (data.technical && !data.technical.ssl) {
    recommendations.push('🚨 KRYTYCZNE: Włącz HTTPS!')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Świetna robota! Strona dobrze zoptymalizowana.')
  }

  recommendations.push('🎯 Zamów pełny audyt na collytics.io/audyt-widocznosci-ai.html')

  return recommendations
}
