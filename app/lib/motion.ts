/**
 * Delay (ms) for the i-th item in a staggered entrance, capped so long lists
 * don't take forever to finish revealing. Use with <Reveal delay={stagger(i)}>.
 */
export function stagger(index: number, step = 80, max = 480): number {
  return Math.min(index * step, max);
}
