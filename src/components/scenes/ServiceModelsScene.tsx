'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * IaaS, PaaS, SaaS. Deck slide 13.
 *
 * Their version was three arrows on the left and a tree of circles on the
 * right. Ours does the same idea as three horizontal bands: each model
 * highlights the layers the provider handles for you.
 */
const MODELS = [
  {
    id: 'iaas',
    label: 'IaaS',
    full: 'Infrastructure as a service',
    tint: '#000099',
    example: 'EC2',
    yoursCount: 5,
  },
  {
    id: 'paas',
    label: 'PaaS',
    full: 'Platform as a service',
    tint: '#0000BC',
    example: 'Elastic Beanstalk',
    yoursCount: 2,
  },
  {
    id: 'saas',
    label: 'SaaS',
    full: 'Software as a service',
    tint: '#F5871F',
    example: 'Gmail, Office 365',
    yoursCount: 0,
  },
]

const LAYERS = ['App', 'Data', 'Runtime', 'O/S', 'Servers', 'Storage', 'Network']

export function ServiceModelsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="IaaS, PaaS," titleAccent="SaaS" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.68rem,1.05vw,0.88rem)] leading-relaxed text-ink/65">
          How much of the stack the provider looks after, and how much stays with you.
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {MODELS.map((m) => {
          const isVisible = shown(m.id)
          return (
            <div key={m.id}>
              {isVisible ? (
                <div
                  className="anim-rise rounded-md border-2 bg-white p-2.5 shadow-lift"
                  style={{ borderColor: m.tint }}
                >
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <span
                      className="font-display text-[clamp(0.78rem,1.35vw,1.05rem)] font-extrabold"
                      style={{ color: m.tint }}
                    >
                      {m.label}
                    </span>
                    <span className="font-mono text-[10px] text-ink/50">{m.full}</span>
                    <span className="ml-auto rounded-full bg-slate px-2 py-0.5 font-mono text-[9.5px] text-ink/60">
                      e.g. {m.example}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {LAYERS.map((layer, i) => {
                      const yours = i < m.yoursCount
                      return (
                        <div
                          key={layer}
                          className={`flex flex-1 flex-col items-center rounded py-1 text-[8.5px] font-semibold uppercase tracking-tight transition-colors ${
                            yours
                              ? 'text-white'
                              : 'bg-slate text-ink/40 ring-1 ring-inset ring-line'
                          }`}
                          style={yours ? { background: m.tint } : undefined}
                        >
                          <span>{layer}</span>
                          <span
                            className={`mt-0.5 font-mono text-[7.5px] ${
                              yours ? 'text-gold' : 'text-ink/30'
                            }`}
                          >
                            {yours ? 'YOU' : 'AWS'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="min-h-[70px] rounded-md border-2 border-dashed border-line/60 opacity-30" />
              )}
            </div>
          )
        })}
      </div>
    </SlideFrame>
  )
}
