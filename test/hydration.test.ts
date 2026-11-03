import { describe, expect, it } from 'vitest';
import { chooseDirective, directives } from '../src/lib/hydration';
import { nextCount } from '../src/lib/counter';

describe('chooseDirective', () => {
  it('ships no JavaScript for static components', () => {
    expect(chooseDirective({ interactive: false, aboveFold: true, critical: true })).toBe('none');
  });

  it('uses client:only for browser-only components', () => {
    expect(chooseDirective({ interactive: true, browserOnly: true })).toBe('client:only');
  });

  it('uses client:media when the widget only exists at some sizes', () => {
    expect(chooseDirective({ interactive: true, media: '(max-width: 50em)' })).toBe('client:media');
  });

  it('loads critical above-the-fold controls immediately', () => {
    expect(chooseDirective({ interactive: true, aboveFold: true, critical: true })).toBe('client:load');
  });

  it('defers non-critical above-the-fold widgets to idle time', () => {
    expect(chooseDirective({ interactive: true, aboveFold: true })).toBe('client:idle');
  });

  it('defers below-the-fold widgets until they are visible', () => {
    expect(chooseDirective({ interactive: true })).toBe('client:visible');
  });

  it('documents every directive it can return', () => {
    const documented = directives.map((d) => d.directive);
    expect(documented).toEqual(
      expect.arrayContaining(['none', 'client:load', 'client:idle', 'client:visible', 'client:media', 'client:only']),
    );
  });
});

describe('nextCount', () => {
  const options = { start: 2, min: 0, max: 5 };

  it('steps up and down', () => {
    expect(nextCount(2, { type: 'step', by: 1 }, options)).toBe(3);
    expect(nextCount(2, { type: 'step', by: -1 }, options)).toBe(1);
  });

  it('clamps to min and max', () => {
    expect(nextCount(5, { type: 'step', by: 1 }, options)).toBe(5);
    expect(nextCount(0, { type: 'step', by: -1 }, options)).toBe(0);
  });

  it('resets to the start value', () => {
    expect(nextCount(4, { type: 'reset' }, options)).toBe(2);
  });

  it('is unbounded when min and max are omitted', () => {
    expect(nextCount(1_000, { type: 'step', by: 1 }, { start: 0 })).toBe(1_001);
  });
});
