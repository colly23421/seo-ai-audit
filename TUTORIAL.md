# 🎓 Tutorial Krok po Kroku

## Część 1: Upload na GitHub (5 minut)

### Krok 1: Utwórz nowe repozytorium
```
1. Wejdź na github.com
2. Kliknij zielony przycisk "+ New"
3. Wypełnij formularz:
   
   Repository name: seo-ai-audit
   Description: Audyt SEO i widoczności w AI
   Public ✓
   
4. ODZNACZ "Add a README file"
5. Kliknij "Create repository"
```

**Wynik:** Puste repozytorium gotowe do wypełnienia

---

### Krok 2: Przygotuj pliki
```
1. Rozpakuj seo-ai-audit.tar.gz
2. Otwórz terminal/CMD w folderze
3. Uruchom:

   git init
   git add .
   git commit -m "Initial commit - SEO AI Audit v1.0"
```

**Wynik:** Lokalne repozytorium Git gotowe

---

### Krok 3: Połącz z GitHub
```
1. Wróć do GitHub w przeglądarce
2. Skopiuj URL repozytorium (HTTPS)
   Przykład: https://github.com/username/seo-ai-audit.git

3. W terminalu:
   
   git remote add origin [WKLEJ_URL]
   git branch -M main
   git push -u origin main

4. Odśwież stronę GitHub
```

**Wynik:** ✅ Kod jest na GitHub!

---

## Część 2: Deploy na Vercel (3 minuty)

### Krok 4: Połącz Vercel z GitHub
```
1. Wejdź na vercel.com
2. Kliknij "Sign Up"
3. Wybierz "Continue with GitHub"
4. Zaloguj się do GitHub
5. Zezwól Vercel na dostęp
```

**Wynik:** Konto Vercel połączone z GitHub

---

### Krok 5: Importuj projekt
```
1. W Vercel Dashboard kliknij "Add New..."
2. Wybierz "Project"
3. Znajdź "seo-ai-audit" na liście
4. Kliknij "Import"

   Vercel automatycznie wykryje:
   ✓ Framework: Next.js
   ✓ Root Directory: ./
   ✓ Build Command: next build
   ✓ Output Directory: .next

5. Kliknij "Deploy" (niebieski przycisk)
```

**Wynik:** 🚀 Aplikacja się buduje!

---

### Krok 6: Poczekaj na deploy
```
Postęp deployu (1-2 minuty):

[▓▓▓▓▓░░░░░] Building...
[▓▓▓▓▓▓▓▓░░] Optimizing...
[▓▓▓▓▓▓▓▓▓▓] Deploying...
[✓✓✓✓✓✓✓✓✓✓] Ready!

Status: ✅ Deployment Successful
URL: https://seo-ai-audit-xyz123.vercel.app
```

**Wynik:** 🎉 Aplikacja działa!

---

## Część 3: Pierwsze użycie (2 minuty)

### Krok 7: Otwórz aplikację
```
1. Kliknij na URL: https://twój-projekt.vercel.app
2. Zobaczysz stronę główną:

   ┌────────────────────────────────────┐
   │  Audyt SEO & Widoczność w AI       │
   │                                    │
   │  Sprawdź, jak Twoja strona...      │
   │                                    │
   │  [  Wpisz URL strony  ]           │
   │  [  Rozpocznij audyt  ]           │
   └────────────────────────────────────┘
```

**Wynik:** Aplikacja załadowana i gotowa

---

### Krok 8: Przeprowadź pierwszy audyt
```
1. Wpisz URL testowy:
   https://example.com
   
2. Kliknij "Rozpocznij audyt"

3. Poczekaj 5-10 sekund:
   
   ⏳ Analizuję stronę...
   (animacja kręcącego się kółka)
```

**Wynik:** ⌛ Audyt w toku...

---

### Krok 9: Zobacz raport
```
Raport wyświetli:

╔═══════════════════════════════════════╗
║ Raport Audytu                         ║
║ example.com                     65/100║
╠═══════════════════════════════════════╣
║                                       ║
║ 📄 Meta Tagi                          ║
║   ✓ Title: 45 znaków (optymalny)     ║
║   ⚠ Description: 95 znaków (za krótki)║
║                                       ║
║ 📋 Struktura Nagłówków                ║
║   H1: 1 nagłówek ✓                    ║
║   H2: 4 nagłówki                      ║
║                                       ║
║ 🔗 JSON-LD Schema Markup              ║
║   ✓ Znaleziono: 2 struktury           ║
║                                       ║
║ ❓ FAQ                                 ║
║   ✗ Nie znaleziono sekcji FAQ         ║
║                                       ║
║ 📱 Social Media Tags                  ║
║   ✓ Open Graph: Obecne                ║
║   ✓ Twitter Cards: Obecne             ║
╚═══════════════════════════════════════╝
```

**Wynik:** 📊 Pełny raport gotowy!

---

## Część 4: Customizacja (opcjonalnie)

### Krok 10: Zmień link CTA
```
1. Otwórz projekt w edytorze kodu (VS Code)

2. Znajdź plik:
   components/AuditReport.tsx

3. Szukaj (Ctrl+F):
   "https://www.collytics.io/audyt-widocznosci-ai.html"

4. Zamień na swój link:
   "https://twoja-firma.pl/oferta"

5. Zapisz plik
```

**Wynik:** Link CTA zmieniony

---

### Krok 11: Push zmiany
```
1. W terminalu:

   git add .
   git commit -m "Zmieniono link CTA"
   git push

2. Vercel automatycznie:
   
   ✓ Wykryje zmiany
   ✓ Zbuduje nową wersję
   ✓ Deployuje na produkcję (1-2 min)
```

**Wynik:** ✅ Automatyczny deploy zrobiony!

