'use client'

import { useEffect, useId, useState } from 'react'
import type { SliderCompareSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

/** Costs hidden below the waterline, deepest last. y is in SVG units. */
const ON_PREM = [
  { y: 214, label: 'Customisation & implementation' },
  { y: 252, label: 'Hardware' },
  { y: 290, label: 'IT staff' },
  { y: 328, label: 'Maintenance' },
  { y: 366, label: 'Training' },
  { y: 404, label: 'Capacity you bought but never used' },
]

const CLOUD = [
  { y: 214, label: 'Implementation & training' },
  { y: 252, label: 'Nothing else — the provider carries the rest' },
]

const TOP = 170
const BOTTOM = 424

/**
 * The pay-as-you-go iceberg.
 *
 * The source deck (slide 10) shows this as a flat picture with every label
 * already visible, which gives the point away before the learner has thought
 * about it. Here the water starts full and the learner drains it themselves,
 * so the hidden on-premises costs surface one at a time under their own hand.
 *
 * The control is a real <input type="range">: keyboard arrows, touch and
 * screen readers all work without a line of custom code.
 */
export function Iceberg({
  spec,
  onComplete,
}: {
  spec: SliderCompareSpec
  onComplete: () => void
}) {
  const [drain, setDrain] = useState(0)
  const id = useId()
  const waterY = TOP + (drain / 100) * (BOTTOM - TOP)
  const done = drain >= spec.revealAt

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  const visible = (y: number) => waterY > y - 6

  const revealedCount = ON_PREM.filter((c) => visible(c.y)).length

  return (
    <Frame
      prompt={spec.prompt}
      done={done}
      status={
        drain === 0
          ? 'Drag the slider to drain the water.'
          : `${revealedCount} of ${ON_PREM.length} on-premises costs uncovered.`
      }
    >
      <div className="border border-line bg-slate p-3">
        {/* At 375px the labels inside an 800-unit viewBox render around 5px,
            which is unreadable. The diagram keeps a minimum width and scrolls
            inside its own container instead, so the text stays legible and the
            page body never scrolls sideways. */}
        <div className="-mx-1 overflow-x-auto px-1">
        <svg
          viewBox="0 0 800 470"
          className="h-auto w-full min-w-[660px] md:min-w-0"
          role="img"
          aria-label={`Cost comparison. Water drained ${drain} percent, uncovering ${revealedCount} of ${ON_PREM.length} hidden on-premises costs.`}
        >
          {/* Column headings */}
          <text x="200" y="26" textAnchor="middle" className="fill-paper" fontSize="15" fontWeight="600">
            On-premises
          </text>
          <text x="600" y="26" textAnchor="middle" className="fill-paper" fontSize="15" fontWeight="600">
            Cloud, pay as you go
          </text>

          {/* The visible tips — what a buyer thinks the cost is */}
          <path d="M200 150 L155 60 L185 92 L212 44 L245 150 Z" fill="#5B7C95" />
          <path d="M600 150 L575 96 L592 116 L611 84 L628 150 Z" fill="#5B7C95" />

          {/* The submerged mass is always drawn — clipping it to below the
              waterline left a visible gap between the tip and the body. The
              sea is painted over it instead, so draining the water uncovers
              the mass exactly the way it would in life. */}
          <path d="M140 150 L262 150 L286 430 L120 430 Z" fill="#3A5165" />
          <path d="M560 150 L642 150 L652 288 L552 288 Z" fill="#3A5165" />

          {/* Sea */}
          <rect x="0" y={waterY} width="800" height={470 - waterY} fill="#0E2A3D" opacity="0.62" />
          <line x1="0" y1={waterY} x2="800" y2={waterY} stroke="#38BDF8" strokeWidth="2.5" />

          {/* Above-water labels: the only cost anyone quotes you */}
          <text x="24" y={TOP - 14} className="fill-mist" fontSize="12.5">
            Software licence
          </text>
          <text x="776" y={TOP - 14} textAnchor="end" className="fill-mist" fontSize="12.5">
            Subscription fee
          </text>

          {/* Hidden costs, revealed as the water goes down */}
          {ON_PREM.map((c) => (
            <g key={c.label} opacity={visible(c.y) ? 1 : 0} style={{ transition: 'opacity .28s' }}>
              <line x1="24" y1={c.y} x2="112" y2={c.y} stroke="#F5871F" strokeWidth="1" strokeDasharray="3 3" />
              <text x="24" y={c.y - 7} className="fill-paper" fontSize="12.5">
                {c.label}
              </text>
            </g>
          ))}
          {CLOUD.map((c) => (
            <g key={c.label} opacity={visible(c.y) ? 1 : 0} style={{ transition: 'opacity .28s' }}>
              <line x1="688" y1={c.y} x2="776" y2={c.y} stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" />
              <text x="776" y={c.y - 7} textAnchor="end" className="fill-paper" fontSize="12.5">
                {c.label}
              </text>
            </g>
          ))}
        </svg>
        </div>

        <div className="mt-3 flex items-center gap-3 px-1">
          <label htmlFor={`${id}-range`} className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/60">
            Drain
          </label>
          <input
            id={`${id}-range`}
            type="range"
            min={0}
            max={100}
            value={drain}
            onChange={(e) => setDrain(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white accent-ember"
          />
          <span className="w-10 text-right font-mono text-[11px] text-ink/60">{drain}%</span>
        </div>
      </div>

      {done ? (
        <p className="mt-3 border-l-2 border-mint bg-mint/[0.06] px-3 py-2 text-[13px] leading-relaxed text-blue-deep">
          {spec.successNote}
        </p>
      ) : null}
    </Frame>
  )
}
