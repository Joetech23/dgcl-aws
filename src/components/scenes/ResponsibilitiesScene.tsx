'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Separation of responsibilities. Deck slide 14.
 *
 * One stack, one moving line. Switch model, watch the line move. The
 * activity's model choice is the source of truth for the picture.
 */

const LAYERS = [
  'Applications',
  'Data',
  'Runtime',
  'Middleware',
  'Operating system',
  'Virtualisation',
  'Servers',
  'Storage',
  'Networking',
]

const YOU_MANAGE = [9, 5, 2, 0]
const MODEL_NAMES = ['On-premises', 'IaaS', 'PaaS', 'SaaS']

export function ResponsibilitiesScene({ shown, activeModel = 0, compact }: SceneProps) {
  const yours = YOU_MANAGE[activeModel] ?? 0
  const boundaryIndex = yours

  return (
    <SlideFrame title="Who is Responsible" titleAccent="for What" compact={compact}>
      <div className="mt-2 grid flex-1 grid-cols-[0.9fr_1fr] gap-5">
        <div className="flex flex-col">
          {shown('intro') ? (
            <p className="anim-rise text-[clamp(0.7rem,1.54cqw,0.9rem)] leading-relaxed text-ink/65">
              The textbook prints four separate columns. Really it is one stack and one moving line.
            </p>
          ) : null}

          {shown('boundary') ? (
            <div className="anim-rise mt-3 rounded-md border border-line bg-white p-3 shadow-lift">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-electric">
                {MODEL_NAMES[activeModel]}
              </p>
              <p className="mt-1 font-display text-[clamp(1rem,3.08cqw,1.6rem)] font-extrabold leading-none text-blue-deep">
                {yours}
                <span className="text-ink/35"> of {LAYERS.length}</span>
              </p>
              <p className="mt-1 text-[11px] text-ink/60">layers are yours to manage</p>
            </div>
          ) : null}

          {shown('caveat') ? (
            <div className="anim-rise mt-auto border-l-[3px] border-gold pl-3">
              <p className="text-[clamp(0.62rem,1.33cqw,0.78rem)] leading-relaxed text-ink/70">
                Even at the top, your <strong className="text-blue-deep">data</strong> and{' '}
                <strong className="text-blue-deep">access controls</strong> are still yours. Misconfigured access is the most common cloud breach there is.
              </p>
            </div>
          ) : null}
        </div>

        {shown('stack') ? (
          <div className="anim-rise relative flex-1">
            <Stack boundaryIndex={boundaryIndex} showBoundary={shown('boundary')} />
          </div>
        ) : (
          <div className="opacity-30">
            <Stack boundaryIndex={0} showBoundary={false} />
          </div>
        )}
      </div>
    </SlideFrame>
  )
}

function Stack({
  boundaryIndex,
  showBoundary,
}: {
  boundaryIndex: number
  showBoundary: boolean
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-[1.5%]">
      {LAYERS.map((layer, i) => {
        const customerManaged = i < boundaryIndex
        return (
          <div key={layer} className="relative">
            {showBoundary && i === boundaryIndex && boundaryIndex < LAYERS.length ? (
              <div className="absolute -top-[3px] left-0 right-0 z-10 flex items-center gap-2 transition-all duration-500">
                <span className="h-0.5 flex-1 bg-gold" />
                <span className="whitespace-nowrap rounded-sm bg-gold px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.1em] text-blue-deep">
                  Provider takes over
                </span>
              </div>
            ) : null}
            <div
              className={`flex items-center justify-between rounded px-2.5 py-[3px] text-[clamp(0.58rem,1.33cqw,0.8rem)] font-semibold transition-colors duration-500 ${
                customerManaged
                  ? 'bg-blue-deep text-white'
                  : 'bg-slate text-ink/45 ring-1 ring-inset ring-line'
              }`}
            >
              <span>{layer}</span>
              <span
                className={`font-mono text-[8.5px] uppercase tracking-[0.1em] ${
                  customerManaged ? 'text-gold' : 'text-ink/30'
                }`}
              >
                {customerManaged ? 'You' : 'Provider'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
