# 📖 Przykłady Użycia

## Podstawowe Użycie

### Przykład 1: Audyt własnej strony

```
URL: https://mojafirma.pl
```

**Oczekiwany wynik:**
- Sprawdzenie wszystkich elementów SEO
- Raport z oceną 0-100
- Lista rekomendacji
- Podgląd wszystkich znalezionych problemów

---

### Przykład 2: Audyt przed uruchomieniem

**Scenariusz:** Masz nową stronę i chcesz sprawdzić czy wszystko jest OK przed oficjalnym uruchomieniem.

```
URL: https://staging.mojafirma.pl
```

**Co sprawdzić:**
- ✅ Meta title jest unikatowy i opisowy?
- ✅ Description jest przekonujący?
- ✅ Dokładnie jeden H1?
- ✅ JSON-LD przynajmniej Organization lub LocalBusiness?
- ✅ FAQ jeśli odpowiednie?
- ✅ Open Graph dla social media?

---

### Przykład 3: Audyt konkurencji

**Scenariusz:** Chcesz zobaczyć jak konkurencja ma zrobione SEO.

```
URL: https://konkurencja.pl
```

**Co możesz odkryć:**
- Jakie używają schema markup?
- Jak długie mają title/description?
- Czy mają sekcję FAQ?
- Jak wygląda struktura nagłówków?

**TIP:** Nie kopiuj 1:1, ale inspiruj się dobrymi praktykami.

---

## Użycie dla Agencji

### Przykład 4: Raport dla klienta

**Workflow:**
1. Przeprowadź audyt strony klienta
2. Zrób screenshot raportu
3. Dołącz do prezentacji z rekomendacjami
4. Zaproponuj wdrożenie poprawek

**Email do klienta:**
```
Dzień dobry,

Przeprowadziliśmy audyt SEO Państwa strony.
Obecny wynik: 45/100 punktów.

Główne problemy:
• Brak struktury JSON-LD
• Meta description za krótki
• Wiele nagłówków H1

Możemy to poprawić i osiągnąć wynik 85+ punktów.
Czy zainteresuje Państwa wycena?
```

---

### Przykład 5: Audyt przed i po

**Scenariusz:** Pokazanie klientowi wartości Twojej pracy.

**PRZED wdrożeniem:**
```
Wynik: 35/100
❌ Brak JSON-LD
❌ Title za długi (85 znaków)
❌ Brak FAQ
```

**PO wdrożeniu:**
```
Wynik: 92/100
✅ 3 struktury JSON-LD
✅ Title optymalny (55 znaków)
✅ FAQ z 15 pytaniami
```

**ROI:** "Podnieśliśmy Waszą widoczność w Google o 165%!"

---

## Użycie dla Freelancerów

### Przykład 6: Lead magnet

**Oferta na landing page:**
```
"Darmowy audyt SEO Twojej strony!"

1. Wpisz URL
2. Otrzymaj raport
3. Dostaniesz też moje rekomendacje co poprawić (gratis!)
```

**Zbierasz:**
- Email (opcjonalnie)
- URL strony
- Zaufanie klienta (pokazujesz wartość)

---

### Przykład 7: Upselling

**Po darmowym audycie:**

```
"Widzę, że Twoja strona ma wynik 40/100.
Najbardziej brakuje:
• JSON-LD schema (kluczowe dla AI!)
• Optymalizacji meta tagów
• Sekcji FAQ

Mogę to wdrożyć w 2 dni za 2000 zł.
Zainteresowany?"
```

---

## Przypadki Specjalne

### Przykład 8: E-commerce

**URL:** `https://sklep.pl`

**Sprawdź dodatkowo:**
- JSON-LD typu `Product`
- JSON-LD typu `Offer`
- Breadcrumbs schema
- Review/Rating schema

**Uwaga:** Obecna wersja wykryje te schema, ale nie waliduje ich szczegółowo. Dla e-commerce polecamy pełny audyt: https://www.collytics.io/audyt-widocznosci-ai.html

---

### Przykład 9: Lokalna firma

**URL:** `https://restauracja-warszawa.pl`

**Co jest kluczowe:**
- JSON-LD typu `LocalBusiness` lub specyficzniejszy (Restaurant)
- Adres w schema
- Godziny otwarcia
- FAQ o lokalizacji

**TIP:** Połącz z Google Business Profile dla lepszej widoczności lokalnej.

---

### Przykład 10: Blog / Media

**URL:** `https://blog.pl`

**Sprawdź:**
- JSON-LD typu `Article`
- JSON-LD typu `BlogPosting`
- Author information
- Published date
- Image schema

