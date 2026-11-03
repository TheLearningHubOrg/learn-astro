/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig() loads astro.config.mjs and the Astro Vite plugins, so test
// files can import .astro components and render them with the Container API.
export default getViteConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
