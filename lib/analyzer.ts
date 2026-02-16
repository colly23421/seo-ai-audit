export function analyzeHTML(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const title = doc.querySelector('title')?.textContent?.trim() || ''
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || ''
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''

  const headings = {
    h1: { 
      count: doc.querySelectorAll('h1').length, 
      values: Array.from(doc.querySelectorAll('h1')).slice(0, 5).map(el => el.textContent?.trim() || '') 
    },
    h2: { 
      count: doc.querySelectorAll('h2').length, 
      values: Array.from(doc.querySelectorAll('h2')).slice(0, 5).map(el => el.textContent?.trim() || '') 
    },
    h3: { count: doc.querySelectorAll('h3').length, values: [] as string[] },
    h4: { count: doc.querySelectorAll('h4').length, values: [] as string[] },
    h5: { count: doc.querySelectorAll('h5').length, values: [] as string[] },
    h6: { count: doc.querySelectorAll('h6').length, values: [] as string[] },
  }

  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
  const schemas: any[] = []
  
  jsonLdScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '')
      const items = Array.isArray(data) ? data : [data]
      items.forEach(item => {
        schemas.push({
          type: item['@type'] || 'Unknown',
          valid: !!(item['@context'] && item['@type']),
          data: item,
          errors: [],
          warnings: [],
          missingFields: [],
        })
      })
    } catch (e) {
      schemas.push({ 
        type: 'Invalid', 
        valid: false, 
        errors: ['Nieprawidłowy format JSON'],
        warnings: [],
        missingFields: [],
      })
    }
  })

  const faqElements = doc.querySelectorAll('.faq, #faq, [class*="faq"], [id*="faq"]')
  const hasFaq = faqElements.length > 0 || schemas.some(s => s.type === 'FAQPage')

  const openGraph = {
    found: doc.querySelectorAll('meta[property^="og:"]').length > 0,
    title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
    description: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
    image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    url: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
  }

  const twitter = {
    found: doc.querySelectorAll('meta[name^="twitter:"]').length > 0,
    card: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
    title: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
    description: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
    image: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
  }

  return {
    metaTags: {
      title: { value: title, length: title.length },
      description: { value: description, length: description.length },
      canonical,
    },
    headings,
    jsonLd: {
      found: schemas.length > 0,
      count: schemas.length,
      schemas,
    },
    faq: {
      found: hasFaq,
      count: faqElements.length,
    },
    socialTags: { openGraph, twitter },
  }
}
