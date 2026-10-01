'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Deployment models. Deck slides 11 and 12.
 *
 * Their version was a static list. Ours reveals four brand-coloured cards as
 * the narrator names them, and hands the learner a drag-and-drop where they
 * place four real businesses.
 */
const MODELS = [
  {
    id: 'private',
    name: 'Private',
    reveal: 'private',
    tint: '#000099',
    line: 'Your own data centre. Your systems, your servers, your building.',
    tag: 'Total control, and the total bill',
  },
  {
    id: 'public',
    name: 'Public',
    reveal: 'public',
    tint: '#0000BC',
    line: 'Amazon, Microsoft, or Google run it. You rent what you need.',
    tag: 'Public means anyone may rent, not that your data is visible',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    reveal: 'hybrid-multi',
    tint: '#7A5AF8',
    line: 'The sensitive part stays in-house. The rest is rented.',
    tag: 'Where the regulator draws the line',
  },
  {
    id: 'multi',
    name: 'Multi',
    reveal: 'hybrid-multi',
    tint: '#F5871F',
    line: 'Work spread across more than one provider.',
    tag: 'So one provider’s bad day is not your bad day',
  },
]

export function DeploymentModelsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="The Different Types of" titleAccent="Cloud Computing" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[80%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/60">
          Which model a business chooses comes down to what the law demands and what they can afford to hand over.
        </p>
      ) : null}

      <div className={`grid ${compact ? 'mt-3' : 'mt-5'} grid-cols-4 items-start gap-2.5`}>
        {MODELS.map((m, i) => {
          const isVisible = shown(m.reveal)
          return (
            <div key={m.id}>
              {isVisible ? (
                <div
                  className="anim-rise relative flex flex-col overflow-hidden rounded-lg p-3.5 shadow-lift"
                  style={{
                    ['--card-tint' as string]: m.tint,
                    background: `linear-gradient(180deg, #ffffff, ${m.tint}0d)`,
                    animationDelay: `${(m.reveal === 'hybrid-multi' ? i - 2 : 0) * 120}ms`,
                  }}
                >                  <div className="flex items-center gap-2">
                    <LockCloud color={m.tint} />
                    <span
                      className="font-display text-[clamp(0.9rem,2.2cqw,1.23rem)] font-bold"
                      style={{ color: m.tint }}
                    >
                      {m.name}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[clamp(0.76rem,1.6cqw,0.94rem)] leading-snug text-ink/75">
                    {m.line}
                  </p>
                  <div
                    className="my-2 h-px w-full"
                    style={{ background: `linear-gradient(90deg, ${m.tint}55, transparent)` }}
                  />
                  <p className="text-[clamp(0.66rem,1.38cqw,0.82rem)] leading-snug text-ink/50">
                    {m.tag}
                  </p>
                </div>
              ) : (
                <div className="min-h-[100px] rounded-lg border-2 border-dashed border-line/60 opacity-30" />
              )}
            </div>
          )
        })}
      </div>
    </SlideFrame>
  )
}

function LockCloud({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0">
      <circle cx="16" cy="16" r="15" fill={color} opacity="0.1" />
      <path
        d="M10.5 20.5h11a3.6 3.6 0 0 0 .5-7.16 5.2 5.2 0 0 0-9.9-1.3 3.9 3.9 0 0 0-1.6 8.46Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <rect x="13.6" y="15" width="4.8" height="4" rx="1" fill={color} />
      <path d="M14.6 15v-1.2a1.4 1.4 0 0 1 2.8 0V15" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}
