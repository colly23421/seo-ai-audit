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
    // Pobierz HTML strony z lepszymi headerami
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      timeout: 15000,
      maxRedirects: 5,
      decompress: true,
    })

    let html = response.data

    // Normalizacja zminifikowanego HTML - KLUCZOWE dla stron bez białych znaków!
    if (typeof html === 'string') {
      // Dodaj białe znaki między tagami
      html = html.replace(/></g, '> <')
      // Dodaj nowe linie przed głównymi tagami
      html = html.replace(/<(title|meta|link|script|h1|h2|h3|h4|h5|h6)/gi, '\n<$1')
    }

    // Load z odpowiednimi opcjami
    const $ = cheerio.load(html, {
      normalizeWhitespace: false,
      decodeEntities: true,
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
    })

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

    // Analiza techniczna
    const technical = await checkTechnicalSEO(url)

    // Oblicz ogólny wynik
    const overallScore = calculateOverallScore({
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
      technical,
    })

    // Generuj rekomendacje
    const recommendations = generateRecommendations({
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
      technical,
    })

    res.status(200).json({
      url,
      overallScore,
      metaTags,
      headings,
      jsonLd,
      faq,
      socialTags,
      technical,
      recommendations,
      aiVisibility: {
        note: 'Sprawdzanie widoczności w Google AI Overview wymaga dedykowanego API',
        recommendation: 'Zamów pełny audyt na collytics.io/audyt-widocznosci-ai.html aby sprawdzić widoczność w ChatGPT, Claude i Gemini',
      },
    })
  } catch (error: any) {
    console.error('Audit error:', error)
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
      'section:has(h2:contains("FAQ"))',
      'section:has(h2:contains("Pytania"))',
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
    robotsTxt: { found: false, url: '', allows: true, issues: [] as string[] },
    sitemap: { found: false, url: '', issues: [] as string[] },
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
        technical.robotsTxt.issues.push('Blokuje indeksowanie całej strony (Disallow: /)')
      }
      
      const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i)
      if (sitemapMatch) {
        technical.sitemap.found = true
        technical.sitemap.url = sitemapMatch[1].trim()
      }
    }
  } catch (e) {
    technical.robotsTxt.issues.push('Plik robots.txt nie istnieje')
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
      technical.sitemap.issues.push('Plik sitemap.xml nie istnieje')
    }
  }

  return technical
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
    score += 10
    const validSchemas = data.jsonLd.schemas.filter((s: any) => s.valid).length
    const schemasWithMinimalIssues = data.jsonLd.schemas.filter(
      (s: any) => s.valid && s.missingFields.length <= 2
    ).length
    score += Math.min(15, schemasWithMinimalIssues * 8)
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

  // Meta tagi
  if (data.metaTags.title.length === 0) {
    recommendations.push('🚨 KRYTYCZNE: Dodaj tytuł strony (tag <title>)')
  } else if (data.metaTags.title.status !== 'good') {
    recommendations.push(`⚠️ ${data.metaTags.title.recommendation}`)
  }

  if (data.metaTags.description.length === 0) {
    recommendations.push('🚨 KRYTYCZNE: Dodaj meta description')
  } else if (data.metaTags.description.status !== 'good') {
    recommendations.push(`⚠️ ${data.metaTags.description.recommendation}`)
  }

  // Nagłówki
  if (data.headings.h1.count === 0) {
    recommendations.push('🚨 Dodaj nagłówek H1 na stronie - to podstawa SEO!')
  } else if (data.headings.h1.count > 1) {
    recommendations.push(
      `⚠️ Użyj tylko jednego H1 na stronie (obecnie: ${data.headings.h1.count})`
    )
  }

  if (data.headings.h2.count === 0) {
    recommendations.push('💡 Dodaj nagłówki H2 dla lepszej struktury treści')
  }

  // JSON-LD
  if (!data.jsonLd.found) {
    recommendations.push(
      '🚨 Brak struktur JSON-LD! Dodaj Schema.org markup dla lepszej widoczności w Google i AI (ChatGPT, Claude, Gemini)'
    )
  } else {
    if (data.jsonLd.hasCriticalIssues) {
      recommendations.push(
        '🚨 Krytyczne błędy w JSON-LD - sprawdź szczegóły poniżej i popraw składnię'
      )
    }
    
    const schemasWithIssues = data.jsonLd.schemas.filter(
      (s: any) => s.missingFields.length > 0 || s.warnings.length > 0
    )
    
    if (schemasWithIssues.length > 0) {
      schemasWithIssues.forEach((schema: any) => {
        if (schema.missingFields.length > 0) {
          const fields = schema.missingFields.slice(0, 3).join(', ')
          recommendations.push(
            `⚠️ ${schema.type}: Uzupełnij brakujące pola - ${fields}${schema.missingFields.length > 3 ? ' i więcej' : ''}`
          )
        }
      })
    }
  }

  // FAQ
  if (!data.faq.found) {
    recommendations.push(
      '💡 Dodaj sekcję FAQ ze schema markup FAQPage - zwiększysz widoczność w Google i chatach AI o 300%!'
    )
  }

  // Social Media
  if (!data.socialTags.openGraph.found) {
    recommendations.push(
      '💡 Dodaj tagi Open Graph - Twoje linki będą lepiej wyglądać na Facebooku/LinkedIn'
    )
  }

  if (!data.socialTags.twitter.found) {
    recommendations.push('💡 Dodaj Twitter Card meta tagi dla lepszego wyglądu na X (Twitter)')
  }

  // Canonical
  if (!data.metaTags.canonical) {
    recommendations.push(
      '⚠️ Dodaj canonical URL aby uniknąć problemów z duplikacją treści'
    )
  }

  // Technical SEO
  if (data.technical) {
    if (!data.technical.ssl) {
      recommendations.push('🚨 KRYTYCZNE: Strona nie używa HTTPS - natychmiast włącz SSL/TLS!')
    }

    if (!data.technical.robotsTxt.found) {
      recommendations.push('⚠️ Utwórz plik robots.txt aby kontrolować indeksowanie przez roboty')
    } else if (data.technical.robotsTxt.issues.length > 0) {
      recommendations.push(`⚠️ robots.txt: ${data.technical.robotsTxt.issues[0]}`)
    }

    if (!data.technical.sitemap.found) {
      recommendations.push('⚠️ Utwórz sitemap.xml aby ułatwić Google indeksowanie Twojej strony')
    }
  }

  // Jeśli wszystko OK
  if (recommendations.length === 0) {
    recommendations.push(
      '✅ Świetna robota! Twoja strona ma solidne podstawy SEO. Rozważ pełny audyt na collytics.io aby wykryć bardziej zaawansowane optymalizacje.'
    )
  } else {
    recommendations.push(
      '🎯 Chcesz naprawić te problemy? Zamów pełny audyt widoczności w AI na collytics.io/audyt-widocznosci-ai.html'
    )
  }

  return recommendations
}
