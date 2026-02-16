# ⚡ Quick Start Guide - 5 Minut do Uruchomienia

## 🎯 Opcja 1: Deploy na Vercel (NAJSZYBSZE)

### Bez instalacji lokalnej - 2 minuty

1. **Upload na GitHub:**
   - Wejdź na github.com → New repository
   - Nazwij: `seo-ai-audit`
   - Upload wszystkie pliki z folderu

2. **Deploy na Vercel:**
   - Wejdź na [vercel.com](https://vercel.com)
   - Zaloguj przez GitHub
   - "Add New Project" → wybierz `seo-ai-audit`
   - Kliknij "Deploy" i czekaj 2 minuty

**✅ GOTOWE!** Link: `https://twoj-projekt.vercel.app`

---

## 💻 Opcja 2: Lokalnie (dla developerów)

### 1. Rozpakuj i zainstaluj

```bash
# Rozpakuj archiwum
tar -xzf seo-ai-audit.tar.gz
cd seo-ai-audit

# Zainstaluj zależności (zajmie 1-2 minuty)
npm install
```

### 2. Uruchom

```bash
npm run dev
```

**✅ GOTOWE!** Otwórz: `http://localhost:3000`

---

## 🧪 Test aplikacji

1. Wpisz URL: `https://example.com`
2. Kliknij "Rozpocznij audyt"
3. Po 5-10 sekundach zobaczysz raport!

---

## 🎨 Customizacja (opcjonalnie)

### Zmień kolory

**Edytuj:** `tailwind.config.js`

```js
colors: {
  primary: '#2563eb',    // Niebieski
  secondary: '#1e40af',  // Ciemnoniebieski
}
```

### Zmień link CTA

**Edytuj:** `components/AuditReport.tsx` (linia ~90 i ~260)

```tsx
href="https://www.collytics.io/audyt-widocznosci-ai.html"
// Zamień na swój link
```

### Dodaj Google Analytics

1. **Edytuj:** `app/layout.tsx`
2. Dodaj przed `</head>`:

```tsx
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `,
  }}
/>
```

---

## 📊 Co dalej?

### Automatyczne updaty (GitHub + Vercel)

Każdy push na GitHub → automatyczny deploy!

```bash
# Zrób zmiany
git add .
git commit -m "Moja zmiana"
git push

# Vercel automatycznie deployuje!
```

### Własna domena

W Vercel Dashboard:
1. Settings → Domains
2. Wpisz domenę (np. `audyt.collytics.io`)
3. Dodaj rekordy DNS (Vercel pokaże jak)

---

## 🆘 Problemy?

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 is already in use"
```bash
# Użyj innego portu
PORT=3001 npm run dev
```

### Build fails na Vercel
1. Sprawdź czy wszystkie pliki są w repo
2. Sprawdź Node version (powinno być 18+)
3. Zobacz logi w Vercel Dashboard

---

## 📚 Więcej informacji

- **Pełna dokumentacja:** `README.md`
- **Deployment guide:** `DEPLOYMENT.md`
- **Contributing:** `CONTRIBUTING.md`

---

## 🎉 Gratulacje!

Masz działającą aplikację do audytu SEO!

**Chcesz profesjonalny audyt?**
👉 https://www.collytics.io/audyt-widocznosci-ai.html

---

**Pytania?** 
📧 kontakt@collytics.io
🌐 www.collytics.io
