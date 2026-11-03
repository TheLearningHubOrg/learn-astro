export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Stage {
  number: StageNumber;
  slug: string;
  title: string;
  summary: string;
  topics: readonly string[];
}

/**
 * Turns a title into a URL segment: lowercase ASCII, words joined by "-".
 * Accents are stripped first so "Résumé" becomes "resume", not "r-sum".
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stage(number: StageNumber, title: string, summary: string, topics: string[]): Stage {
  return { number, slug: slugify(title), title, summary, topics };
}

export const stages: readonly Stage[] = [
  stage(1, 'Setup and Rendering Model', 'Install Astro, read the project layout, and see why pages ship as HTML.', [
    'create-astro',
    'astro dev / build / preview',
    'src/pages file routing',
    'zero JavaScript by default',
  ]),
  stage(2, 'Components and Templates', 'Write .astro components with typed props, slots, scoped styles and layouts.', [
    'frontmatter fence',
    'Astro.props',
    'named slots',
    'scoped <style>',
  ]),
  stage(3, 'Islands and Client Directives', 'Ship JavaScript only where the page needs it, and choose when it loads.', [
    '<script> bundling',
    'client:load / idle / visible',
    'custom elements',
    'shared state',
  ]),
  stage(4, 'Routing and Content', 'Dynamic routes, content collections, loaders and data fetching.', [
    'getStaticPaths()',
    'content.config.ts',
    'glob() loader',
    'render()',
  ]),
  stage(5, 'Endpoints, Actions and Testing', 'Server endpoints, actions, middleware and component tests.', [
    'APIRoute',
    'astro:actions',
    'middleware',
    'Container API',
  ]),
  stage(6, 'Rendering Modes and Deployment', 'On-demand rendering, server islands, caching, images and adapters.', [
    'prerender = false',
    'server:defer',
    'adapters',
    'route caching',
  ]),
  stage(7, 'Staff Interview Handbook', 'Interview questions with full answers and a cheatsheet.', [
    'trade-offs',
    'internals',
    'debugging scenarios',
  ]),
];

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.slug === slug);
}

export interface Neighbours {
  previous?: Stage;
  next?: Stage;
}

export function neighbours(slug: string): Neighbours {
  const index = stages.findIndex((s) => s.slug === slug);
  if (index === -1) return {};
  return { previous: stages[index - 1], next: stages[index + 1] };
}

/** The value src/pages/stages/[slug].astro returns from getStaticPaths(). */
export function stagePaths() {
  return stages.map((s) => ({ params: { slug: s.slug }, props: { stage: s } }));
}