**Bonus:** Jeśli masz wiele artykułów, możesz audytować po kolei najpopularniejsze.

---

## Automatyzacja

### Przykład 11: Scheduled audits (przyszłość)

```bash
# Cron job (Linux)
0 9 * * 1 curl -X POST https://twoj-audit.vercel.app/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://mojafirma.pl"}' \
  > raport-$(date +%Y%m%d).json
```

**Co to robi:**
- Codziennie o 9:00 w poniedziałek
- Pobiera audyt
- Zapisuje do pliku z datą

**Użycie:** Tracking zmian w czasie, monitoring konkurencji

---

### Przykład 12: Bulk audit (wiele stron)

```javascript
// bulk-audit.js
const urls = [
  'https://strona1.pl',
  'https://strona2.pl',
  'https://strona3.pl',
];

for (const url of urls) {
  const response = await fetch('https://twoj-audit.vercel.app/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  
  const data = await response.json();
  console.log(`${url}: ${data.overallScore}/100`);
}
```

**Użycie:** Audyt portfolio stron, analiza wielu produktów, badanie konkurencji

---

## Integracje

### Przykład 13: Webhook do Slack

```javascript
// W pages/api/audit.ts - na końcu
if (process.env.SLACK_WEBHOOK) {
  await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({
      text: `Nowy audyt: ${url} - Wynik: ${overallScore}/100`
    })
  });
}
```

**Użycie:** Powiadomienia zespołu o nowych audytach

---

### Przykład 14: Export do Google Sheets

```javascript
// Wymaga Google Sheets API
import { GoogleSpreadsheet } from 'google-spreadsheet';

async function saveToSheets(auditData) {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({...});
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    date: new Date().toISOString(),
    url: auditData.url,
    score: auditData.overallScore,
    hasJsonLd: auditData.jsonLd.found,
    hasFaq: auditData.faq.found,
  });
}
```

**Użycie:** Automatyczne logowanie wszystkich audytów, analiza trendów

---

## Pro Tips

### 🎯 Tip 1: Porównaj z najlepszymi

Znajdź 3 najlepsze strony w Twojej branży i zaudytuj je wszystkie. Zobacz co mają wspólnego i czego Ci brakuje.

### 🎯 Tip 2: Audyt przed każdym dużym update'm

Zawsze zrób audyt przed i po dużych zmianach na stronie. Łatwiej złapać regresje.

### 🎯 Tip 3: Edukuj klientów

Wyślij im raport i wytłumacz co oznacza każda sekcja. Klient który rozumie SEO to klient który docenia Twoją pracę.

### 🎯 Tip 4: Combine z innymi narzędziami

Ten audyt to początek. Uzupełnij go o:
- PageSpeed Insights (prędkość)
- Ahrefs (backlinki)
- Google Search Console (wydajność)

### 🎯 Tip 5: Regularne audyty

SEO to nie one-time rzecz. Audytuj regularnie (np. co miesiąc) i śledź progress.

---

## Błędy do uniknięcia

### ❌ Nie rób: Audyt tylko raz

SEO zmienia się, strona zmienia się, konkurencja zmienia się. Regularność = klucz.

### ❌ Nie rób: Ignoruj rekomendacje

Raport to nie tylko liczba. Rekomendacje to konkretne akcje do wykonania.

### ❌ Nie rób: 100 punktów = perfekcja

100/100 w tym audycie to świetny start, ale nie koniec drogi. To tylko technical SEO.

### ❌ Nie rób: Kopiuj konkurencję 1:1

Inspiruj się, ale zachowaj oryginalność. Google karze za duplicate content.

---

## Następne Kroki

Po otrzymaniu raportu:

1. **Priorytetyzuj** - zacznij od czerwonych (błędy)
2. **Implementuj** - popraw po kolei według ważności
3. **Testuj** - zrób ponowny audyt
4. **Monitoruj** - śledź wyniki w Google Search Console
5. **Skaluj** - zastosuj na wszystkich podstronach

---

## Potrzebujesz pomocy?

**DIY (Do It Yourself):**
- 📚 Przeczytaj wszystkie MD pliki w projekcie
- 🔍 Sprawdź kod w `pages/api/audit.ts`
- 💬 Zadaj pytanie na GitHub Issues

**Profesjonalna pomoc:**
- 🎯 Zamów pełny audyt: https://www.collytics.io/audyt-widocznosci-ai.html
- 📧 Skontaktuj się: kontakt@collytics.io
- 🚀 Wdrożenie i konsultacje

---

**Powodzenia z audytami! 📊🚀**

*Powered by [Collytics.io](https://www.collytics.io/)*
