/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov'],
      exclude: [...configDefaults.exclude, '*.cjs'],
    },
  },
});
