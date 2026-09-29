'use client'

import { useEffect, useState } from 'react'
import { modules } from '@/content/modules'
import { Scene } from '@/components/scenes'
import { ScaledStage } from '@/components/player/ScaledStage'
import { IconPlay } from './icons'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/**
 * The real course, shown on the landing page.
 *
 * Renders actual slides from the lessons, fully revealed, and rotates through
 * a few of them. It is the product itself, not a screenshot or stock image,
 * so it stays true as the lessons change.
 */
const PICKS = [
  { id: 's15-global-infrastructure', caption: 'AWS runs in Regions around the world, each made of separate Availability Zones.' },
  { id: 'e22-user-data', caption: 'It updates the operating system, then installs the Apache web server.' },
  { id: 's14-six-advantages', caption: 'Stop guessing capacity. Scale up and down as demand changes.' },
]

const all = modules.flatMap((m) => m.slides.map((s) => ({ slide: s, module: m.number })))
const items = PICKS.map((p) => ({ ...p, ...all.find((a) => a.slide.id === p.id)! })).filter((p) => p.slide)

export function LessonPreview() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5200)
    return () => clearInterval(t)
  }, [])

  const cur = items[i]
  if (!cur) return null

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl bg-[#000728] p-2 shadow-stage ring-1 ring-black/5 sm:p-2.5">
        <div className="relative">
          {items.map((it, n) => (
            <div
              key={it.slide.id}
              aria-hidden={n !== i}
              className={`transition-opacity duration-700 ${n === i ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}
            >
              <ScaledStage className="w-full" fit="width">
                <Scene
                  slide={it.slide}
                  shown={() => true}
                  currentMs={600000}
                  moduleLabel={sectionLabel(it.module)}
                />
              </ScaledStage>
            </div>
          ))}
        </div>

        {/* A caption line and a transport, so it reads as a narrated lesson. */}
        <p key={cur.slide.id} className="anim-fade px-2 pt-3 text-[13px] leading-snug text-white/85 sm:text-[14px]">
          {cur.caption}
        </p>
        <div className="flex items-center gap-3 px-2 pb-1.5 pt-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-blue-deep">
            <IconPlay size={14} />
          </span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <div key={cur.slide.id} className="preview-progress absolute inset-y-0 left-0 rounded-full bg-gold" />
          </div>
          <span className="font-mono text-[11px] text-white/60">{moduleName(cur.module)}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
        {items.map((it, n) => (
          <span key={it.slide.id} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-6 bg-blue' : 'w-1.5 bg-line'}`} />
        ))}
      </div>
    </div>
  )
}
