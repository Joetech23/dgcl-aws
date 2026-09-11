'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { HotspotSpec } from '@/lib/lesson/types'
import { CertLadder } from '@/components/diagrams/CertLadder'
import { CspDiagram } from '@/components/diagrams/CspDiagram'
import { ServiceStack } from '@/components/diagrams/ServiceStack'
import { Frame } from './Frame'

const DIAGRAMS = {
  'cert-ladder': CertLadder,
  csp: CspDiagram,
  'service-stack': ServiceStack,
} as const

/**
 * Points on a rebuilt SVG diagram that the learner opens one at a time.
 *
 * The markers are real buttons in the DOM rather than clickable regions of an
 * image, so the whole diagram is reachable by Tab and readable aloud.
 */
export function Hotspot({ spec, onComplete }: { spec: HotspotSpec; onComplete: () => void }) {
  const [opened, setOpened] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const Diagram = DIAGRAMS[spec.diagram]
  const done = opened.length === spec.hotspots.length

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  const activeSpot = spec.hotspots.find((h) => h.id === active)

  return (
    <Frame
      prompt={spec.prompt}
      done={done}
      status={`${Math.max(0, spec.hotspots.length - opened.length)} of ${spec.hotspots.length} still to open.`}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="relative border border-line bg-slate p-4">
          <Diagram activeId={active} />

          {spec.hotspots.map((h) => {
            const isOpen = opened.includes(h.id)
            return (
              <button
                key={h.id}
                type="button"
                aria-pressed={active === h.id}
                onClick={() => {
                  setActive(active === h.id ? null : h.id)
                  setOpened((prev) => (prev.includes(h.id) ? prev : [...prev, h.id]))
                }}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors ${
                  active === h.id
                    ? 'border-blue bg-blue text-white'
                    : isOpen
                      ? 'border-mint/50 bg-slate text-mint'
                      : 'border-blue/50 bg-white text-blue-electric hover:bg-blue hover:text-white'
                }`}
              >
                {h.label}
              </button>
            )
          })}
        </div>

        <aside className="self-start border border-line bg-slate p-3.5 lg:min-h-[160px]">
          <AnimatePresence mode="wait">
            {activeSpot ? (
              <motion.div
                key={activeSpot.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-electric">
                  {activeSpot.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{activeSpot.body}</p>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] leading-relaxed text-ink/45"
              >
                Choose a label on the diagram to read about it.
              </motion.p>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </Frame>
  )
}
