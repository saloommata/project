// src/utils/color.ts
// Small color helpers for the runtime theme system. Kept dependency-free.

/**
 * Converts a hex color (#rgb, #rrggbb) to a space-separated "R G B" channel
 * triplet, e.g. "#06b6d4" -> "6 182 212". This is the format our Tailwind
 * theme colors expect (see tailwind.config.js), because `rgb(var(--x) / a)`
 * lets Tailwind's opacity modifiers (e.g. bg-primary/20) keep working.
 * Returns null for anything that isn't a recognizable hex color, so callers
 * can safely ignore malformed admin input instead of applying garbage CSS.
 */
export function hexToRgbChannels(hex: string | undefined | null): string | null {
  if (!hex || typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');

  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  if ([r, g, b].some(n => Number.isNaN(n))) return null;

  return `${r} ${g} ${b}`;
}
