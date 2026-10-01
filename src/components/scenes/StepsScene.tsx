'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * A left-to-right process, for the slides that describe a journey rather than
 * a list: assess, mobilise, migrate. A flowing dashed line runs between the
 * steps so the direction of travel is obvious at a glance.
 */
export function StepsScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'steps') return null

  return (
    <SlideFrame title={slide.title} titleAccent={slide.subtitle} sectionLabel={moduleLabel}>
      {data.intro && shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[88%] text-[clamp(0.79rem,1.68cqw,1.02rem)] leading-relaxed text-ink/65">
          {data.intro}
        </p>
      ) : null}

      <div className="relative mt-5 flex flex-1 items-start gap-2">
        {/* the track the steps sit on */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[18px] h-2 w-full"
          viewBox="0 0 800 8"
          preserveAspectRatio="none"
        >
          <line
            x1="20"
            y1="4"
            x2="780"
            y2="4"
            stroke="#8C99B4"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            className="flow-line"
          />
        </svg>

        {data.steps.map((s, i) => {
          const tint = s.tint ?? '#000099'
          const visible = shown(s.id)
          return (
            <div key={s.id} className="relative z-10 flex flex-1 flex-col items-center text-center">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-white font-mono text-[13.5px] font-bold shadow-lift transition-all duration-500 ${
                  visible ? 'text-white' : 'text-ink/30'
                }`}
                style={{ background: visible ? tint : '#E6EAF3' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {visible ? (
                <div className="anim-rise mt-2 w-full rounded-md border-2 bg-white p-2.5 shadow-lift" style={{ borderColor: tint }}>
                  <h3
                    className="font-display text-[clamp(0.82rem,1.76cqw,1.08rem)] font-bold leading-tight"
                    style={{ color: tint }}
                  >
                    {s.label}
                  </h3>
                  {s.body ? (
                    <p className="mt-1 text-[clamp(0.66rem,1.34cqw,0.84rem)] leading-snug text-ink/60">
                      {s.body}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-2 h-[72px] w-full rounded-md border-2 border-dashed border-line/60 opacity-30" />
              )}
            </div>
          )
        })}
      </div>

      {data.footnote && shown(data.footnote.id) ? (
        <p className="anim-rise mt-2 border-l-[3px] border-gold pl-3 text-[clamp(0.72rem,1.51cqw,0.94rem)] leading-relaxed text-ink/70">
          {data.footnote.text}
        </p>
      ) : null}
    </SlideFrame>
  )
}
