Frontend
- React - zapewnia interaktywność tam, gdzie jest potrzebna
- TypeScript - zapewnia statyczne typowanie kodu i lepsze wsparcie IDE
- Tailwind 4 - umożliwia wygodne stylowanie aplikacji

Backend
- Supabase - wykorzystywane wyłącznie do autentykacji użytkownika (szybkie logowanie i zarządzanie sesjami); w przyszłości planowane przejście na rozwiązanie oparte o hosting na GitHub Pages.
- Node + TypeScript + Express - oddzielny serwis odpowiadający za logikę biznesową, komunikację z GitHub API oraz przetwarzanie i cachowanie danych

Github API
- Pobieranie danych z GitHub
- Autentykacja przez token (weryfikacja tokenów w razie potrzeby)

CI/CD i Hosting:
- Github Actions - do tworzenia pipeline'ów CI/CD
- DigitalOcean - do hostowania aplikacji przy użyciu obrazu Docker