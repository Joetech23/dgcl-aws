'use client'

import type { ReactNode } from 'react'

/**
 * Shared chrome for every activity: the instruction, and a status line that
 * says in plain words what still stands between the learner and the rest of the
 * narration. Never "incomplete" — always the specific thing left to do.
 */
export function Frame({
  prompt,
  status,
  done,
  children,
}: {
  prompt: string
  status?: string
  done: boolean
  children: ReactNode
}) {
  return (
    <section aria-label="Activity">
      <p className="mb-3 text-[clamp(0.78rem,1.15vw,0.95rem)] font-medium leading-snug text-blue-deep">
        {prompt}
      </p>

      {children}

      <div
        className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-wide"
        role="status"
        aria-live="polite"
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-mint' : 'bg-blue-electric'}`}
        />
        <span className={done ? 'text-mint' : 'text-ink/50'}>
          {done ? 'Done. The narration will pick up again.' : (status ?? 'Not finished yet.')}
        </span>
      </div>
    </section>
  )
}
