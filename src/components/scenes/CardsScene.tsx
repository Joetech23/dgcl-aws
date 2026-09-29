'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * A grid of numbered cards, revealed one at a time as the narrator names them.
 *
 * This is the workhorse layout for the back half of the deck, where most
 * slides are a title and a list. A card that has not arrived yet leaves a
 * dashed placeholder so the grid never jumps as items appear.
 */
export function CardsScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'cards') return null
  const cols = data.columns ?? 3
  const colClass =
    cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3'

  return (
    <SlideFrame title={slide.title} titleAccent={slide.subtitle} sectionLabel={moduleLabel}>
      {data.intro && shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[88%] text-[clamp(0.66rem,1.4cqw,0.85rem)] leading-relaxed text-ink/65">
          {data.intro}
        </p>
      ) : null}

      <div className={`mt-3 grid flex-1 ${colClass} content-start gap-2.5`}>
        {data.cards.map((c, i) => {
          const tint = c.tint ?? '#000099'
          if (!shown(c.id)) {
            return (
              <div
                key={c.id}
                className="min-h-[58px] rounded-md border-2 border-dashed border-line/60 opacity-30"
              />
            )
          }
          return (
            <div
              key={c.id}
              className="anim-rise flex gap-2.5 rounded-md border-2 bg-white p-2.5 shadow-lift"
              style={{ borderColor: tint }}
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10.5px] font-bold text-white"
                style={{ background: tint }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                {c.eyebrow ? (
                  <p
                    className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: tint }}
                  >
                    {c.eyebrow}
                  </p>
                ) : null}
                <h3 className="font-display text-[clamp(0.68rem,1.4cqw,0.88rem)] font-bold leading-tight text-blue-deep">
                  {c.label}
                </h3>
                {c.body ? (
                  <p className="mt-0.5 text-[clamp(0.56rem,1.15cqw,0.72rem)] leading-snug text-ink/60">
                    {c.body}
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {data.footnote && shown(data.footnote.id) ? (
        <p className="anim-rise mt-2 border-l-[3px] border-gold pl-3 text-[clamp(0.6rem,1.26cqw,0.78rem)] leading-relaxed text-ink/70">
          {data.footnote.text}
        </p>
      ) : null}
    </SlideFrame>
  )
}
