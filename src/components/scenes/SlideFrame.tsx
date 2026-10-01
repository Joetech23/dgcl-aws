'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'

/**
 * The chrome inside every slide.
 *
 * A slim brand strip across the top (DGCL logo + section title), a curved
 * decorative side panel on the right (replaces the earlier raw chevron with
 * a softer, layered mark), and a corner dot texture that echoes the deck's
 * own bottom-left detail.
 *
 * The scene keeps its full width when the gate panel appears — the panel
 * floats over the right side rather than squeezing the picture.
 */
export function SlideFrame({
  eyebrow,
  title,
  titleAccent,
  sectionLabel = 'AWS Cloud Training · Module 1',
  children,
  chevron = 'right',
  compact = false,
}: {
  eyebrow?: string
  title: string
  titleAccent?: string
  sectionLabel?: string
  chevron?: 'right' | 'none'
  compact?: boolean
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      {chevron === 'right' ? <SidePanel /> : null}
      <DotsCorner />

      {/* In-slide header — like the deck's top strip, but sharper. */}
      <div className="relative z-10 flex items-center gap-3 border-b border-line/70 bg-white/90 px-[3.5%] py-2 backdrop-blur-sm">
        <Image
          src="/brand/dgcl-logo.png"
          alt="DGCL Digital Cloud Academy"
          width={520}
          height={220}
          className="h-7 w-auto"
          priority
        />
        <span aria-hidden className="h-4 w-px bg-line" />
        <span className="font-display text-[clamp(0.74rem,1.85cqw,1.06rem)] font-semibold text-blue-deep">
          {sectionLabel}
        </span>
        <span className="ml-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-gold to-gold" />
      </div>

      <div
        className={`relative flex min-h-0 flex-1 flex-col px-[6%] pb-[4%] pt-[3%] ${
          chevron === 'right' ? 'pr-[13%]' : ''
        }`}
      >
        {eyebrow ? (
          <p className="mb-1 font-display text-[clamp(0.7rem,1.6cqw,0.9rem)] font-semibold uppercase tracking-[0.16em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[clamp(0.9rem,3.36cqw,1.75rem)] font-extrabold leading-[1.1] tracking-tight text-blue-deep">
          {title}
          {titleAccent ? (
            <>
              {' '}
              <span className="text-blue-electric">{titleAccent}</span>
            </>
          ) : null}
        </h1>

        <div className="relative mt-3 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}

/**
 * The redesigned right-side panel.
 *
 * A layered, curved navy shape that reads as a designed insert rather than a
 * raw stroke. Includes a soft ambient glow that drifts, so the slide has a
 * living, produced feel rather than a static screenshot.
 */
function SidePanel() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 w-[13%] overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 100 400"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sp-navy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000099" />
            <stop offset="1" stopColor="#000066" />
          </linearGradient>
          <linearGradient id="sp-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFC000" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFC000" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FFC000" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sp-glow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#1B1AFF" stopOpacity="0.6" />
            <stop offset="1" stopColor="#1B1AFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base navy panel, softly curved into the slide */}
        <path
          d="M 30 0 Q 55 200 30 400 L 100 400 L 100 0 Z"
          fill="url(#sp-navy)"
        />
        {/* Second, subtler curve layered over the base */}
        <path
          d="M 55 0 Q 75 200 55 400 L 100 400 L 100 0 Z"
          fill="#000A3D"
          opacity="0.55"
        />
        {/* Gold seam — a fading vertical line, no longer a full-height stroke */}
        <path
          d="M 30 0 Q 55 200 30 400"
          stroke="url(#sp-fade)"
          strokeWidth="1.6"
          fill="none"
        />

        {/* Ambient glow that drifts — the loop the user asked for */}
        <g className="ambient-glow">
          <ellipse cx="65" cy="200" rx="40" ry="120" fill="url(#sp-glow)" />
        </g>

        {/* Three quiet dots as a signature mark */}
        <g fill="#FFC000" opacity="0.85">
          <circle cx="75" cy="18" r="1.6" />
          <circle cx="82" cy="18" r="1.6" />
          <circle cx="89" cy="18" r="1.6" />
        </g>
      </svg>
    </div>
  )
}

/**
 * A soft dot texture in the bottom-left corner.
 *
 * The deck's own template carries this exact detail on many slides and it
 * reads as production polish for very little visual noise.
 */
function DotsCorner() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-3 left-3 h-14 w-24 opacity-40"
      style={{
        backgroundImage: 'radial-gradient(rgba(0, 0, 102, 0.35) 1px, transparent 1px)',
        backgroundSize: '8px 8px',
      }}
    />
  )
}
