# ❓ Frequently Asked Questions (FAQ)

## Podstawowe Pytania

### Czym jest ta aplikacja?

To narzędzie do audytu SEO i widoczności stron w AI. Sprawdza strukturę strony, meta tagi, JSON-LD schema, FAQ i wiele więcej, aby ocenić jak dobrze Twoja strona jest zoptymalizowana pod Google i chaty AI (ChatGPT, Claude, Gemini).

### Czy to narzędzie jest darmowe?

Tak! Aplikacja jest całkowicie darmowa i open-source. Możesz ją uruchomić na własnym serwerze lub użyć darmowego hostingu Vercel.

### Czy mogę używać tego komercyjnie?

Tak, licencja MIT pozwala na dowolne użycie, w tym komercyjne. Jedyne co musisz zachować to informację o licencji.

---

## Instalacja i Uruchomienie

### Jak zainstalować lokalnie?

```bash
# Sklonuj lub rozpakuj projekt
cd seo-ai-audit

# Zainstaluj zależności
npm install

# Uruchom
npm run dev
```

### Jak wdrożyć na Vercel?

1. Upload kodu na GitHub
2. Zaloguj się na vercel.com
3. "Add New Project" → wybierz repozytorium
4. Kliknij "Deploy"

Szczegóły: `DEPLOYMENT.md`

### Jaki hosting polecacie?

- **Vercel** (zalecane) - darmowy, prosty, automatyczny deploy
- **Netlify** - też działa z Next.js
- **Railway** - opcja z bazą danych
- **Własny VPS** - dla zaawansowanych (Docker + nginx)

---

## Funkcjonalność

### Jakie elementy są sprawdzane?

1. **Meta tagi** - title, description, canonical
2. **Nagłówki** - H1-H6 struktura
3. **JSON-LD** - schema markup
4. **FAQ** - sekcje pytań i odpowiedzi
5. **Social tags** - Open Graph, Twitter Cards
6. **Scoring** - ocena 0-100 punktów

### Czy sprawdza Google Business Profile?

Obecnie nie. Wymaga to Google Places API i jest w planach na Q2 2024.

### Czy sprawdza prędkość strony?

Nie w obecnej wersji. Core Web Vitals są w roadmapie na Q3 2024.

### Dlaczego nie działa na mojej stronie?

Możliwe przyczyny:
- Strona wymaga JavaScript (SPA bez SSR)
- Strona jest chroniona (login required)
- Timeout (strona ładuje się > 15 sekund)
- Blocking robots
- Błąd serwera strony

### Czy mogę audytować strony chronione hasłem?

Nie, aplikacja nie obsługuje stron za loginem.

---

## Wyniki i Scoring

### Jak jest liczony wynik (score)?

- Meta tagi: 30 punktów (title 15 + description 15)
- Nagłówki: 20 punktów (H1 poprawny 10 + H2+ 10)
- JSON-LD: 25 punktów (obecność 15 + poprawność 10)
- FAQ: 10 punktów
- Social tags: 15 punktów (OG 8 + Twitter 7)

**Maksymalnie: 100 punktów**

### Co oznacza "status" przy każdym elemencie?

- 🟢 **Dobry** - element spełnia best practices
- 🟡 **Wymaga poprawy** - jest, ale nie jest optymalny
- 🔴 **Błąd** - brak lub krytyczny problem

### Dlaczego mam niski wynik mimo dobrze wyglądającej strony?

Wynik bazuje na technicznych aspektach SEO i strukturze danych, nie na designie. Nawet piękna strona może mieć słabe SEO bez odpowiednich meta tagów i schema markup.

### Czy 100 punktów oznacza idealne SEO?

Nie całkiem. To podstawowy audyt. Pełne SEO obejmuje też:
- Backlinki
- Prędkość ładowania
- Mobile optimization
- Content quality
- User experience
- Social signals

Dla kompleksowego audytu: https://www.collytics.io/audyt-widocznosci-ai.html

---

## Customizacja

### Jak zmienić kolory aplikacji?

Edytuj `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#twoj-kolor',
      secondary: '#twoj-kolor',
    },
  },
}
```

### Jak zmienić link CTA?

Edytuj `components/AuditReport.tsx` - znajdź wszystkie wystąpienia:
```
href="https://www.collytics.io/audyt-widocznosci-ai.html"
```
i zmień na swój link.

### Czy mogę usunąć CTA do Collytics?

