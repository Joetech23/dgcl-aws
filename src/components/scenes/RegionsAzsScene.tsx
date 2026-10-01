'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Regions and availability zones. Deck slide 20/22.
 *
 * A schematic view of one region with three availability zones drawn as
 * separate data centres connected by high-bandwidth links.
 */
export function RegionsAzsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Regions and" titleAccent="Availability Zones" compact={compact}>
      <div className="mt-2 grid flex-1 grid-cols-[0.85fr_1fr] gap-4">
        <ul className="space-y-2 text-[clamp(0.74rem,1.6cqw,0.94rem)] leading-snug">
          <Fact visible={shown('minimum')}>
            <strong className="text-blue-deep">Two or more</strong> availability zones in every region.
          </Fact>
          <Fact visible={shown('distance')}>
            Close enough to talk fast, far enough to fail independently.{' '}
            <strong className="text-blue-deep">~100 km</strong> apart in London.
          </Fact>
          <Fact visible={shown('discrete')}>
            Each zone is one or more discrete data centres. Own power, cooling, network.
          </Fact>
          <Fact visible={shown('links')}>
            Connected by <strong className="text-blue-deep">high-bandwidth, low-latency</strong> links.
          </Fact>
        </ul>

        <RegionMap show={shown('minimum')} showLinks={shown('links')} />
      </div>
    </SlideFrame>
  )
}

function Fact({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  if (!visible) {
    return <li className="min-h-[36px] rounded-md border border-dashed border-line/50 opacity-30" />
  }
  return (
    <li className="anim-rise flex items-start gap-2 text-ink/75">
      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
      <span>{children}</span>
    </li>
  )
}

function RegionMap({ show, showLinks }: { show: boolean; showLinks: boolean }) {
  const zones = [
    { id: 'az1', x: 70, y: 50, label: 'AZ 1' },
    { id: 'az2', x: 170, y: 40, label: 'AZ 2' },
    { id: 'az3', x: 130, y: 130, label: 'AZ 3' },
  ]
  if (!show) return <div className="rounded-md border border-dashed border-line/60 opacity-30" />
  return (
    <div className="rounded-md border border-line bg-white p-2 shadow-lift">
      <p className="mb-1 font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-blue-electric">
        Region · eu-west-2 · London
      </p>
      <svg viewBox="0 0 240 180" className="h-auto w-full" role="img" aria-label="Region with three availability zones">
        {/* region outline */}
        <rect
          x="10"
          y="10"
          width="220"
          height="160"
          rx="10"
          fill="#F4F6FB"
          stroke="#000099"
          strokeWidth="1.4"
          strokeDasharray="4 3"
        />
        {/* zones */}
        {zones.map((z, i) => (
          <g key={z.id} className="anim-rise" style={{ animationDelay: `${i * 120}ms` }}>
            <rect x={z.x - 26} y={z.y - 20} width="52" height="40" rx="4" fill="#FFFFFF" stroke="#0000BC" strokeWidth="1.4" />
            <rect x={z.x - 20} y={z.y - 14} width="12" height="12" rx="1.5" fill="#0000BC" opacity="0.5" />
            <rect x={z.x - 5} y={z.y - 14} width="12" height="12" rx="1.5" fill="#0000BC" opacity="0.35" />
            <rect x={z.x + 10} y={z.y - 14} width="12" height="12" rx="1.5" fill="#0000BC" opacity="0.5" />
            <text x={z.x} y={z.y + 15} textAnchor="middle" fill="#0000BC" fontSize="9" fontWeight="700">
              {z.label}
            </text>
          </g>
        ))}
        {/* links */}
        {showLinks ? (
          <>
            <line x1="70" y1="50" x2="170" y2="40" stroke="#FFC000" strokeWidth="1.6" />
            <line x1="70" y1="50" x2="130" y2="130" stroke="#FFC000" strokeWidth="1.6" />
            <line x1="170" y1="40" x2="130" y2="130" stroke="#FFC000" strokeWidth="1.6" />
            <text x="120" y="90" fill="#F5871F" fontSize="7" fontWeight="700" textAnchor="middle">
              &lt; 1 ms
            </text>
          </>
        ) : null}
      </svg>
    </div>
  )
}
