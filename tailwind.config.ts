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
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#000099', // 56 uses in the deck — the dominant brand colour
          deep: '#000066', // 34 uses — logo ground
          darker: '#002060',
          electric: '#0000BC', // matches the live site
          lift: '#1B1AFF',
        },
        gold: '#FFC000', // the deck's accent, and our lead accent
        ember: '#F5871F', // used sparingly; the incumbent's chrome leans on it
        ink: '#0B1020',
        slate: '#F4F6FB',
        mist: '#8C99B4',
        line: '#DEE4F0',
        paper: '#FFFFFF',
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
