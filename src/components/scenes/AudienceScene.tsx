'use client'

import Image from 'next/image'
import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Who this course is for. Deck slide 6.
 *
 * Their version leaned on two stock photos of professionals. We reuse those
 * (they came out of the source deck) but treat them as headers on each path
 * card rather than the whole scene, so the message still sits on top.
 */
export function AudienceScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Designed for" titleAccent="IT and non-IT professionals" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[80%] text-[clamp(0.7rem,1.1vw,0.9rem)] leading-relaxed text-ink/65">
          You do not need a technical background to start. The course meets you where you are.
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <PathCard
          visible={shown('it')}
          eyebrow="Path A"
          title="Working in IT"
          lines={[
            'Adds the vocabulary and reasoning behind AWS to what you already know.',
            'Skips the basics and focuses on what actually changes.',
          ]}
          tint="#000099"
          image="/art/audience-it.jpg"
        />
        <PathCard
          visible={shown('nonit')}
          eyebrow="Path B"
          title="From another field"
          lines={[
            'Every term gets defined the first time it appears.',
            'No code required. Concepts, pricing, and where the pieces fit.',
          ]}
          tint="#F5871F"
          image="/art/audience-nonit.jpg"
        />
      </div>

      {shown('confidence') ? (
        <div className="anim-rise mt-4 flex items-center gap-2 rounded-md border-l-[3px] border-gold bg-gold/5 px-3 py-2 text-[clamp(0.65rem,0.95vw,0.8rem)] text-ink/75">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path d="M10 2l2.4 5.4L18 8l-4 3.9 1 5.6L10 15l-5 2.5 1-5.6L2 8l5.6-.6L10 2z" fill="#FFC000" />
          </svg>
          <span>
            Most people who prepare properly pass the Cloud Practitioner on the first attempt.
          </span>
        </div>
      ) : null}
    </SlideFrame>
  )
}

function PathCard({
  visible,
  eyebrow,
  title,
  lines,
  tint,
  image,
}: {
  visible: boolean
  eyebrow: string
  title: string
  lines: string[]
  tint: string
  image: string
}) {
  if (!visible) {
    return <div className="min-h-[140px] rounded-lg border border-dashed border-line/50 opacity-30" />
  }
  return (
    <div
      className="anim-rise relative flex flex-col overflow-hidden rounded-lg shadow-lift"
      style={{ ['--card-tint' as string]: tint }}
    >
      {/* photo header, with a coloured wash so it stays on-brand */}
      <div className="relative h-[85px] w-full overflow-hidden">
        <Image src={image} alt="" fill sizes="50vw" className="object-cover" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${tint}22 0%, ${tint}88 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2">
          <p
            className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white"
          >
            {eyebrow}
          </p>
          <span className="h-px flex-1 bg-white/40" />
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="font-display text-[clamp(0.9rem,1.5vw,1.2rem)] font-bold text-blue-deep">
          {title}
        </h3>
        <ul className="mt-2 space-y-1.5">
          {lines.map((l) => (
            <li
              key={l}
              className="flex items-start gap-2 text-[clamp(0.65rem,1vw,0.82rem)] leading-snug text-ink/70"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                style={{ background: tint }}
              />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
