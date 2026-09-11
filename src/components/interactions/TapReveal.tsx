'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { TapRevealSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

const COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-2 lg:grid-cols-3',
}

export function TapReveal({
  spec,
  onComplete,
}: {
  spec: TapRevealSpec
  onComplete: () => void
}) {
  const [open, setOpen] = useState<string[]>([])
  const done = open.length === spec.cards.length

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  // Clamped: a negative count means state leaked across slides. Showing 0
  // keeps the UI honest if that ever regresses.
  const remaining = Math.max(0, spec.cards.length - open.length)

  return (
    <Frame
      prompt={spec.prompt}
      done={done}
      status={`${remaining} of ${spec.cards.length} still to open.`}
    >
      <ul className={`grid grid-cols-1 gap-3 ${COLS[spec.columns ?? 3]}`}>
        {spec.cards.map((card) => {
          const isOpen = open.includes(card.id)
          return (
            <li key={card.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpen((prev) =>
                    prev.includes(card.id) ? prev : [...prev, card.id],
                  )
                }
                className={`group relative flex h-full w-full flex-col items-start gap-2 border p-4 text-left transition-colors ${
                  isOpen
                    ? 'border-blue/40 bg-blue/[0.05]'
                    : 'border-line bg-slate hover:border-blue/50 hover:bg-white'
                }`}
              >
                {/* Corner tick: an unopened card reads as a component not yet
                    wired into the diagram. */}
                <span
                  aria-hidden
                  className={`absolute right-0 top-0 h-2 w-2 ${
                    isOpen ? 'bg-blue' : 'bg-line group-hover:bg-blue/60'
                  }`}
                />
                <span className="font-display text-[15px] font-semibold leading-tight tracking-tight text-blue-deep">
                  {card.label}
                </span>

                <AnimatePresence initial={false} mode="wait">
                  {isOpen ? (
                    <motion.span
                      key="body"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[13px] leading-relaxed text-ink/60"
                    >
                      {card.body}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="teaser"
                      exit={{ opacity: 0 }}
                      className="font-mono text-[11px] tracking-wide text-ink/45"
                    >
                      {card.teaser ?? 'Tap to open'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}
