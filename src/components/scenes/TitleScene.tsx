'use client'

import Image from 'next/image'
import type { SceneProps } from './types'

/**
 * The opening.
 *
 * Same composition as the deck's title slide: brand navy full-bleed, the 3D
 * cloud render on the right, big title with yellow accent on the left. Rebuilt
 * from scratch so the type is properly set, the reveals are timed, and the
 * whole thing scales cleanly.
 */
export function TitleScene({ shown }: SceneProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-deep">
      {/* Soft brand glow that drifts to give the flat navy some life */}
      <div
        aria-hidden
        className="ambient-glow absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 25% 20%, rgba(27,26,255,0.35), transparent 60%), radial-gradient(70% 60% at 90% 90%, rgba(0,0,60,0.85), transparent 55%)',
        }}
      />

      {/* Dot texture, subtle */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Slow orbiting spark for premium motion feel */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg viewBox="0 0 800 450" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <radialGradient id="spark" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFC000" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFC000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="slow-spin" style={{ transformOrigin: '620px 225px' }}>
            <circle cx="620" cy="140" r="20" fill="url(#spark)" />
          </g>
          <g className="slow-spin" style={{ transformOrigin: '140px 320px', animationDuration: '30s' }}>
            <circle cx="220" cy="320" r="12" fill="url(#spark)" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* In-slide header — same strip as every other slide, kept dark on the
          navy title background so it still reads. */}
      <div className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-blue-deep px-[3.5%] py-2">
        <Image
          src="/brand/dgcl-logo.png"
          alt="DGCL Digital Cloud Academy"
          width={520}
          height={220}
          className="h-7 w-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
        <span aria-hidden className="h-4 w-px bg-white/20" />
        <span className="font-display text-[clamp(0.62rem,1.54cqw,0.88rem)] font-semibold text-white/85">
          AWS Cloud Training · Section 1
        </span>
        <span className="ml-auto h-0.5 w-16 bg-gold" />
      </div>

      {/* Cloud render, right half */}
      <div
        className={`pointer-events-none absolute right-[-2%] top-1/2 h-[92%] w-[52%] -translate-y-1/2 ${
          shown('title') ? 'anim-pop' : 'opacity-0'
        }`}
        style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,60,0.55))' }}
      >
        <Image
          src="/art/cloud-render.png"
          alt=""
          fill
          priority
          sizes="52vw"
          className="object-contain object-right"
        />
      </div>

      {/* Copy, left */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center px-[6%] py-[6%]">
        {shown('title') ? (
          <h1 className="anim-rise font-display text-[clamp(1rem,6.44cqw,3.8rem)] font-extrabold leading-[1.02] tracking-tight text-white">
            AWS Cloud
            <br />
            Training
          </h1>
        ) : null}

        {shown('subtitle') ? (
          <div className="anim-rise mt-3 max-w-[52%]">
            <p className="font-display text-[clamp(0.7rem,2.8cqw,1.55rem)] font-bold text-gold">
              Section 1
            </p>
            <p className="mt-0.5 font-display text-[clamp(0.55rem,2.24cqw,1.25rem)] font-semibold text-gold/90">
              AWS Web Services Fundamentals
            </p>
          </div>
        ) : null}

        {shown('promise') ? (
          <p className="anim-rise mt-4 max-w-[46%] font-body text-[clamp(0.72rem,1.61cqw,0.95rem)] leading-relaxed text-white/75">
            Ten short lessons on what AWS is, what it gives you, and how it fits into the
            work you already do.
          </p>
        ) : null}
      </div>
    </div>
  )
}
