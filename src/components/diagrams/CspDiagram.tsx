/** Rent vs own, rebuilt from slide 9. */
export function CspDiagram({ activeId }: { activeId: string | null }) {
  const dim = (id: string) => (activeId && activeId !== id ? 0.4 : 1)
  const ring = (id: string) => (activeId === id ? '#F5871F' : '#2C3E4D')
  return (
    <svg viewBox="0 0 620 300" className="h-auto w-full" aria-hidden>
      {/* You */}
      <g opacity={dim('you')}>
        <rect x="20" y="110" width="130" height="80" fill="#16232F" stroke={ring('you')} />
        <text x="85" y="145" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-paper">Your business</text>
        <text x="85" y="165" textAnchor="middle" fontSize="11" className="fill-mist">No racks. No room.</text>
      </g>

      <line x1="150" y1="150" x2="230" y2="150" stroke="#2C3E4D" strokeDasharray="4 4" />
      <text x="190" y="142" textAnchor="middle" fontSize="10.5" className="fill-ember" fontFamily="monospace">rents</text>

      {/* Provider */}
      <g opacity={dim('provider')}>
        <rect x="230" y="60" width="220" height="180" fill="#16232F" stroke={ring('provider')} />
        <text x="340" y="88" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-paper">Cloud service provider</text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={252 + i * 62} y={106} width="48" height="110" fill="#22323F" stroke="#2C3E4D" />
            {[0, 1, 2, 3].map((j) => (
              <rect key={j} x={258 + i * 62} y={114 + j * 26} width="36" height="17" fill="#0B1622" />
            ))}
          </g>
        ))}
      </g>

      <line x1="450" y1="150" x2="520" y2="150" stroke="#2C3E4D" strokeDasharray="4 4" />

      {/* Off-site */}
      <g opacity={dim('offsite')}>
        <rect x="520" y="110" width="82" height="80" fill="#16232F" stroke={ring('offsite')} />
        <text x="561" y="145" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-paper">Their site</text>
        <text x="561" y="164" textAnchor="middle" fontSize="10.5" className="fill-mist">Their staff</text>
      </g>

      <text x="340" y="272" textAnchor="middle" fontSize="11.5" className="fill-mist">
        The three you will hear named most: AWS, Microsoft Azure, Google Cloud
      </text>
    </svg>
  )
}
