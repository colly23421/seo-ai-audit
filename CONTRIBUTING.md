# Contributing to SEO AI Audit

Dziękujemy za zainteresowanie! 🎉

## Jak wnieść swój wkład?

### Zgłaszanie błędów

1. Sprawdź czy błąd nie został już zgłoszony w [Issues](https://github.com/your-username/seo-ai-audit/issues)
2. Utwórz nowy Issue z opisem:
   - Kroki do reprodukcji
   - Oczekiwane zachowanie
   - Rzeczywiste zachowanie
   - Screenshoty (jeśli możliwe)
   - Środowisko (przeglądarka, OS)

### Propozycje nowych funkcji

1. Utwórz Issue z tagiem `enhancement`
2. Opisz szczegółowo:
   - Problem który rozwiązuje
   - Proponowane rozwiązanie
   - Alternatywy które rozważyłeś

### Pull Requesty

1. **Fork** repozytorium
2. Utwórz branch: `git checkout -b feature/amazing-feature`
3. Commit zmian: `git commit -m 'Add amazing feature'`
4. Push do brancha: `git push origin feature/amazing-feature`
5. Otwórz Pull Request

### Standardy kodu

- Używaj TypeScript
- Formatuj kodem: ESLint + Prettier
- Dodaj komentarze do złożonej logiki
- Nazwy zmiennych po angielsku
- Komponenty w PascalCase
- Funkcje w camelCase

### Struktura commitu

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: Nowa funkcja
- `fix`: Naprawa błędu
- `docs`: Dokumentacja
- `style`: Formatowanie
- `refactor`: Refaktoryzacja
- `test`: Testy
- `chore`: Maintenance

**Przykład:**
```
feat(audit): add robots.txt analysis

Add analysis of robots.txt file to check if site allows crawling.
Includes detection of disallowed paths and sitemap location.

Closes #123
```

## Pomysły na rozwój

### Priority High
- [ ] Analiza robots.txt
- [ ] Sprawdzanie sitemap.xml
- [ ] Google Business Profile API integration
- [ ] Export raportu do PDF
- [ ] Porównanie wielu URL

### Priority Medium
- [ ] Analiza prędkości ładowania (Core Web Vitals)
- [ ] Sprawdzanie backlinków
- [ ] Mobile-friendliness test
- [ ] SSL certificate check
- [ ] Broken links detection

### Priority Low
- [ ] Historia audytów dla użytkownika
- [ ] Email z raportem
- [ ] Integracja z Google Search Console
- [ ] Scheduled audits
- [ ] Multi-language support

## Pytania?

Skontaktuj się przez:
- Issues na GitHub
- Email: kontakt@collytics.io
- Website: [collytics.io](https://www.collytics.io/)

## Licencja

Wnosząc swój wkład, zgadzasz się na licencję MIT projektu.
