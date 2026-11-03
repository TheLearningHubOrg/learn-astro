export type CounterAction = { type: 'step'; by: number } | { type: 'reset' };

export interface CounterOptions {
  start: number;
  min?: number;
  max?: number;
}

/** Pure state transition used by the <counter-island> custom element. */
export function nextCount(current: number, action: CounterAction, options: CounterOptions): number {
  const value = action.type === 'reset' ? options.start : current + action.by;
  const min = options.min ?? Number.NEGATIVE_INFINITY;
  const max = options.max ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, value));
}
