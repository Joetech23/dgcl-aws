'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * What is a cloud service provider. Deck slide 9.
 *
 * The deck showed the AWS, Azure and Google logos; ours does the same but
 * animates each provider tile in on its own, so the story lands as a growing
 * comparison rather than a static row.
 */
const PROVIDERS = [
  { id: 'aws', name: 'AWS', full: 'Amazon Web Services', tint: '#F5871F', share: '33%' },
  { id: 'azure', name: 'Azure', full: 'Microsoft', tint: '#0072C6', share: '22%' },
  { id: 'gcp', name: 'Cloud', full: 'Google Cloud', tint: '#4285F4', share: '11%' },
]

export function CloudServiceProviderScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="What is a" titleAccent="Cloud Service Provider" compact={compact}>
      {shown('defn') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.7rem,1.1vw,0.9rem)] leading-relaxed text-ink/70">
          A company that lets you <strong className="text-blue-deep">rent</strong> computing,
          storage, and networking, instead of buying it yourself.
        </p>
      ) : null}

      <ul className="mt-4 space-y-2">
        {shown('they-own') ? (
          <li className="anim-rise flex items-start gap-2 text-[clamp(0.68rem,1vw,0.85rem)] text-ink/70">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rotate-45 bg-blue-electric" />
            <span>They own the buildings, the machines, the engineers.</span>
          </li>
        ) : null}
        {shown('pay') ? (
          <li className="anim-rise flex items-start gap-2 text-[clamp(0.68rem,1vw,0.85rem)] text-ink/70">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rotate-45 bg-blue-electric" />
            <span>You pay for what you use. Stop paying when you stop.</span>
          </li>
        ) : null}
      </ul>

      {shown('three') ? (
        <div className="anim-rise mt-4">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
            Three providers dominate
          </p>
          <div className="grid grid-cols-3 gap-3">
            {PROVIDERS.map((p, i) => {
              const isAws = p.id === 'aws'
              const isHighlighted = isAws && shown('aws')
              return (
                <div
                  key={p.id}
                  className={`anim-rise flex flex-col items-center rounded-md border-2 p-3 transition-all ${
                    isHighlighted
                      ? 'scale-105 border-gold bg-gold/[0.08] shadow-lift'
                      : 'border-line bg-white'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span
                    className="font-display text-[clamp(0.95rem,1.7vw,1.35rem)] font-extrabold"
                    style={{ color: p.tint }}
                  >
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] text-ink/55">{p.full}</span>
                  <span className="mt-1 font-mono text-[9.5px] text-ink/40">
                    ~{p.share} market
                  </span>
                  {isHighlighted ? (
                    <span className="mt-1.5 rounded-full bg-gold px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-blue-deep">
                      This course
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </SlideFrame>
  )
}
