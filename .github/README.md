# GitHub Actions Workflows

Ten katalog zawiera konfiguracje GitHub Actions dla automatyzacji CI/CD w projekcie.

## Dostępne Workflows

### 1. Backend Tests (backend-tests.yml)
**Zaawansowany workflow** dla testów backend z następującymi funkcjami:
- Uruchamia się przy push/PR na gałęzie `main` i `develop`
- Testuje na Node.js 18.x i 20.x (matrix strategy)
- Uruchamia testy jednostkowe z coverage
- Wysyła raporty coverage do Codecov
- Używa path filtering - uruchamia się tylko gdy zmienią się pliki w `backend/` lub `shared/`

### 2. Backend Tests Simple (backend-tests-simple.yml)  
**Prosty workflow** dla szybkich testów:
- Uruchamia się przy każdym push/PR 
- Używa tylko Node.js 20
- Uruchamia podstawowe testy jednostkowe
- Używa path filtering dla `backend/` i `shared/`

## Path Filtering

Oba workflows używają path filtering, co oznacza że uruchamiają się tylko gdy:
- Zmienią się pliki w katalogu `backend/`
- Zmienią się pliki w katalogu `shared/`
- Zmieni się plik workflow (`.github/workflows/*.yml`)

## Wymagania

- Projekty `backend` i `shared` muszą mieć prawidłowe `package.json` z dependencies
- `shared` musi mieć skrypt `build` 
- `backend` musi mieć skrypty `test` i `test:coverage`

## Uruchamianie lokalnie

```bash
# Shared package
cd shared
npm ci
npm run build

# Backend testy
cd backend  
npm ci
npm test
npm run test:coverage
``` 