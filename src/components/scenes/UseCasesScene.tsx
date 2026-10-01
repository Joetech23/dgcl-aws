'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Common use cases. Deck slide 5.
 *
 * Their version was a checkmark bullet list. Ours reveals four use-case tiles
 * with a short caption on each, and a footer line that closes the story.
 */
const CASES = [
  {
    id: 'web',
    label: 'Web & mobile apps',
    line: 'Landing pages, dashboards, global social networks. Anything a browser opens.',
    icon: (
      <>
        <rect x="5" y="7" width="22" height="14" rx="2" fill="none" stroke="#000099" strokeWidth="1.8" />
        <path d="M5 11h22M9 9v-.01M12 9v-.01" stroke="#000099" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'analytics',
    label: 'Data analytics',
    line: 'Collect data, store it, query it. AWS covers every step of the pipeline.',
    icon: (
      <>
        <rect x="6" y="16" width="4" height="10" fill="#0000BC" />
        <rect x="13" y="10" width="4" height="16" fill="#0000BC" />
        <rect x="20" y="6" width="4" height="20" fill="#F5871F" />
      </>
    ),
  },
  {
    id: 'backup',
    label: 'Disaster recovery',
    line: 'A warm copy in another region so the business keeps running when things fail.',
    icon: (
      <>
        <path d="M16 5v16M9 14l7 8 7-8" stroke="#000099" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 26h20" stroke="#000099" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'ml',
    label: 'Machine learning',
    line: 'Train models on data that would drown a laptop, and serve them to millions.',
    icon: (
      <>
        <circle cx="10" cy="10" r="2.4" fill="#7A5AF8" />
        <circle cx="22" cy="10" r="2.4" fill="#7A5AF8" />
        <circle cx="10" cy="22" r="2.4" fill="#7A5AF8" />
        <circle cx="22" cy="22" r="2.4" fill="#7A5AF8" />
        <circle cx="16" cy="16" r="3" fill="#FFC000" />
        <path d="M10 10l6 6M22 10l-6 6M10 22l6-6M22 22l-6-6" stroke="#7A5AF8" strokeWidth="1.2" />
      </>
    ),
  },
]

export function UseCasesScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Common" titleAccent="Use Cases" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[70%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/60">
          What do people actually build. Four workloads account for most of it.
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 items-start gap-3">
        {CASES.map((c, i) => (
          <div key={c.id}>
            {shown(c.id) ? (
              <div
                className="anim-rise flex items-start gap-3 rounded-md border border-line bg-white p-3 shadow-lift"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate">
                  <svg viewBox="0 0 32 32" className="h-6 w-6">
                    {c.icon}
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[clamp(0.87rem,1.88cqw,1.06rem)] font-bold text-blue-deep">
                    {c.label}
                  </h3>
                  <p className="mt-0.5 text-[clamp(0.74rem,1.51cqw,0.9rem)] leading-snug text-ink/60">
                    {c.line}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[60px] rounded-md border border-dashed border-line/60 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
