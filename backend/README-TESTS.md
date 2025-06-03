# Testy jednostkowe - Backend

Ten projekt używa **Jest** z **TypeScript** do testów jednostkowych.

## Struktura testów

```
backend/
├── src/
│   ├── __tests__/           # Globalne narzędzia testowe
│   │   └── test-utils.ts    # Pomocnicze funkcje do testów
│   ├── controllers/
│   │   ├── __tests__/       # Testy kontrolerów
│   │   │   └── *.test.ts
│   │   └── *.ts
│   └── ...
├── jest.config.js           # Konfiguracja Jest
└── coverage/               # Raporty pokrycia kodu (generowane automatycznie)
```

## Uruchamianie testów

### Podstawowe komendy

```bash
# Uruchom wszystkie testy
npm test

# Uruchom testy w trybie watch (automatyczne przeładowanie)
npm run test:watch

# Uruchom testy z raportem pokrycia kodu
npm run test:coverage
```

### Zainstaluj zależności (jeśli jeszcze nie zainstalowane)

```bash
npm install
```

## Przykład testu

```typescript
import { Request, Response } from 'express';
import { HealthController } from '../health-controller.js';
import { createMockRequest, createMockResponse } from '../../__tests__/test-utils.js';

describe('HealthController', () => {
  let controller: HealthController;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    controller = new HealthController();
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
  });

  it('should return health status', async () => {
    // Act
    await controller.getHealth(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          status: 'ok'
        })
      })
    );
  });
});
```

## Narzędzia testowe

### Test Utils (`src/__tests__/test-utils.ts`)

- `createMockRequest(options?)` - Tworzy mock obiektu Express Request
- `createMockResponse()` - Tworzy mock obiektu Express Response  
- `expectApiResponse(response, status, data)` - Pomocnik do sprawdzania odpowiedzi API

## Konfiguracja

### Jest (`jest.config.js`)

- **Preset**: `ts-jest/presets/default-esm` - Obsługa TypeScript z ESM
- **Test Environment**: `node` - Środowisko Node.js
- **Coverage**: Automatyczne raporty pokrycia kodu
- **Test Match**: `**/__tests__/**/*.test.ts` i `**/*.test.ts`

### Pokrycie kodu

Raporty pokrycia są generowane w katalogu `coverage/`:
- `coverage/lcov-report/index.html` - Raport HTML
- `coverage/lcov.info` - Format LCOV
- Terminal - Szybki przegląd w konsoli

## Dobre praktyki

1. **Nazewnictwo**: Pliki testów powinny kończyć się na `.test.ts`
2. **Struktura**: Grupuj testy w `describe` bloki
3. **Arrange-Act-Assert**: Używaj tej struktury w testach
4. **Mocking**: Używaj mocków dla zewnętrznych zależności
5. **Czytelność**: Opisowe nazwy testów
6. **Izolacja**: Każdy test powinien być niezależny

## Przykładowe scenariusze testowe

### Kontrolery Express

```typescript
it('should return 400 for invalid input', async () => {
  // Arrange
  const invalidRequest = createMockRequest({ body: {} });
  
  // Act
  await controller.create(invalidRequest, mockResponse);
  
  // Assert
  expect(mockResponse.status).toHaveBeenCalledWith(400);
});
```

### Serwisy

```typescript
it('should handle service errors gracefully', async () => {
  // Arrange
  const mockService = jest.fn().mockRejectedValue(new Error('Service error'));
  
  // Act & Assert
  await expect(service.getData()).rejects.toThrow('Service error');
});
```

### Async/Await

```typescript
it('should handle async operations', async () => {
  // Arrange
  const expectedData = { id: 1, name: 'Test' };
  
  // Act
  const result = await service.fetchData();
  
  // Assert
  expect(result).toEqual(expectedData);
});
``` 