import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    watchExclude: ['**/node_modules/**', '**/dist/**'],
    hookTimeout: 60000,
    testTimeout: 60000,
    pool: 'forks',
    minThreads: 1,
    maxThreads: 4,
    retry: 2,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true
  }
});