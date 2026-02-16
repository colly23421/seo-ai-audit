# 🔍 Audyt SEO & Widoczność w AI

Profesjonalna aplikacja do audytu stron internetowych pod kątem SEO i widoczności w chatach AI (ChatGPT, Claude, Gemini itp.).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

## ✨ Funkcje

- ✅ **Analiza Meta Tagów** - title, description, canonical
- ✅ **Struktura Nagłówków** - H1-H6 z walidacją
- ✅ **JSON-LD Schema Markup** - wykrywanie i walidacja struktur
- ✅ **FAQ Analysis** - wykrywanie sekcji FAQ i schema FAQPage
- ✅ **Social Media Tags** - Open Graph i Twitter Cards
- ✅ **Scoring System** - ocena strony 0-100
- ✅ **Rekomendacje** - konkretne wskazówki do poprawy
- ✅ **CTA do sprzedaży** - integracja z pakietami Collytics

## 🚀 Szybki Start

### Instalacja lokalna

```bash
# Sklonuj repozytorium
git clone https://github.com/twoje-repo/seo-ai-audit.git
cd seo-ai-audit

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

### Deploy na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/twoje-repo/seo-ai-audit)

1. Kliknij przycisk "Deploy with Vercel" powyżej
2. Zaloguj się do Vercel (lub załóż konto)
3. Podłącz swoje repozytorium GitHub
4. Vercel automatycznie wykryje Next.js i skonfiguruje projekt
5. Kliknij "Deploy" i poczekaj 1-2 minuty

**Gotowe!** Twoja aplikacja jest teraz dostępna pod adresem `https://twoj-projekt.vercel.app`

## 📋 Wymagania

- Node.js 18+ lub nowszy
- npm lub yarn

## 🔧 Technologie

- **Framework**: Next.js 14 (App Router)
- **Język**: TypeScript
- **Styling**: Tailwind CSS
- **Web Scraping**: Cheerio
- **HTTP Client**: Axios
- **Deploy**: Vercel

## 📊 Co jest analizowane?

### Meta Tagi
- Title (30-60 znaków)
- Meta Description (120-160 znaków)
- Canonical URL

### Nagłówki
- Struktura H1-H6
- Liczba nagłówków każdego typu
- Treść wszystkich nagłówków

### JSON-LD Schema
- Wykrywanie struktur Schema.org
- Walidacja podstawowa (@context, @type)
- Lista typów schema (Organization, LocalBusiness, FAQPage, etc.)

### FAQ
- Wykrywanie sekcji FAQ
- Analiza schema FAQPage
- Ekstrakce pytań i odpowiedzi

### Social Media
- Open Graph tags (Facebook)
- Twitter Cards
- Meta tagi obrazów

## 🎯 Scoring

Aplikacja przyznaje punkty w następujących kategoriach:

- **Meta Tagi**: 30 punktów
  - Title: 15 punktów
  - Description: 15 punktów

- **Nagłówki**: 20 punktów
  - H1 (jeden): 10 punktów
  - H2+: 10 punktów

- **JSON-LD**: 25 punktów
  - Obecność: 15 punktów
  - Poprawność: 10 punktów

- **FAQ**: 10 punktów

- **Social Tags**: 15 punktów
  - Open Graph: 8 punktów
  - Twitter Cards: 7 punktów

**Maksymalny wynik**: 100 punktów

## 🛠️ Struktura Projektu

```
seo-ai-audit/
├── app/
│   ├── globals.css          # Style globalne
│   ├── layout.tsx           # Layout aplikacji
│   └── page.tsx             # Strona główna
├── components/
│   ├── AuditForm.tsx        # Formularz URL
│   └── AuditReport.tsx      # Wyświetlanie raportu
├── pages/
│   └── api/
│       └── audit.ts         # API endpoint audytu
├── public/                  # Pliki statyczne
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔗 Integracja z Collytics

Aplikacja zawiera wbudowane CTA prowadzące do:
`https://www.collytics.io/audyt-widocznosci-ai.html`

Możesz zmienić link w plikach:
- `app/page.tsx` (stopka)
- `components/AuditReport.tsx` (2x CTA box)

## 📝 Customizacja

### Zmiana kolorów
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

### Dodanie nowych analiz
Rozbuduj funkcję w `pages/api/audit.ts`:

```typescript
function analyzeNewFeature($: cheerio.CheerioAPI) {
  // Twoja logika
  return { ... }
}
```

## 🐛 Znane Ograniczenia

- Nie obsługuje stron wymagających JavaScript do renderowania treści (SPA bez SSR)
- Nie sprawdza wizytówki Google Business Profile (wymaga Google API)
- Timeout 15 sekund dla wolnych stron
- Maksymalnie 5 przekierowań

## 🤝 Contributing

Pull requesty są mile widziane! W przypadku większych zmian, otwórz najpierw issue.

## 📄 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

## 🌟 Autor

Stworzone dla [Collytics.io](https://www.collytics.io/)

## 📞 Wsparcie

Masz pytania? Skontaktuj się:
- 🌐 Website: [collytics.io](https://www.collytics.io/)
- 📧 Email: kontakt@collytics.io

---

**Powered by Collytics.io** 🚀
