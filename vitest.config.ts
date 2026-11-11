// Minimal vitest config without importing 'vitest/config' to avoid type resolution when dev-deps aren't installed.
// If you install vitest, you can revert to the standard `defineConfig` import.

export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    passWithNoTests: true,
  },
} as any;