'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * The six advantages. Deck slide 16.
 *
 * A radial layout with a central cloud and six numbered advantages arranged
 * around it, revealing in order as the narrator names each one.
 */
const ADVANTAGES = [
  { id: 'a1', n: '01', label: 'Trade capex for opex', tint: '#F5871F' },
  { id: 'a2', n: '02', label: 'Massive economies of scale', tint: '#000099' },
  { id: 'a3', n: '03', label: 'Stop guessing capacity', tint: '#0000BC' },
  { id: 'a4', n: '04', label: 'Speed and agility', tint: '#7A5AF8' },
  { id: 'a5', n: '05', label: 'Focus, not data centres', tint: '#12B981' },
  { id: 'a6', n: '06', label: 'Global in minutes', tint: '#F5871F' },
]

export function SixAdvantagesScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="The Six Advantages" titleAccent="of Cloud Computing" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/65">
          Straight out of the AWS whitepaper. Worth memorising for the exam.
        </p>
      ) : null}

      <div className="mt-4 grid flex-1 grid-cols-3 content-start gap-2.5">
        {ADVANTAGES.map((a) => (
          <div key={a.id}>
            {shown(a.id) ? (
              <div
                className="anim-rise flex items-center gap-2.5 rounded-md border-2 bg-white p-2.5 shadow-lift"
                style={{ borderColor: a.tint }}
              >
                <span
                  className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold text-white"
                  style={{ background: a.tint }}
                >
                  <span
                    className="pulse-ring absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 0 2px ${a.tint}55` }}
                    aria-hidden
                  />
                  {a.n}
                </span>
                <span className="font-display text-[clamp(0.74rem,1.6cqw,0.94rem)] font-semibold leading-tight text-blue-deep">
                  {a.label}
                </span>
              </div>
            ) : (
              <div className="min-h-[52px] rounded-md border-2 border-dashed border-line/60 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
