/** IaaS / PaaS / SaaS, rebuilt from slide 13. */
export function ServiceStack({ activeId }: { activeId: string | null }) {
  const bands = [
    { id: 'saas', label: 'SaaS', example: 'Outlook, Excel, Twitter', y: 16, w: 260 },
    { id: 'paas', label: 'PaaS', example: 'Runtime, middleware, the OS', y: 96, w: 380 },
    { id: 'iaas', label: 'IaaS', example: 'Storage, networking, compute', y: 176, w: 500 },
  ]
  return (
    <svg viewBox="0 0 560 260" className="h-auto w-full" aria-hidden>
      {bands.map((b) => {
        const on = activeId === b.id
        return (
          <g key={b.id} opacity={activeId && !on ? 0.4 : 1} style={{ transition: 'opacity .25s' }}>
            <path
              d={`M${(560 - b.w) / 2} ${b.y} H${(560 + b.w) / 2 - 22} l22 32 l-22 32 H${(560 - b.w) / 2} Z`}
              fill={on ? 'rgba(245,135,31,0.16)' : '#16232F'}
              stroke={on ? '#F5871F' : '#2C3E4D'}
            />
            <text x={(560 - b.w) / 2 + 18} y={b.y + 28} fontSize="14" fontWeight="600" className="fill-paper">
              {b.label}
            </text>
            <text x={(560 - b.w) / 2 + 18} y={b.y + 48} fontSize="11.5" className="fill-mist">
              {b.example}
            </text>
          </g>
        )
      })}
      <text x="280" y="252" textAnchor="middle" fontSize="11" className="fill-mist">
        The higher you go, the less there is for you to run
      </text>
    </svg>
  )
}
