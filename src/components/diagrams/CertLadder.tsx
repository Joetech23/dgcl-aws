/**
 * The AWS certification ladder, rebuilt from slide 7's flat screenshot.
 * As SVG it can be pointed at, highlighted and read by a screen reader.
 */
export function CertLadder({ activeId }: { activeId: string | null }) {
  const tiers = [
    { id: 'specialty', y: 12, label: 'Specialty', sub: 'Deep expertise in one domain', w: 300 },
    { id: 'professional', y: 78, label: 'Professional', sub: 'Two years designing on AWS', w: 380 },
    { id: 'associate', y: 144, label: 'Associate', sub: 'One year solving problems on AWS', w: 460 },
    { id: 'foundational', y: 210, label: 'Foundational', sub: 'Six months of general knowledge', w: 540 },
  ]
  return (
    <svg viewBox="0 0 600 290" className="h-auto w-full" aria-hidden>
      {tiers.map((t) => {
        const on = activeId === t.id
        return (
          <g key={t.id} style={{ transition: 'opacity .25s' }} opacity={activeId && !on ? 0.4 : 1}>
            <rect
              x={(600 - t.w) / 2}
              y={t.y}
              width={t.w}
              height={54}
              fill={on ? 'rgba(245,135,31,0.16)' : '#16232F'}
              stroke={on ? '#F5871F' : '#2C3E4D'}
            />
            <text x="300" y={t.y + 23} textAnchor="middle" fontSize="14" fontWeight="600" className="fill-paper">
              {t.label}
            </text>
            <text x="300" y={t.y + 41} textAnchor="middle" fontSize="11.5" className="fill-mist">
              {t.sub}
            </text>
          </g>
        )
      })}
      {/* You start at the bottom — the arrow says which way is up. */}
      <line x1="18" y1="252" x2="18" y2="30" stroke="#F5871F" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M18 24 l-4 8 h8 z" fill="#F5871F" />
      <text x="30" y="276" fontSize="11" className="fill-mist">
        Cloud Practitioner is the first rung. No experience assumed.
      </text>
    </svg>
  )
}
