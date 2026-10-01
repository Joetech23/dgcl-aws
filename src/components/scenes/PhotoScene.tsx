'use client'

import Image from 'next/image'
import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * A photograph with callouts.
 *
 * Used where the deck itself leans on a real image, such as the data centre
 * aerial. The photo sits under a soft navy wash so white callout cards stay
 * readable over any part of it, and each callout arrives with its line.
 */
export function PhotoScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'photo') return null

  return (
    <SlideFrame title={slide.title} titleAccent={slide.subtitle} sectionLabel={moduleLabel} chevron="none">
      <div className="relative mt-2 flex-1 overflow-hidden rounded-md">
        <Image
          src={data.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,60,0.82) 0%, rgba(0,0,60,0.55) 46%, rgba(0,0,60,0.15) 100%)',
          }}
        />

        <ul className="relative flex h-full max-w-[62%] flex-col justify-center gap-2 p-4">
          {data.points.map((p) =>
            shown(p.id) ? (
              <li
                key={p.id}
                className="anim-rise rounded-md border-l-[3px] border-gold bg-white/95 px-3 py-2 shadow-lift backdrop-blur-sm"
              >
                <p className="font-display text-[clamp(0.79rem,1.68cqw,1.03rem)] font-bold text-blue-deep">
                  {p.label}
                </p>
                {p.body ? (
                  <p className="mt-0.5 text-[clamp(0.66rem,1.34cqw,0.84rem)] leading-snug text-ink/65">
                    {p.body}
                  </p>
                ) : null}
              </li>
            ) : null,
          )}
        </ul>
      </div>

      {data.footnote && shown(data.footnote.id) ? (
        <p className="anim-rise mt-2 border-l-[3px] border-gold pl-3 text-[clamp(0.72rem,1.51cqw,0.94rem)] leading-relaxed text-ink/70">
          {data.footnote.text}
        </p>
      ) : null}
    </SlideFrame>
  )
}
