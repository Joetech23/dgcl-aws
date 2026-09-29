'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { SortSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

type Placement = Record<string, string | null>

const BUCKET_COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Sort chips into buckets.
 *
 * Deliberately NOT HTML5 drag-and-drop. Dragging is unusable on touch without
 * a polyfill and close to unusable with a keyboard, which is why Storyline
 * drag interactions fail accessibility review so often. Select-then-place is
 * one code path that behaves identically for mouse, finger and keyboard —
 * click a chip, click where it goes. Nothing to discover, nothing to fumble.
 */
export function SortIntoBuckets({
  spec,
  onComplete,
}: {
  spec: SortSpec
  onComplete: () => void
}) {
  const [placement, setPlacement] = useState<Placement>(() =>
    Object.fromEntries(spec.chips.map((c) => [c.id, null])),
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  const allPlaced = useMemo(
    () => Object.values(placement).every((b) => b !== null),
    [placement],
  )
  const allCorrect = useMemo(
    () => spec.chips.every((c) => placement[c.id] === c.bucket),
    [placement, spec.chips],
  )
  const done = checked && allCorrect

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  const place = (bucketId: string) => {
    if (!selected) return
    setPlacement((p) => ({ ...p, [selected]: bucketId }))
    setSelected(null)
    setChecked(false)
  }

  const unplace = (chipId: string) => {
    setPlacement((p) => ({ ...p, [chipId]: null }))
    setChecked(false)
  }

  const tray = spec.chips.filter((c) => placement[c.id] === null)
  const wrongCount = spec.chips.filter(
    (c) => placement[c.id] !== null && placement[c.id] !== c.bucket,
  ).length

  const status = !allPlaced
    ? selected
      ? 'Now choose where it goes.'
      : `Place all ${spec.chips.length}. Tap one to pick it up.`
    : !checked
      ? 'All placed. Check your answers.'
      : `${wrongCount} in the wrong place. Move them and check again.`

  return (
    <Frame prompt={spec.prompt} done={done} status={status}>
      {/* Tray */}
      <div className="mb-2.5 min-h-[44px] rounded-md border border-dashed border-line bg-slate/60 p-2">
        <span className="sr-only">Items to place</span>
        {tray.length === 0 ? (
          <p className="px-1 py-2 font-mono text-[11px] text-ink/45">
            Tray empty. Everything is placed.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {tray.map((chip) => (
              <li key={chip.id}>
                <button
                  type="button"
                  aria-pressed={selected === chip.id}
                  onClick={() => setSelected(selected === chip.id ? null : chip.id)}
                  className={`border px-3 py-1.5 text-[13px] transition-colors ${
                    selected === chip.id
                      ? 'border-blue bg-blue font-medium text-white'
                      : 'border-line bg-white text-blue-deep hover:border-blue/50'
                  }`}
                >
                  {chip.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buckets */}
      {/* Class names must be literals — Tailwind scans source text, so an
          interpolated `lg:grid-cols-${n}` would be purged out of the build. */}
      <div className={`grid grid-cols-1 gap-2 ${BUCKET_COLS[spec.buckets.length] ?? BUCKET_COLS[4]}`}>
        {spec.buckets.map((bucket) => {
          const held = spec.chips.filter((c) => placement[c.id] === bucket.id)
          return (
            <div key={bucket.id} className="flex flex-col">
              {/* Never disabled. A disabled button is removed from the tab
                  order entirely, so a keyboard user would never discover the
                  buckets existed. Instead it is always reachable and says
                  what to do if nothing is picked up yet. */}
              <button
                type="button"
                onClick={() => place(bucket.id)}
                aria-describedby={selected ? undefined : `${bucket.id}-hint`}
                className={`rounded-md border p-2.5 text-left transition-colors ${
                  selected
                    ? 'cursor-pointer border-blue/70 bg-blue/[0.06]'
                    : 'border-line bg-slate hover:border-mist/40'
                }`}
              >
                <span className="block font-display text-[14px] font-semibold tracking-tight text-blue-deep">
                  {bucket.label}
                </span>
                {bucket.hint ? (
                  <span className="mt-0.5 block font-mono text-[10px] leading-tight text-ink/45">
                    {bucket.hint}
                  </span>
                ) : null}
                {selected || tray.length > 0 ? (
                  <span
                    id={`${bucket.id}-hint`}
                    className={`mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] ${
                      selected ? 'text-blue-electric' : 'text-ink/30'
                    }`}
                  >
                    {selected ? 'Place here' : 'Pick an item first'}
                  </span>
                ) : null}
              </button>

              <ul className="mt-2 flex flex-col gap-1.5">
                {held.map((chip) => {
                  const right = chip.bucket === bucket.id
                  return (
                    <motion.li
                      key={chip.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        type="button"
                        onClick={() => unplace(chip.id)}
                        className={`w-full border px-2.5 py-1.5 text-left text-[12.5px] transition-colors ${
                          checked
                            ? right
                              ? 'border-mint/50 bg-mint/10 text-blue-deep'
                              : 'border-rose/50 bg-rose/10 text-blue-deep'
                            : 'border-line bg-white text-blue-deep hover:border-mist/50'
                        }`}
                      >
                        <span className="flex items-start gap-1.5">
                          {checked ? (
                            <span aria-hidden className={right ? 'text-mint' : 'text-rose'}>
                              {right ? '✓' : '✕'}
                            </span>
                          ) : null}
                          <span>{chip.label}</span>
                        </span>
                        {checked ? (
                          <span className="mt-1 block text-[11.5px] leading-snug text-ink/60">
                            {right ? chip.why : `Not here. ${chip.why}`}
                          </span>
                        ) : (
                          <span className="sr-only">Tap to return to tray</span>
                        )}
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!allPlaced}
          onClick={() => setChecked(true)}
          className="rounded-md border border-blue bg-blue px-4 py-2 text-[13px] font-medium text-white transition disabled:cursor-not-allowed disabled:border-line disabled:bg-slate disabled:text-ink/35"
        >
          Check answers
        </button>
        {done && spec.successNote ? (
          <p className="text-[13px] text-mint">{spec.successNote}</p>
        ) : null}
      </div>
    </Frame>
  )
}
