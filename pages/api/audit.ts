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
          data: content,
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
