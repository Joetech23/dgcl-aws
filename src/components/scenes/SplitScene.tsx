'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Two columns held against each other: AWS versus customer, business versus
 * technical. The shape itself carries the teaching point, so both headings are
 * present from the start and only the items inside them arrive with the voice.
 */
export function SplitScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'split') return null

  return (
    <SlideFrame title={slide.title} titleAccent={slide.subtitle} sectionLabel={moduleLabel}>
      {data.intro && shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[88%] text-[clamp(0.66rem,1.4cqw,0.85rem)] leading-relaxed text-ink/65">
          {data.intro}
        </p>
      ) : null}

      <div className="mt-3 grid flex-1 grid-cols-2 gap-3">
        {[data.left, data.right].map((col) => (
          <div
            key={col.title}
            className="flex flex-col rounded-md border-2 bg-white p-2.5"
            style={{ borderColor: col.tint }}
          >
            <p
              className="mb-2 font-display text-[clamp(0.7rem,1.47cqw,0.92rem)] font-bold"
              style={{ color: col.tint }}
            >
              {col.title}
            </p>
            <ul className="space-y-1.5">
              {col.items.map((item) =>
                shown(item.id) ? (
                  <li key={item.id} className="anim-rise flex items-start gap-2">
                    <span
                      aria-hidden
                      className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45"
                      style={{ background: col.tint }}
                    />
                    <span className="min-w-0">
                      <span className="font-display text-[clamp(0.6rem,1.26cqw,0.78rem)] font-bold text-blue-deep">
                        {item.label}
                      </span>
                      {item.body ? (
                        <span className="block text-[clamp(0.55rem,1.12cqw,0.7rem)] leading-snug text-ink/60">
                          {item.body}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ) : (
                  <li
                    key={item.id}
                    className="h-[22px] rounded border border-dashed border-line/50 opacity-30"
                  />
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      {data.footnote && shown(data.footnote.id) ? (
        <p className="anim-rise mt-2 border-l-[3px] border-gold pl-3 text-[clamp(0.6rem,1.26cqw,0.78rem)] leading-relaxed text-ink/70">
          {data.footnote.text}
        </p>
      ) : null}
    </SlideFrame>
  )
}
