import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Card from '../src/components/Card.astro';
import Counter from '../src/components/Counter.astro';
import StageNav from '../src/components/StageNav.astro';
import StagePage from '../src/pages/stages/[slug].astro';
import { GET } from '../src/pages/stages.json';
import { stages } from '../src/lib/curriculum';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('Card.astro', () => {
  it('renders props and the default badge', async () => {
    const html = await container.renderToString(Card, {
      props: { title: 'Props', stage: 'Stage 2', description: 'Typed inputs' },
    });
    expect(html).toContain('Props');
    expect(html).toContain('Stage 2');
    expect(html).toContain('Core');
    expect(html).not.toContain('<footer');
  });

  it('wraps the title in a link when href is set', async () => {
    const html = await container.renderToString(Card, {
      props: { title: 'Linked', stage: 'Stage 1', description: 'x', href: '/stages/a/' },
    });
    expect(html).toMatch(/<a href="\/stages\/a\/"[^>]*>Linked<\/a>/);
  });

  it('renders default and named slots', async () => {
    const html = await container.renderToString(Card, {
      props: { title: 'Slots', stage: 'Stage 2', description: 'x' },
      slots: { default: '<em>body</em>', footer: 'footnote' },
    });
    expect(html).toContain('<em>body</em>');
    expect(html).toMatch(/<footer[^>]*>[\s\S]*footnote[\s\S]*<\/footer>/);
  });
});

describe('Counter.astro', () => {
  it('server-renders the starting value inside the custom element', async () => {
    const html = await container.renderToString(Counter, { props: { label: 'Clicks', start: 3, max: 5 } });
    expect(html).toContain('<counter-island');
    expect(html).toContain('data-start="3"');
    expect(html).toContain('data-max="5"');
    expect(html).not.toContain('data-min');
    expect(html).toMatch(/<output[^>]*>3<\/output>/);
  });
});

describe('StageNav.astro', () => {
  it('links to the previous and next stage', async () => {
    const html = await container.renderToString(StageNav, { props: { slug: stages[1].slug } });
    expect(html).toContain(`href="/stages/${stages[0].slug}/"`);
    expect(html).toContain(`href="/stages/${stages[2].slug}/"`);
  });
});

describe('stages/[slug].astro', () => {
  it('renders a full page for one stage', async () => {
    const stage = stages[2];
    const html = await container.renderToString(StagePage, {
      props: { stage },
      params: { slug: stage.slug },
      partial: false,
    });
    expect(html).toMatch(/^<!DOCTYPE html>/i);
    expect(html).toContain(`<title>Stage 3: ${stage.title}</title>`);
    expect(html).toContain(`<code>${stage.slug}</code>`);
  });
});

describe('GET /stages.json', () => {
  it('returns JSON for every stage', async () => {
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.headers.get('content-type')).toContain('application/json');
    const body = (await response.json()) as Array<{ number: number; url: string }>;
    expect(body).toHaveLength(7);
    expect(body[0].url).toBe(`/stages/${stages[0].slug}/`);
  });
});
