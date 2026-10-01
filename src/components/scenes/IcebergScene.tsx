'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Licensing vs pay-as-you-go. Deck slide 10.
 *
 * The deck used an iceberg metaphor: one visible number on the invoice, and a
 * lot of hidden cost below the water. We rebuild that as SVG and animate the
 * water line down as the narrator names each hidden cost, then let the learner
 * drive the slider themselves in the activity.
 */
const ONPREM_COSTS = [
  'Software licence',
  'Customisation & implementation',
  'Hardware',
  'IT staff',
  'Maintenance',
  'Training',
  'Capacity you bought but never used',
]

const CLOUD_COSTS = ['Subscription fee', 'Implementation', 'Training']

export function IcebergScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Licensing vs" titleAccent="Pay as You Go" compact={compact}>
      {shown('tip') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.82rem,1.76cqw,1.06rem)] leading-relaxed text-ink/65">
          Both invoices show one number. The difference is what sits underneath it.
        </p>
      ) : null}

      <div className="mt-3 grid flex-1 grid-cols-2 gap-4">
        {/* On-premises iceberg */}
        <IcebergCard
          label="On-premises"
          tint="#000099"
          visible={shown('underneath')}
          costsVisible={shown('onprem-costs')}
          costs={ONPREM_COSTS}
        />
        <IcebergCard
          label="Cloud"
          tint="#0000BC"
          visible={shown('underneath')}
          costsVisible={shown('cloud-costs')}
          costs={CLOUD_COSTS}
        />
      </div>
    </SlideFrame>
  )
}

function IcebergCard({
  label,
  tint,
  visible,
  costsVisible,
  costs,
}: {
  label: string
  tint: string
  visible: boolean
  costsVisible: boolean
  costs: string[]
}) {
  if (!visible) {
    return <div className="rounded-md border-2 border-dashed border-line/60 opacity-30" />
  }
  return (
    <div
      className="anim-rise flex flex-col rounded-md border-2 p-3 shadow-lift"
      style={{ borderColor: tint, background: `${tint}05` }}
    >
      <p
        className="font-display text-[clamp(0.87rem,2.04cqw,1.12rem)] font-bold"
        style={{ color: tint }}
      >
        {label}
      </p>
      <svg viewBox="0 0 240 100" className="mt-1 h-auto w-full" role="img" aria-label={`${label} iceberg`}>
        {/* water surface */}
        <rect x="0" y="42" width="240" height="58" fill={`${tint}18`} />
        {/* iceberg */}
        <polygon
          points="120,15 105,42 135,42"
          fill="#FFFFFF"
          stroke={tint}
          strokeWidth="1.4"
        />
        <polygon
          points="105,42 135,42 145,95 95,95"
          fill={`${tint}66`}
          stroke={tint}
          strokeWidth="1.2"
        />
        {/* waterline */}
        <line x1="0" y1="42" x2="240" y2="42" stroke={tint} strokeWidth="1.4" strokeDasharray="3 3" />
        <text x="4" y="38" fill={tint} fontSize="7" fontWeight="700">
          You see this
        </text>
        <text x="4" y="55" fill={tint} fontSize="7" fontWeight="700" opacity="0.7">
          You also pay for this
        </text>
      </svg>

      <ul className="mt-2 space-y-1">
        {costs.map((c, i) => (
          <li
            key={c}
            className={`flex items-start gap-1.5 text-[clamp(0.7rem,1.43cqw,0.86rem)] leading-tight transition-all ${
              costsVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span
              aria-hidden
              className="mt-0.5 h-1 w-1 shrink-0 rotate-45"
              style={{ background: tint }}
            />
            <span className="text-ink/75">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
