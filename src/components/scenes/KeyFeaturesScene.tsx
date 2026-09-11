'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Key features. Deck slide 3.
 *
 * Their version was four checkbox bullets. Ours reveals four numbered cards
 * one line at a time, with an icon and a short line each. Same content in a
 * format the eye can scan.
 */
const FEATURES = [
  {
    id: 'scalability',
    n: '01',
    label: 'Scalability',
    line: 'Scale resources up or down with demand, without changing the architecture.',
    icon: (c: string) => (
      <path
        d="M6 20l4-4 4 4 8-10"
        stroke={c}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    id: 'cost',
    n: '02',
    label: 'Cost efficiency',
    line: 'Pay as you go. No long-term contracts, no charges for idle resources.',
    icon: (c: string) => (
      <>
        <circle cx="16" cy="16" r="9" stroke={c} strokeWidth="2.2" fill="none" />
        <text x="16" y="20.5" textAnchor="middle" fill={c} fontSize="12" fontWeight="700">$</text>
      </>
    ),
  },
  {
    id: 'global',
    n: '03',
    label: 'Global reach',
    line: 'Data centres across the world, so applications sit close to their users.',
    icon: (c: string) => (
      <>
        <circle cx="16" cy="16" r="10" stroke={c} strokeWidth="2.2" fill="none" />
        <ellipse cx="16" cy="16" rx="4" ry="10" stroke={c} strokeWidth="1.6" fill="none" />
        <path d="M6 16h20" stroke={c} strokeWidth="1.6" />
      </>
    ),
  },
  {
    id: 'security',
    n: '04',
    label: 'Security & compliance',
    line: 'Tools for identity, encryption, and network protection. You configure them.',
    icon: (c: string) => (
      <>
        <path
          d="M16 5l10 3v8c0 6-4.5 10-10 11-5.5-1-10-5-10-11V8l10-3z"
          stroke={c}
          strokeWidth="2.2"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M12 16l3 3 5-6" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

export function KeyFeaturesScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Key Features of AWS" titleAccent="Cloud Computing" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[75%] text-[clamp(0.68rem,1.47cqw,0.88rem)] leading-relaxed text-ink/60">
          Four ideas that come up in almost every AWS conversation.
        </p>
      ) : null}

      <div className="mt-4 grid flex-1 grid-cols-2 content-start gap-2.5">
        {FEATURES.map((f) => (
          <div key={f.id} className="min-h-0">
            {shown(f.id) ? (
              <div
                className="anim-rise relative flex items-start gap-3 overflow-hidden rounded-md p-3 shadow-lift"
                style={{ ['--card-tint' as string]: '#000099', animationDelay: '60ms' }}
              >                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gradient-to-br from-blue-deep to-blue-electric">
                  <svg viewBox="0 0 32 32" className="h-6 w-6">
                    {f.icon('#FFC000')}
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10.5px] font-semibold text-gold">{f.n}</span>
                    <h3 className="font-display text-[clamp(0.85rem,1.89cqw,1.05rem)] font-bold text-blue-deep">
                      {f.label}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-[clamp(0.65rem,1.33cqw,0.8rem)] leading-snug text-ink/65">
                    {f.line}
                  </p>
                </div>
              </div>
            ) : (
              // Placeholder so the grid does not jump as items arrive
              <div className="h-full min-h-[54px] rounded-md border border-dashed border-line/70 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
