'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * What AWS is. Deck slide 2.
 *
 * Their version was a huge AWS-cloud icon and a wall of body copy. Ours pulls
 * the three real promises out of that paragraph and shows them as they get
 * named. Same information, less to read.
 */
export function WhatAwsIsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Amazon Web Services" titleAccent="Fundamentals" compact={compact}>
      <div className="mt-2 grid flex-1 grid-cols-[1fr_0.85fr] gap-6">
        <div>
          {shown('name') ? (
            <p className="anim-rise text-[clamp(0.7rem,1.15vw,0.95rem)] leading-relaxed text-ink/75">
              <strong className="text-blue-deep">AWS</strong>, short for Amazon Web
              Services, is Amazon’s cloud platform.
            </p>
          ) : null}

          {shown('what') ? (
            <p className="anim-rise mt-3 text-[clamp(0.7rem,1.1vw,0.9rem)] leading-relaxed text-ink/70">
              It gives you computing power, storage, databases, and machine learning tools,
              all delivered over the internet and rented by the minute.
            </p>
          ) : null}

          {shown('why') ? (
            <p className="anim-rise mt-3 text-[clamp(0.7rem,1.1vw,0.9rem)] leading-relaxed text-ink/70">
              You can run applications, hold data, and change the size of your resources
              without buying a single piece of hardware.
            </p>
          ) : null}

          {shown('promise') ? (
            <div className="anim-rise mt-5 grid grid-cols-3 gap-2">
              {[
                ['Flexibility', '#000099'],
                ['Scale', '#0000BC'],
                ['Cost', '#FFC000'],
              ].map(([label, tint], i) => (
                <div
                  key={label}
                  className="anim-pop rounded-md border p-2 text-center"
                  style={{
                    borderColor: tint,
                    background: `${tint}12`,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <span
                    className="font-display text-[clamp(0.7rem,1.15vw,0.95rem)] font-bold"
                    style={{ color: tint }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Simple AWS-in-cloud graphic, right column */}
        {shown('name') ? (
          <div className="anim-rise flex items-center justify-center">
            <svg viewBox="0 0 260 240" className="h-auto w-full max-w-[240px]" role="img" aria-label="AWS cloud">
              <polygon
                points="130,10 250,130 130,235 10,130"
                fill="#000066"
                stroke="#000099"
                strokeWidth="4"
              />
              <g transform="translate(130,130)">
                <ellipse cx="0" cy="0" rx="72" ry="46" fill="#FFFFFF" stroke="#FFC000" strokeWidth="3" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#0B1020"
                  fontSize="30"
                  fontWeight="800"
                  fontFamily="var(--font-display), sans-serif"
                >
                  aws
                </text>
                <path
                  d="M -35 18 Q 0 32 35 18"
                  stroke="#F5871F"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <polygon points="30,15 40,18 32,24" fill="#F5871F" />
              </g>
            </svg>
          </div>
        ) : null}
      </div>
    </SlideFrame>
  )
}
