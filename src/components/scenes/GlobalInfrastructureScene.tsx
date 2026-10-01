'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * AWS global infrastructure. Deck slide 19.
 *
 * A stylised world map with region pins revealing as the three tiers are
 * named: regions, zones inside them, and edges around the outside.
 */
export function GlobalInfrastructureScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="The AWS" titleAccent="Global Infrastructure" compact={compact}>
      <div className="mt-2 grid flex-1 grid-cols-[0.85fr_1fr] gap-4">
        <div className="flex flex-col">
          {shown('intro') ? (
            <p className="anim-rise text-[clamp(0.82rem,1.76cqw,1.02rem)] leading-relaxed text-ink/70">
              One of the largest networks on earth. Three layers to it.
            </p>
          ) : null}

          <ul className="mt-3 space-y-2">
            <Tier
              visible={shown('region')}
              n="01"
              label="Regions"
              body="Physical geographic areas, like London or Frankfurt."
              tint="#000099"
            />
            <Tier
              visible={shown('az')}
              n="02"
              label="Availability zones"
              body="Data centres inside a region, kept far enough apart to fail independently."
              tint="#0000BC"
            />
            <Tier
              visible={shown('edge')}
              n="03"
              label="Edge locations"
              body="Small facilities in hundreds of cities. Cache content close to your users."
              tint="#F5871F"
            />
          </ul>
        </div>

        <div className="relative flex items-center justify-center">
          <WorldMap
            regions={shown('region')}
            zones={shown('az')}
            edges={shown('edge')}
          />
        </div>
      </div>

      {shown('summary') ? (
        <p className="anim-rise mt-3 border-l-[3px] border-gold pl-3 font-display text-[clamp(0.9rem,1.93cqw,1.14rem)] font-semibold text-blue-deep">
          Regions, zones, and edges. That is the whole map.
        </p>
      ) : null}
    </SlideFrame>
  )
}

function Tier({
  visible,
  n,
  label,
  body,
  tint,
}: {
  visible: boolean
  n: string
  label: string
  body: string
  tint: string
}) {
  if (!visible) {
    return <li className="min-h-[52px] rounded-md border border-dashed border-line/60 opacity-30" />
  }
  return (
    <li className="anim-rise flex items-start gap-2.5 rounded-md border border-line bg-white p-2.5">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[12.5px] font-bold text-white"
        style={{ background: tint }}
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[clamp(0.84rem,1.85cqw,1.08rem)] font-bold" style={{ color: tint }}>
          {label}
        </p>
        <p className="text-[clamp(0.72rem,1.51cqw,0.9rem)] leading-snug text-ink/60">{body}</p>
      </div>
    </li>
  )
}

function WorldMap({
  regions,
  zones,
  edges,
}: {
  regions: boolean
  zones: boolean
  edges: boolean
}) {
  // Rough pin positions in a schematic world map (viewBox 0 0 400 220)
  const regionPins = [
    { x: 85, y: 80 },
    { x: 100, y: 105 },
    { x: 180, y: 75 },
    { x: 200, y: 100 },
    { x: 265, y: 90 },
    { x: 300, y: 105 },
    { x: 320, y: 135 },
  ]
  const edgePins = [
    { x: 60, y: 95 },
    { x: 70, y: 125 },
    { x: 130, y: 140 },
    { x: 170, y: 130 },
    { x: 220, y: 85 },
    { x: 240, y: 150 },
    { x: 285, y: 75 },
    { x: 310, y: 160 },
    { x: 345, y: 115 },
    { x: 355, y: 145 },
  ]

  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full max-w-[440px]" role="img" aria-label="World map with regions and edges">
      {/* Continent silhouettes, deliberately abstract */}
      <g fill="#EAF1FA" stroke="#C7D3E5" strokeWidth="0.6">
        <path d="M40 70 Q65 55 105 60 T170 70 Q175 105 130 125 T50 120 Z" />
        <path d="M170 75 Q200 55 245 65 T295 70 Q305 100 285 130 T220 145 Q195 130 175 105 Z" />
        <path d="M290 55 Q325 45 370 60 T385 105 Q370 135 340 140 T295 120 Q285 90 290 55 Z" />
        <path d="M240 155 Q270 150 295 165 T320 190 Q305 205 275 200 T240 180 Z" />
      </g>

      {edges &&
        edgePins.map((p, i) => (
          <g key={`edge-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="#F5871F" opacity="0.25">
              <animate attributeName="r" values="3;8;3" dur="2.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="2" fill="#F5871F" />
          </g>
        ))}

      {regions &&
        regionPins.map((p, i) => (
          <g key={`region-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="#000099" opacity="0.35" className="pulse-ring" style={{ transformOrigin: `${p.x}px ${p.y}px`, animationDelay: `${i * 0.25}s` }} />
            <circle cx={p.x} cy={p.y} r="6" fill="#000099" opacity="0.15" />
            <circle cx={p.x} cy={p.y} r="3.2" fill="#000099" />
            {zones ? (
              <>
                <circle cx={p.x - 3.5} cy={p.y - 3.5} r="1.2" fill="#FFC000" />
                <circle cx={p.x + 3.5} cy={p.y - 3.5} r="1.2" fill="#FFC000" />
                <circle cx={p.x} cy={p.y + 4} r="1.2" fill="#FFC000" />
              </>
            ) : null}
          </g>
        ))}
    </svg>
  )
}
