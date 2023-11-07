import type { HighlightTextRef } from './HighlightText';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}
export type { HighlightTextRef };
export { default as HighlightText } from './HighlightText';
