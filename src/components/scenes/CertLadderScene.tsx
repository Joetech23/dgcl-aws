'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * AWS certification path. Deck slide 7.
 *
 * Their version was a full-bleed screenshot of the AWS certification chart,
 * which is Amazon's own artwork. Ours rebuilds the ladder in SVG using the
 * same tiers and colour language, so the picture is ours to ship and the
 * layers reveal in step with the narration.
 */

const LEVELS = [
  {
    id: 'specialty',
    label: 'Specialty',
    tint: '#7A5AF8',
    subtitle: 'Narrow, deep expertise',
    exams: 'Security · Machine Learning · Networking',
  },
  {
    id: 'professional',
    label: 'Professional',
    tint: '#12B981',
    subtitle: 'Two years of experience',
    exams: 'Solutions Architect Pro · DevOps Engineer',
  },
  {
    id: 'associate',
    label: 'Associate',
    tint: '#0000BC',
    subtitle: 'One year of experience',
    exams: 'Solutions Architect · Developer · SysOps',
  },
  {
    id: 'foundational',
    label: 'Foundational',
    tint: '#000099',
    subtitle: 'Six months of knowledge',
    exams: 'Cloud Practitioner',
    marker: 'You are here',
  },
]

export function CertLadderScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="AWS" titleAccent="Certification Path" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[75%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/60">
          Four tiers that map to how much experience you have on AWS.
        </p>
      ) : null}

      <ol className="mt-4 flex flex-1 flex-col-reverse gap-2">
        {LEVELS.map((lv, i) => {
          const isVisible = shown(lv.id)
          const width = 60 + (LEVELS.length - i) * 8
          return (
            <li key={lv.id}>
              {isVisible ? (
                <div
                  className="anim-rise flex items-center gap-3 rounded-md border-2 bg-white px-3 py-2 shadow-lift"
                  style={{
                    borderColor: lv.tint,
                    width: `${width}%`,
                    animationDelay: '80ms',
                  }}
                >
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold text-white"
                    style={{ background: lv.tint }}
                  >
                    {String(LEVELS.length - i).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3
                        className="font-display text-[clamp(0.9rem,2.12cqw,1.18rem)] font-bold"
                        style={{ color: lv.tint }}
                      >
                        {lv.label}
                      </h3>
                      <span className="font-mono text-[12px] text-ink/45">{lv.subtitle}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[clamp(0.72rem,1.55cqw,0.91rem)] text-ink/60">
                      {lv.exams}
                    </p>
                  </div>
                  {lv.marker ? (
                    <span
                      className="rounded-full bg-gold px-2 py-0.5 font-mono text-[12px] font-bold uppercase tracking-wide text-blue-deep"
                    >
                      {lv.marker}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div
                  className="h-[42px] rounded-md border-2 border-dashed border-line/60 opacity-30"
                  style={{ width: `${width}%` }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </SlideFrame>
  )
}
