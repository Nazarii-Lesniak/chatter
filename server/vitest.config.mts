import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 15_000,
    env: {
      JWT_SECRET: 'test-secret',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    },
  },
});
