'use client'

import Image from 'next/image'
import type { SceneProps } from './types'

/**
 * The programme opener, from the CO2/CO3 table-of-contents deck.
 *
 * Their slide is a full-bleed globe-on-circuit-board photograph with a navy
 * band across the bottom carrying the title. We keep that composition, but
 * set the type properly, animate the band in, and hold the AWS Advanced
 * Partner badge top right where their deck puts it.
 */
export function ProgrammeTitleScene({ shown }: SceneProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-deep">
      <Image
        src="/art/globe-circuit.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Deepen the photo so white type and the navy band both hold up */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 40%, rgba(0,0,60,0.15), rgba(0,0,40,0.72) 100%)',
        }}
      />

      {/* Logo, top left, on a small plate like the deck */}
      <div className="relative z-10 flex items-start justify-between p-[3%]">
        <div className="rounded-md bg-blue-deep/85 px-3 py-2 shadow-stage backdrop-blur-sm">
          <Image
            src="/brand/dgcl-logo.png"
            alt="DGCL Digital Cloud Academy"
            width={520}
            height={220}
            className="h-9 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
            priority
          />
        </div>
        {shown('badge') ? (
          <div className="anim-pop rounded-md bg-white p-1.5 shadow-stage">
            <Image
              src="/art/aws-partner.png"
              alt="AWS Advanced Partner"
              width={150}
              height={150}
              className="h-12 w-auto"
            />
          </div>
        ) : null}
      </div>

      {/* Title band across the bottom */}
      <div className="relative z-10 mt-auto">
        {shown('title') ? (
          <div className="anim-rise bg-blue-deep/95 px-[6%] py-[3.5%] backdrop-blur-sm">
            <h1 className="font-display text-[clamp(1.3rem,5.2cqw,2.6rem)] font-extrabold leading-none tracking-tight text-[#22D3EE]">
              AWS Cloud Training
              <span className="text-white"> CO2/CO3</span>
            </h1>
            {shown('academy') ? (
              <p className="anim-rise mt-2 font-display text-[clamp(0.81rem,2.35cqw,1.18rem)] font-bold uppercase tracking-[0.1em] text-white/90">
                DGCL Digital Cloud Academy
              </p>
            ) : null}
            <span className="mt-3 block h-1 w-28 bg-gold" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
