'use client'

import { useEffect, useState } from 'react'
import type { StackExplorerSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

/**
 * The model switcher for "who is responsible for what".
 *
 * It deliberately does NOT draw the stack. The stack lives on the slide behind
 * this panel and is driven by `onModelChange`, so the learner is manipulating
 * the diagram they are already looking at rather than a second copy of it that
 * could disagree with the first.
 */
export function StackExplorer({
  spec,
  onComplete,
  onModelChange,
}: {
  spec: StackExplorerSpec
  onComplete: () => void
  onModelChange?: (index: number) => void
}) {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<number[]>([0])
  const done = seen.length === spec.models.length
  const model = spec.models[active]

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  // Keep the slide in step, including on first mount.
  useEffect(() => {
    onModelChange?.(active)
  }, [active, onModelChange])

  const left = Math.max(0, spec.models.length - seen.length)

  return (
    <Frame
      prompt={spec.prompt}
      done={done}
      status={left === 0 ? 'All four seen.' : `${left} model${left === 1 ? '' : 's'} left to look at.`}
    >
      <div role="tablist" aria-label="Service model" className="flex flex-wrap gap-2">
        {spec.models.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={active === i}
            onClick={() => {
              setActive(i)
              setSeen((prev) => (prev.includes(i) ? prev : [...prev, i]))
            }}
            className={`relative rounded-md border px-3.5 py-2 text-[13px] font-medium transition ${
              active === i
                ? 'border-blue bg-blue text-white shadow-lift'
                : 'border-line bg-white text-blue-deep hover:border-blue/50 hover:bg-slate'
            }`}
          >
            {m.label}
            {seen.includes(i) && active !== i ? (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-mint"
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-line bg-slate p-3">
        <p className="text-[13px] leading-relaxed text-ink/75">{model.note}</p>
      </div>
    </Frame>
  )
}
