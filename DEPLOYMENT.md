# 🚀 Instrukcja Wdrożenia na GitHub + Vercel

## Krok 1: Przygotowanie repozytorium GitHub

1. Zaloguj się na [GitHub.com](https://github.com)
2. Kliknij "+" w prawym górnym rogu → "New repository"
3. Nazwa repozytorium: `seo-ai-audit` (lub dowolna)
4. Opis: "Audyt SEO i widoczności w AI"
5. Ustaw jako **Public** (dla darmowego hostingu na Vercel)
6. **NIE** zaznaczaj "Initialize with README" (już mamy)
7. Kliknij "Create repository"

## Krok 2: Upload kodu na GitHub

### Opcja A: Przez wiersz poleceń (Git)

```bash
# W folderze z projektem
cd seo-ai-audit

# Inicjalizuj Git
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit - SEO AI Audit Tool"

# Połącz z GitHub (zamień YOUR_USERNAME na swoją nazwę użytkownika)
git remote add origin https://github.com/YOUR_USERNAME/seo-ai-audit.git

# Wypchnij kod
git branch -M main
git push -u origin main
```

### Opcja B: Przez GitHub Desktop

1. Pobierz [GitHub Desktop](https://desktop.github.com/)
2. File → Add Local Repository → wybierz folder `seo-ai-audit`
3. Publish repository → wybierz nazwę i kliknij "Publish"

### Opcja C: Przez interfejs GitHub (upload plików)

1. Wejdź na stronę swojego repozytorium
2. Kliknij "uploading an existing file"
3. Przeciągnij wszystkie pliki z folderu `seo-ai-audit`
4. Wpisz commit message i kliknij "Commit changes"

## Krok 3: Deploy na Vercel

### Metoda 1: Przez Vercel Dashboard (ZALECANA)

1. Wejdź na [vercel.com](https://vercel.com)
2. Kliknij "Sign Up" i zaloguj się przez GitHub
3. Po zalogowaniu kliknij "Add New..." → "Project"
4. Wybierz swoje repozytorium `seo-ai-audit`
5. Kliknij "Import"
6. Vercel automatycznie wykryje Next.js:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`
7. Kliknij **"Deploy"**
8. Poczekaj 1-2 minuty ☕

**Gotowe!** Otrzymasz link typu: `https://seo-ai-audit.vercel.app`

### Metoda 2: Przez Vercel CLI

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# W folderze projektu
cd seo-ai-audit

# Deploy
vercel

# Postępuj zgodnie z instrukcjami:
# - Set up and deploy? Y
# - Which scope? wybierz swoje konto
# - Link to existing project? N
# - Project name: seo-ai-audit
# - Directory: ./
# - Override settings? N

# Po pierwszym deploy, kolejne można robić przez:
vercel --prod
```

## Krok 4: Własna domena (opcjonalnie)

### W Vercel Dashboard:

1. Otwórz swój projekt
2. Settings → Domains
3. Wpisz swoją domenę (np. `audyt.collytics.io`)
4. Postępuj według instrukcji dodania rekordów DNS

### Rekordy DNS do dodania:

```
Typ: A
Nazwa: @ (lub subdomena)
Wartość: 76.76.21.21

Typ: CNAME
Nazwa: www (lub subdomena)
Wartość: cname.vercel-dns.com
```

## Krok 5: Automatyczne Deploy

Vercel automatycznie deployuje przy każdym pushu do GitHub:

```bash
# Zrób jakieś zmiany w kodzie
# Np. zmień tekst w app/page.tsx

# Commituj i pushuj
git add .
git commit -m "Aktualizacja treści"
git push

# Vercel automatycznie zbuduje i wdroży nową wersję!
```

## 🔧 Konfiguracja dodatkowa

### Zmienne środowiskowe (jeśli potrzebne)

W Vercel Dashboard:
1. Settings → Environment Variables
2. Dodaj zmienne (np. klucze API)
3. Redeploy projekt

### Własne ustawienia Build

W `vercel.json` możesz dodać:

```json
{
  "github": {
    "silent": true
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring

Vercel automatycznie dostarcza:
- **Analytics** - statystyki użytkowania
- **Logs** - logi z aplikacji
- **Speed Insights** - metryki wydajności

Wszystko dostępne w Dashboard → Analytics

## 🐛 Troubleshooting

### Build Failed?

1. Sprawdź logi w Vercel Dashboard
2. Upewnij się, że wszystkie zależności są w `package.json`
3. Sprawdź czy lokalnie działa: `npm run build`

### 404 na stronie?

1. Upewnij się, że masz `app/page.tsx`
2. Sprawdź czy używasz App Router (Next.js 13+)
3. Zrób hard refresh: Ctrl+F5

### API nie działa?

1. Sprawdź czy endpoint jest w `pages/api/audit.ts`
2. Sprawdź logi w Vercel → Functions → audit
3. Dodaj więcej logowania: `console.log()`

## 🎉 Sukces!

Twoja aplikacja jest teraz dostępna na:
- Production: `https://twoj-projekt.vercel.app`
- Preview: automatyczne URL dla każdego PR
- Development: `http://localhost:3000`

## 📚 Przydatne linki

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Documentation](https://docs.github.com)

---

**Potrzebujesz pomocy?** 
Odwiedź: https://www.collytics.io/audyt-widocznosci-ai.html
