'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * What is the cloud. Deck slide 8.
 *
 * Their version was a bold black-and-red hand drawing of a cloud connected to
 * four devices, each labelled "Software". Ours rebuilds that same picture in
 * brand navy and gold, and does not reveal the answer until the learner has
 * committed. The Socratic order is the whole point.
 */
export function WhatIsCloudScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="What is the" titleAccent="cloud?" compact={compact}>
      {shown('question') ? (
        <p className="anim-rise mt-1 max-w-[75%] text-[clamp(0.84rem,1.85cqw,1.08rem)] leading-relaxed text-ink/65">
          Have a go below before I answer. An answer you reach yourself is one you keep.
        </p>
      ) : null}

      <div className="mt-3 flex flex-1 flex-col items-center justify-center">
        {shown('diagram') ? (
          <div className="anim-rise w-full">
            <CloudDiagram compact={compact} />
          </div>
        ) : (
          <div className="opacity-[0.12]">
            <CloudDiagram compact={compact} ghost />
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {shown('punchline') ? (
          <p className="anim-wipe max-w-[85%] font-display text-[clamp(0.95rem,2.51cqw,1.34rem)] font-bold leading-snug text-blue-deep">
            Someone else’s computer, in someone else’s building, rented over the internet.
          </p>
        ) : null}
        {shown('origin') ? (
          <p className="anim-rise max-w-[80%] border-l-[3px] border-gold pl-3 text-[clamp(0.78rem,1.68cqw,0.98rem)] leading-relaxed text-ink/60">
            The word comes from the drawing, not the technology. On old network diagrams, the part you did not control was always sketched as a cloud.
          </p>
        ) : null}
      </div>
    </SlideFrame>
  )
}

function CloudDiagram({ compact, ghost }: { compact?: boolean; ghost?: boolean }) {
  const devices = [
    { x: 30, w: 116, h: 82, label: 'Desktop' },
    { x: 186, w: 78, h: 60, label: 'Tablet' },
    { x: 304, w: 44, h: 74, label: 'Phone' },
    { x: 388, w: 122, h: 76, label: 'Laptop' },
  ]

  return (
    <svg
      viewBox="0 0 540 230"
      className={`h-auto w-full ${compact ? 'max-w-[380px]' : 'max-w-[520px]'} mx-auto`}
      role="img"
      aria-label="Four devices connecting to a machine in a building"
    >
      {/* the building */}
      <g>
        <rect x="186" y="8" width="168" height="70" rx="6" fill="#000066" />
        <rect x="198" y="20" width="42" height="42" rx="3" fill="#1B1AFF" opacity="0.55" />
        <rect x="249" y="20" width="42" height="42" rx="3" fill="#1B1AFF" opacity="0.35" />
        <rect x="300" y="20" width="42" height="42" rx="3" fill="#1B1AFF" opacity="0.55" />
        <text
          x="270"
          y="47"
          textAnchor="middle"
          fill="#FFC000"
          fontSize={ghost ? 22 : 13}
          fontWeight="800"
          fontFamily="var(--font-display), sans-serif"
        >
          {ghost ? '?' : 'Your software'}
        </text>
        {ghost ? null : (
          <text x="270" y="92" textAnchor="middle" fill="#0B1020" fontSize="10" opacity="0.55">
            A machine, in a building, with an electricity bill
          </text>
        )}
      </g>

      {/* connectors */}
      {devices.map((d, i) => {
        const cx = d.x + d.w / 2
        return (
          <path
            key={i}
            d={`M ${cx} 158 C ${cx} 120, 270 118, 270 80`}
            stroke="#8C99B4"
            strokeWidth="1.4"
            strokeDasharray="4 4" className="flow-line"
            fill="none"
          />
        )
      })}

      {/* devices */}
      {devices.map((d) => (
        <g key={d.label}>
          <rect
            x={d.x}
            y={158 - d.h}
            width={d.w}
            height={d.h}
            rx="5"
            fill="#FFFFFF"
            stroke="#000099"
            strokeWidth="2.4"
          />
          <text
            x={d.x + d.w / 2}
            y={158 - d.h / 2 + 4}
            textAnchor="middle"
            fill="#000099"
            fontSize="10"
            fontWeight="700"
          >
            {ghost ? '?' : 'App'}
          </text>
          <rect x={d.x + d.w / 2 - 14} y={160} width="28" height="4" rx="2" fill="#000099" />
          <text
            x={d.x + d.w / 2}
            y={180}
            textAnchor="middle"
            fill="#0B1020"
            fontSize="9.5"
            opacity="0.5"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
