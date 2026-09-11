'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * AWS Account features. Deck slides 27-28.
 *
 * Two big ideas, told as two stacked cards with a diagram each.
 */
export function AccountFeaturesScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="AWS Account" titleAccent="Features" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.68rem,1.05vw,0.88rem)] leading-relaxed text-ink/65">
          Two features you should be able to recite.
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <Feature
          visible={shown('isolated')}
          n="01"
          title="Isolated by default"
          body="Every account is separated from every other account, unless you deliberately enable cross-account access."
          diagram="isolated"
        />
        <Feature
          visible={shown('spans')}
          n="02"
          title="Spans the whole world"
          body="One account can use any AWS region on earth, from a single login, with no permission handshake needed."
          diagram="spans"
        />
      </div>

      {shown('together') ? (
        <p className="anim-rise mt-3 border-l-[3px] border-gold pl-3 text-[clamp(0.65rem,0.95vw,0.8rem)] leading-relaxed text-ink/70">
          Together those two are why a small team can serve customers on five continents from one dashboard.
        </p>
      ) : null}
    </SlideFrame>
  )
}

function Feature({
  visible,
  n,
  title,
  body,
  diagram,
}: {
  visible: boolean
  n: string
  title: string
  body: string
  diagram: 'isolated' | 'spans'
}) {
  if (!visible) {
    return <div className="min-h-[70px] rounded-md border-2 border-dashed border-line/60 opacity-30" />
  }
  return (
    <div className="anim-rise flex items-center gap-3 rounded-md border-2 border-blue bg-white p-3 shadow-lift">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-deep font-mono text-[11px] font-bold text-gold">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[clamp(0.78rem,1.2vw,0.95rem)] font-bold text-blue-deep">
          {title}
        </h3>
        <p className="mt-0.5 text-[clamp(0.62rem,0.9vw,0.75rem)] leading-snug text-ink/65">
          {body}
        </p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <svg viewBox="0 0 90 40" className="h-10 w-auto">
          {diagram === 'isolated' ? (
            <>
              <rect x="4" y="8" width="36" height="24" rx="3" fill="#000099" opacity="0.12" stroke="#000099" strokeWidth="1.4" />
              <rect x="50" y="8" width="36" height="24" rx="3" fill="#F5871F" opacity="0.12" stroke="#F5871F" strokeWidth="1.4" />
              <path d="M40 20 L50 20" stroke="#E5484D" strokeWidth="1.4" strokeDasharray="2 2" />
              <text x="22" y="24" textAnchor="middle" fill="#000099" fontSize="8" fontWeight="700">A</text>
              <text x="68" y="24" textAnchor="middle" fill="#F5871F" fontSize="8" fontWeight="700">B</text>
              <text x="45" y="14" textAnchor="middle" fill="#E5484D" fontSize="6" fontWeight="700">walled</text>
            </>
          ) : (
            <>
              <circle cx="45" cy="20" r="15" fill="none" stroke="#000099" strokeWidth="1.4" />
              <ellipse cx="45" cy="20" rx="15" ry="5" fill="none" stroke="#000099" strokeWidth="1" />
              <circle cx="30" cy="20" r="2" fill="#FFC000" />
              <circle cx="45" cy="10" r="2" fill="#FFC000" />
              <circle cx="60" cy="20" r="2" fill="#FFC000" />
              <circle cx="45" cy="30" r="2" fill="#FFC000" />
            </>
          )}
        </svg>
      </div>
    </div>
  )
}
