/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      enabled: true,
      exclude: [
        '**/coverage/**',
        '**/node_modules/**',
        '.eslintrc.cjs',
        'postcss.config.js',
        'tailwind.config.ts',
        '**/tests/*.{test}.{cjs,js,ts,tsx}'
      ],
      reporter: ['json', 'html']
    }
  }
});
