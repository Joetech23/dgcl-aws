'use client'

import Image from 'next/image'
import type { SceneProps } from './types'

/**
 * The closing card of a module, driven by data so every module can end the
 * same way: what was covered, and which module comes next.
 */
export function ModuleOutroScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'module-outro') return null

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-deep">
      <div
        aria-hidden
        className="ambient-glow absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 30% 25%, rgba(27,26,255,0.35), transparent 60%), radial-gradient(70% 60% at 85% 85%, rgba(0,0,60,0.9), transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-blue-deep px-[3.5%] py-2">
        <Image
          src="/brand/dgcl-logo.png"
          alt="DGCL Digital Cloud Academy"
          width={520}
          height={220}
          className="h-7 w-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <span aria-hidden className="h-4 w-px bg-white/20" />
        <span className="font-display text-[clamp(0.74rem,1.85cqw,1.06rem)] font-semibold text-white/85">
          {moduleLabel ?? 'AWS Cloud Training'}
        </span>
        <span className="ml-auto h-0.5 w-16 bg-gold" />
      </div>

      <div className="pointer-events-none absolute right-[-4%] top-1/2 h-[95%] w-[46%] -translate-y-1/2 opacity-90 drift-y">
        <Image src="/art/cloud-render.png" alt="" fill sizes="46vw" className="object-contain object-right" />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col justify-center px-[6%]">
        {shown('done') ? (
          <h1 className="anim-rise font-display text-[clamp(1.4rem,5.6cqw,2.9rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            {data.heading}
          </h1>
        ) : null}

        {shown('covered') ? (
          <ul className="anim-rise mt-4 max-w-[54%] space-y-1.5">
            {data.covered.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[clamp(0.74rem,1.6cqw,0.98rem)] text-white/80">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {shown('next') ? (
          <p className="anim-rise mt-5 max-w-[50%] rounded-md border-l-[3px] border-gold bg-white/10 px-3 py-2 text-[clamp(0.74rem,1.6cqw,0.98rem)] leading-relaxed text-white/85">
            {data.next}
          </p>
        ) : null}
      </div>
    </div>
  )
}