---

### Krok 12: Zmień kolory
```
1. Otwórz:
   tailwind.config.js

2. Znajdź:
   colors: {
     primary: '#2563eb',
     secondary: '#1e40af',
   }

3. Zmień na swoje:
   colors: {
     primary: '#8b5cf6',    // Fioletowy
     secondary: '#7c3aed',  // Ciemny fiolet
   }

4. Git push (jak w kroku 11)
```

**Wynik:** 🎨 Nowe kolory!

---

## Część 5: Własna domena (opcjonalnie)

### Krok 13: Dodaj domenę
```
1. W Vercel Dashboard:
   - Wybierz swój projekt
   - Settings → Domains

2. Wpisz swoją domenę:
   audyt.mojafirma.pl
   
3. Vercel pokaże rekordy DNS do dodania:
   
   Type: A
   Name: audyt
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www.audyt
   Value: cname.vercel-dns.com
```

**Wynik:** Instrukcje DNS gotowe

---

### Krok 14: Skonfiguruj DNS
```
1. Zaloguj się do panelu domeny (np. home.pl)
2. Znajdź "Zarządzanie DNS" lub "DNS Records"
3. Dodaj rekordy z kroku 13:

   Rekord 1:
   [Typ: A] [audyt] [76.76.21.21]
   
   Rekord 2:
   [Typ: CNAME] [www.audyt] [cname.vercel-dns.com]

4. Zapisz zmiany
5. Poczekaj 5-60 minut na propagację
```

**Wynik:** ✅ Domena skonfigurowana!

---

### Krok 15: Weryfikacja
```
1. Po ~30 minutach wejdź na:
   https://audyt.mojafirma.pl

2. Powinna załadować się Twoja aplikacja!

Status w Vercel:
┌─────────────────────────┐
│ audyt.mojafirma.pl      │
│ Status: ✓ Valid         │
│ SSL: ✓ Active           │
└─────────────────────────┘
```

**Wynik:** 🎉 Własna domena działa!

---

## Część 6: Monitoring i Utrzymanie

### Krok 16: Sprawdź Analytics
```
1. W Vercel Dashboard:
   - Wybierz projekt
   - Analytics (lewa strona)

2. Zobaczysz:
   📊 Visitors
   📈 Page Views
   ⚡ Performance
   🌍 Geographic Data
```

**Wynik:** Dane o użytkownikach

---

### Krok 17: Zobacz logi
```
1. W Vercel Dashboard:
   - Deployments
   - Kliknij najnowszy
   - Building → View Logs

2. Zobaczysz:
   [○] npm install
   [○] next build
   [✓] Build completed
   [✓] Deployment ready
```

**Wynik:** Logi buildów dostępne

---

### Krok 18: Monitoruj błędy
```
1. Jeśli coś nie działa:
   - Functions (lewa strona)
   - audit (Twoja funkcja API)
   - Zobacz logi i błędy

2. Możesz dodać więcej logów w kodzie:
   console.log('Debug info:', data)
```

**Wynik:** Debugging gotowy

---

## Część 7: Pro Tips

### Tip 1: Branch Preview
```
Każdy branch na GitHub = preview URL!

1. Utwórz branch:
   git checkout -b feature/new-feature
   
2. Push:
   git push origin feature/new-feature
   
3. Vercel stworzy:
   https://seo-ai-audit-git-feature-xyz.vercel.app
```

**Użycie:** Testuj zmiany przed mergeм

---

### Tip 2: Environment Variables
```
1. Settings → Environment Variables
2. Dodaj zmienne (np. API keys)
3. Redeploy projekt

Użycie w kodzie:
process.env.TWOJ_KLUCZ
```

**Użycie:** Bezpieczne przechowywanie sekretów

---

### Tip 3: Build & Development
```
Build Command można zmienić w Settings:

Development: npm run dev
Build: npm run build && npm run export
```

**Użycie:** Customowe komendy buildów

---

## 🎯 Checklist Zakończenia

Po ukończeniu tego tutorialu powinieneś mieć:

- [✓] Kod na GitHub
- [✓] Działającą aplikację na Vercel
- [✓] URL typu: twoj-projekt.vercel.app
- [✓] Pierwszy przeprowadzony audyt
- [✓] (Opcjonalnie) Własną domenę
- [✓] (Opcjonalnie) Zmienione kolory/linki

---

## 🆘 Troubleshooting

### Problem: Build Failed
```
Rozwiązanie:
1. Sprawdź logi w Vercel
2. Lokalnie uruchom: npm run build
3. Napraw błędy
4. Push ponownie
```

### Problem: 404 na stronie
```
Rozwiązanie:
1. Sprawdź czy masz app/page.tsx
2. Hard refresh: Ctrl + F5
3. Sprawdź Vercel logs
```

### Problem: API nie działa
```
Rozwiązanie:
1. Functions → audit → View Logs
2. Dodaj console.log w pages/api/audit.ts
3. Redeploy
```

---

## 🎉 Gratulacje!

Masz teraz w pełni działającą aplikację do audytu SEO!

**Co dalej?**
1. Testuj na różnych stronach
2. Zbierz feedback od użytkowników
3. Rozwijaj nowe funkcje (zobacz FEATURES.md)
4. Podziel się projektem z innymi

---

## 📚 Dodatkowe Materiały

- **Podstawy:** README.md
- **Quick Start:** QUICKSTART.md
- **Pełny Deploy:** DEPLOYMENT.md
- **FAQ:** FAQ.md
- **Przykłady:** EXAMPLES.md

---

**Tutorial zakończony! 🚀**

*Pytania? kontakt@collytics.io*  
*Powered by [Collytics.io](https://www.collytics.io/)*
