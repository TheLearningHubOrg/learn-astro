// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Every route is prerendered to HTML at build time. No adapter is needed.
  output: 'static',
  // /stages/routing/ is written as dist/stages/routing/index.html.
  build: { format: 'directory' },
  server: {
    port: 4321,
    // Listen on 0.0.0.0 so the dev server is reachable from a container or VM.
    host: true,
  },
});
