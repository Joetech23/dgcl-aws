'use client'

import { useEffect, useState } from 'react'
import type { PathChoiceSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

/** Opening question of the course. The answer is stored and shapes later copy. */
export function PathChoice({
  spec,
  onComplete,
  onChoose,
}: {
  spec: PathChoiceSpec
  onComplete: () => void
  onChoose?: (id: string) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    if (picked) onComplete()
  }, [picked, onComplete])

  const chosen = spec.choices.find((c) => c.id === picked)

  return (
    <Frame prompt={spec.prompt} done={Boolean(picked)} status="Pick the one that fits you.">
      <div className="grid gap-3 sm:grid-cols-2">
        {spec.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={picked === c.id}
            onClick={() => {
              setPicked(c.id)
              onChoose?.(c.id)
            }}
            className={`border p-4 text-left transition-colors ${
              picked === c.id
                ? 'border-blue bg-blue/[0.09]'
                : 'border-line bg-slate hover:border-blue/50 hover:bg-white'
            }`}
          >
            <span className="block font-display text-[15px] font-semibold tracking-tight text-blue-deep">
              {c.label}
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-ink/60">{c.body}</span>
          </button>
        ))}
      </div>
      {chosen ? (
        <p className="mt-3 font-mono text-[11px] text-mint">
          Noted — the course will lean on examples that suit you.
        </p>
      ) : null}
    </Frame>
  )
}