Tak, możesz. Licencja MIT na to pozwala. Ale bylibyśmy wdzięczni za pozostawienie linku w stopce 😊

### Jak dodać własne logo?

1. Dodaj plik logo do `/public/logo.png`
2. W `app/page.tsx` dodaj:
```tsx
<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

---

## Techniczne

### Jakie technologie używa aplikacja?

- **Framework**: Next.js 14
- **Język**: TypeScript
- **Styling**: Tailwind CSS
- **Scraping**: Cheerio
- **HTTP**: Axios

### Czy potrzebuję bazy danych?

Nie, aplikacja działa bez bazy danych. Jest stateless.

### Czy mogę dodać bazę danych?

Tak! Możesz dodać np.:
- **Prisma** + PostgreSQL (historia audytów)
- **MongoDB** (zapisywanie raportów)
- **Redis** (cache wyników)

### Jakie zmienne środowiskowe są dostępne?

Zobacz `.env.example`. Obecnie wszystkie są opcjonalne. W przyszłości:
- `GOOGLE_PLACES_API_KEY` - dla Google Business Profile
- `DATABASE_URL` - dla bazy danych
- `NEXT_PUBLIC_GA_ID` - dla Google Analytics

### Czy mogę używać z własnym API?

Tak! Endpoint `/api/audit` można zastąpić własnym backendem.

---

## Problemy i Błędy

### "Module not found: cheerio"

```bash
npm install cheerio
```

### "Cannot read property 'text' of undefined"

Oznacza to, że element nie został znaleziony na stronie. Sprawdź czy strona rzeczywiście go zawiera.

### "Request timeout"

Strona ładuje się dłużej niż 15 sekund. Możesz zwiększyć timeout w `pages/api/audit.ts`:
```ts
timeout: 30000, // 30 sekund
```

### "CORS error"

Niektóre strony blokują requesty z innych domen. Niestety nic nie da się z tym zrobić bez proxy.

### Build failed na Vercel

Sprawdź:
1. Czy wszystkie pliki są w repo?
2. Czy używasz Node.js 18+?
3. Zobacz dokładne logi w Vercel Dashboard

---

## Rozwój

### Jak dodać nową funkcję?

1. Fork repozytorium
2. Dodaj funkcję w `pages/api/audit.ts`
3. Zaktualizuj UI w `components/AuditReport.tsx`
4. Testuj lokalnie
5. Zrób Pull Request

Zobacz: `CONTRIBUTING.md`

### Jak zgłosić błąd?

1. Sprawdź Issues na GitHub
2. Jeśli nie ma - utwórz nowy
3. Dołącz:
   - URL który sprawdzałeś
   - Oczekiwane vs rzeczywiste zachowanie
   - Screenshot
   - Środowisko (browser, OS)

### Kiedy będzie funkcja X?

Sprawdź roadmap w `FEATURES.md`. Lub zaproponuj na GitHub Issues.

---

## Biznesowe

### Czy mogę to sprzedawać klientom?

Tak! Możesz:
- Używać jako narzędzie w agencji
- Oferować audyty klientom
- Whitelabel (własny branding)
- Integrować z innymi narzędziami

### Czy mogę usunąć branding Collytics?

Tak, licencja MIT pozwala na modyfikacje. Ale docenimy zostawienie linku w stopce.

### Jak mogę wesprzeć projekt?

- ⭐ Daj gwiazdkę na GitHub
- 🐛 Zgłaszaj błędy
- 💡 Proponuj funkcje
- 🔧 Kontrybuuj kod
- 📢 Podziel się z innymi
- 🎯 Użyj naszych usług: https://www.collytics.io/

### Czy oferujecie wsparcie?

Dla darmowej wersji - wsparcie społecznościowe przez GitHub Issues.

Dla komercyjnych projektów - skontaktuj się: kontakt@collytics.io

---

## Kontakt

- 🌐 **Website**: https://www.collytics.io/
- 📧 **Email**: kontakt@collytics.io
- 💼 **LinkedIn**: [Collytics](https://www.linkedin.com/company/collytics)
- 🐙 **GitHub**: Issues w repozytorium

---

## Nie znalazłeś odpowiedzi?

Zadaj pytanie:
- Otwórz Issue na GitHub
- Wyślij email: kontakt@collytics.io
- Sprawdź dokumentację: `README.md`, `DEPLOYMENT.md`, `FEATURES.md`

**Dziękujemy za korzystanie z SEO AI Audit! 🚀**

*Powered by [Collytics.io](https://www.collytics.io/)*
