import type { Config } from 'tailwindcss'

/**
 * DGCL's real palette, not an invented one.
 *
 * Sourced by frequency-counting the explicit colours in the source deck
 * (ppt/slides/*.xml) and cross-checked against the live CSS on dgclgroup.com,
 * where the primary blue resolves to rgb(1, 0, 192).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Dark mode is a class on <html>, set by the theme toggle. The neutral
  // colours below are CSS variables (globals.css) so one class swaps them all.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: 'rgb(var(--blue) / <alpha-value>)', // #000099: 56 uses in the deck
          deep: '#000066', // 34 uses — logo ground
          darker: '#002060',
          electric: 'rgb(var(--blue-electric) / <alpha-value>)', // #0000BC, the live site
          lift: '#1B1AFF',
        },
        gold: '#FFC000', // the deck's accent, and our lead accent
        ember: '#F5871F', // used sparingly; the incumbent's chrome leans on it
        ink: 'rgb(var(--ink) / <alpha-value>)',
        slate: 'rgb(var(--slate) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        paper: '#FFFFFF',
        /** Cards and page surfaces: white in light mode, deep navy in dark. */
        surface: 'rgb(var(--surface) / <alpha-value>)',
        mint: '#12B981',
        rose: '#E5484D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { tightest: '-0.035em' },
      boxShadow: {
        stage: '0 24px 70px -24px rgba(0, 0, 102, 0.45)',
        lift: '0 10px 30px -12px rgba(0, 0, 102, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
