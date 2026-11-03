import { describe, expect, it } from 'vitest';
import { getStage, neighbours, slugify, stagePaths, stages } from '../src/lib/curriculum';

describe('slugify', () => {
  it('lowercases and joins words with dashes', () => {
    expect(slugify('Islands and Client Directives')).toBe('islands-and-client-directives');
  });

  it('strips accents and punctuation, and trims dashes', () => {
    expect(slugify('  Résumé: <Astro> 101!  ')).toBe('resume-astro-101');
  });
});

describe('stages', () => {
  it('has seven stages numbered 1..7 in order', () => {
    expect(stages.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('has unique slugs', () => {
    expect(new Set(stages.map((s) => s.slug)).size).toBe(stages.length);
  });

  it('finds a stage by slug', () => {
    expect(getStage('islands-and-client-directives')?.number).toBe(3);
    expect(getStage('missing')).toBeUndefined();
  });

  it('links neighbours, with no previous for the first and no next for the last', () => {
    expect(neighbours(stages[0].slug).previous).toBeUndefined();
    expect(neighbours(stages[0].slug).next?.number).toBe(2);
    expect(neighbours(stages[6].slug).next).toBeUndefined();
    expect(neighbours('missing')).toEqual({});
  });

  it('returns one static path per stage with the stage as a prop', () => {
    const paths = stagePaths();
    expect(paths).toHaveLength(7);
    expect(paths[2]).toEqual({ params: { slug: stages[2].slug }, props: { stage: stages[2] } });
  });
});
