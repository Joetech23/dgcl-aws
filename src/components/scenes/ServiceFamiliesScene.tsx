'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Wide range of services. Deck slide 4.
 *
 * Cards use the shared `card-premium` treatment: gradient border, corner marks,
 * inner highlight. Each family reveals in step with the narrator naming it.
 */
const FAMILIES = [
  {
    id: 'compute',
    label: 'Compute',
    tint: '#F5871F',
    services: ['EC2', 'Lambda'],
    icon: (c: string) => (
      <>
        <rect x="5" y="8" width="22" height="14" rx="2" fill={c} opacity="0.15" />
        <rect x="5" y="8" width="22" height="14" rx="2" stroke={c} strokeWidth="1.8" fill="none" />
        <path d="M10 25h12" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10 12h6M10 15h9M10 18h4" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'storage',
    label: 'Storage',
    tint: '#000099',
    services: ['S3', 'EBS'],
    icon: (c: string) => (
      <>
        <ellipse cx="16" cy="9" rx="9" ry="3" fill={c} opacity="0.15" stroke={c} strokeWidth="1.6" />
        <path d="M7 9v14a9 3 0 0 0 18 0V9" fill="none" stroke={c} strokeWidth="1.6" />
        <path d="M7 15a9 3 0 0 0 18 0M7 21a9 3 0 0 0 18 0" fill="none" stroke={c} strokeWidth="1.4" opacity="0.6" />
      </>
    ),
  },
  {
    id: 'database',
    label: 'Databases',
    tint: '#0000BC',
    services: ['RDS', 'DynamoDB', 'Aurora'],
    icon: (c: string) => (
      <>
        <circle cx="16" cy="16" r="10" fill={c} opacity="0.12" stroke={c} strokeWidth="1.6" />
        <path d="M10 12h12M10 16h12M10 20h12" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 6c3 4 3 16 0 20M16 6c-3 4-3 16 0 20" fill="none" stroke={c} strokeWidth="1.3" />
      </>
    ),
  },
  {
    id: 'ml',
    label: 'Machine learning',
    tint: '#7A5AF8',
    services: ['SageMaker', 'Bedrock'],
    icon: (c: string) => (
      <>
        <circle cx="10" cy="10" r="2.6" fill={c} opacity="0.7" />
        <circle cx="22" cy="10" r="2.6" fill={c} opacity="0.7" />
        <circle cx="10" cy="22" r="2.6" fill={c} opacity="0.7" />
        <circle cx="22" cy="22" r="2.6" fill={c} opacity="0.7" />
        <circle cx="16" cy="16" r="3.4" fill="#FFC000" stroke={c} strokeWidth="1.6" />
        <path d="M10 10l6 6M22 10l-6 6M10 22l6-6M22 22l-6-6" stroke={c} strokeWidth="1.2" />
      </>
    ),
  },
]

export function ServiceFamiliesScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame
      eyebrow="200+ services"
      title="Grouped into"
      titleAccent="four families"
     compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[70%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/60">
          Two hundred services sounds a lot. Almost all of them are one of these four.
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-4 items-start gap-3">
        {FAMILIES.map((f, i) => (
          <div key={f.id}>
            {shown(f.id) ? (
              <div
                className="anim-rise flex flex-col rounded-md border-2 bg-white p-3.5 shadow-lift"
                style={{
                  borderColor: f.tint,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                    style={{ background: `${f.tint}12` }}
                  >
                    <svg viewBox="0 0 32 32" className="h-6 w-6">
                      {f.icon(f.tint)}
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                      0{i + 1}
                    </p>
                    <h3
                      className="font-display text-[clamp(0.9rem,2.04cqw,1.18rem)] font-bold leading-tight"
                      style={{ color: f.tint }}
                    >
                      {f.label}
                    </h3>
                  </div>
                </div>

                <div
                  className="my-2 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${f.tint}55, transparent)`,
                  }}
                />

                <ul className="space-y-1">
                  {f.services.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-1.5 font-mono text-[12.5px] text-ink/65"
                    >
                      <span className="text-gold">›</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="min-h-[130px] rounded-lg border-2 border-dashed border-line/60 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
