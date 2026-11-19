/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Theme tokens backed by CSS variables (see src/index.css). Values are
      // set at runtime from store settings (src/context/appcontext.tsx), so
      // `bg-primary`, `text-accent`, `border-border`, etc. repaint instantly
      // when an admin changes brand colors — no rebuild needed. The
      // `rgb(var(...) / <alpha-value>)` form keeps opacity modifiers like
      // `bg-primary/20` working.
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        surface: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      // Ryvano's brand typography (see /home/claude/ryvano-assets/README.txt):
      // Fraunces for display/headings, IBM Plex Sans for body/UI, IBM Plex
      // Mono for small labels/spec-style text (prices, hours, tags).
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(43 28 18 / 0.04), 0 8px 24px -8px rgb(43 28 18 / 0.12)',
        lift: '0 2px 4px rgb(43 28 18 / 0.06), 0 16px 40px -12px rgb(43 28 18 / 0.22)',
      },
    },
  },
  plugins: [],
};
