# Tests

This project uses **Jest** with **TypeScript** for unit testing.

## Test Structure

```
backend/
│
├── src/
│   ├── __tests__/           # Global test tools
│   │   └── test-utils.ts    # Helper functions for tests
│   │
│   ├── controllers/
│   │   ├── __tests__/       # Controller tests
│   │   │   └── githubController.test.ts
│   │
│   ├── services/
│   │   ├── __tests__/       # Service tests
│   │   │   └── githubService.test.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (automatic reload)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Install dependencies (if not already installed)
```bash
npm install
```

## Test Example

```typescript
import request from 'supertest';
import { app } from '../app';

describe('GET /api/repositories', () => {
  it('should return a list of repositories', async () => {
    const response = await request(app)
      .get('/api/repositories')
      .expect(200);

    expect(response.body).toHaveProperty('length');
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('url');
  });
});

describe('GET /api/repositories/:repoId/developers', () => {
  it('should return developers for a specific repository', async () => {
    const repoId = 'test-repo';
    
    const response = await request(app)
      .get(`/api/repositories/${repoId}/developers`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    }
  });
});
```

## Test Tools

The project uses the following configuration:

```json
{
  "preset": "ts-jest/presets/default-esm",
  "testEnvironment": "node",
  "extensionsToTreatAsEsm": [".ts"],
  "globals": {
    "ts-jest": {
      "useESM": true
    }
  }
}
```

- **Preset**: `ts-jest/presets/default-esm` - TypeScript support with ESM
- **Test Environment**: `node` - Node.js environment

## Coverage

Coverage reports are generated automatically when you run:
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory:
- **HTML** - Open `coverage/lcov-report/index.html` in browser
- **Terminal** - Quick overview in console

## Best Practices

1. **Naming**: Test files should end with `.test.ts`
2. **Organization**: Group tests by functionality
3. **Arrange-Act-Assert**: Use this structure in tests
4. **Mocking**: Use mocks for external dependencies
5. **Readability**: Descriptive test names
6. **Isolation**: Each test should be independent

## Example Test Scenarios

- API endpoint testing
- Service logic testing
- Error handling testing
- Data validation testing 