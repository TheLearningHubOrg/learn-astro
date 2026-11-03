import type { APIRoute } from 'astro';
import { stages } from '../lib/curriculum';

// In static output this endpoint runs at build time and is written to
// dist/stages.json. With an adapter and `prerender = false` it would run per request.
export const GET: APIRoute = () =>
  Response.json(stages.map(({ number, slug, title }) => ({ number, slug, title, url: `/stages/${slug}/` })));
