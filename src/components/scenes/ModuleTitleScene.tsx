'use client'

import Image from 'next/image'
import type { SceneProps } from './types'

/**
 * The opening card of a module.
 *
 * Follows the module title slide in DGCL's decks: electric-blue ground, the
 * academy logo top left, the AWS Advanced Partner badge top right, "AWS Cloud
 * Training" in white with CO2/CO3 in gold, and the module name beneath. The
 * type is set properly and arrives with the narration.
 */
export function ModuleTitleScene({ slide, shown }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'module-title') return null

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-electric">
      <div
        aria-hidden
        className="ambient-glow absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 70% at 20% 20%, rgba(27,26,255,0.9), transparent 60%), radial-gradient(80% 70% at 90% 100%, rgba(0,0,90,0.9), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.7) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative z-10 flex items-start justify-between p-[4%]">
        <Image
          src="/brand/dgcl-logo.png"
          alt="DGCL Digital Cloud Academy"
          width={520}
          height={220}
          className="h-12 w-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
        <div className="rounded-md bg-white p-1.5 shadow-stage">
          <Image src="/art/aws-partner.png" alt="AWS Advanced Partner" width={150} height={150} className="h-12 w-auto" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-[7%] pb-[6%]">
        {shown('title') ? (
          <div className="anim-rise">
            <p className="font-display text-[clamp(1.2rem,5cqw,2.6rem)] font-extrabold uppercase leading-none tracking-tight text-white">
              AWS Cloud Training
            </p>
            <p className="mt-2 font-display text-[clamp(1.1rem,4.4cqw,2.3rem)] font-extrabold leading-none text-gold">
              CO2/CO3
            </p>
          </div>
        ) : null}

        {shown('sub') ? (
          <h1 className="anim-rise mt-6 max-w-[80%] font-display text-[clamp(0.9rem,3cqw,1.55rem)] font-bold leading-tight text-gold">
            {data.title}
          </h1>
        ) : null}

        {shown('points') ? (
          <ul className="anim-rise mt-5 flex max-w-[86%] flex-wrap gap-2">
            {data.points.map((p) => (
              <li
                key={p}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[clamp(0.66rem,1.56cqw,0.94rem)] font-semibold text-white"
              >
                {p}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
