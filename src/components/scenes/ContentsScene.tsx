'use client'

import Image from 'next/image'
import type { SceneProps } from './types'

/**
 * The programme table of contents, from the CO2/CO3 deck.
 *
 * Fifteen modules is too many for one readable column at this size, so they
 * run in two. The learner's position is marked, and so is the module that
 * unlocks next, which their static slide cannot do.
 *
 * Modules arrive in three groups so the list builds with the narration rather
 * than dropping fifteen lines at once.
 */
const MODULES = [
  'Introduction to Cloud Computing',
  'Amazon Web Services Fundamentals',
  'Identity and Access Management (IAM)',
  'Elastic Compute Cloud (EC2)',
  'Simple Storage Service (S3), Block and File Storage',
  'Virtual Private Cloud (VPC) Networking',
  'Elastic Load Balancing and Auto Scaling',
  'Databases and Analytics',
  'Monitoring, Logging, Auditing and AWS Control Tower',
  'DNS, Caching, and Performance Optimisation',
  'Serverless Applications Integration',
  'Docker Containers and ECS',
  'Deployment and Management',
  'Security in the Cloud',
  'Migration, Machine Learning, and Cost Management',
]

/** This slide lives in module 1, 1-based. */
const CURRENT = 1

export function ContentsScene({ shown }: SceneProps) {
  // Which group a module belongs to, so reveals follow the script.
  const groupOf = (i: number) => (i < 5 ? 'g1' : i < 10 ? 'g2' : 'g3')
  const left = MODULES.slice(0, 8)
  const right = MODULES.slice(8)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-deep">
      <Image src="/art/blue-abstract.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,60,0.86), rgba(0,0,40,0.94))' }}
      />

      {/* Corner tab, like the deck's yellow AWS COURSE flag */}
      <div className="absolute left-0 top-0 z-20 rounded-br-md bg-gold px-3 py-1.5">
        <p className="font-display text-[clamp(0.6rem,1.44cqw,0.82rem)] font-bold uppercase tracking-[0.12em] text-blue-deep">
          AWS Course
        </p>
        <p className="font-display text-[clamp(0.74rem,1.92cqw,1.08rem)] font-extrabold leading-none text-blue-deep">
          CO2/CO3
        </p>
      </div>

      <div className="absolute right-[3%] top-[3%] z-20">
        <Image
          src="/brand/dgcl-logo.png"
          alt="DGCL Digital Cloud Academy"
          width={520}
          height={220}
          className="h-8 w-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-[7%] pb-[4%] pt-[5%]">
        <h1 className="text-center font-display text-[clamp(1.1rem,3.6cqw,1.9rem)] font-extrabold uppercase tracking-tight text-white">
          Table of Contents
        </h1>
        <span className="mx-auto mt-1.5 block h-0.5 w-24 bg-gold" />

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-x-5 gap-y-0">
          {[left, right].map((col, ci) => (
            <ol key={ci} className="space-y-[0.35rem]">
              {col.map((label, idx) => {
                const i = ci === 0 ? idx : idx + 8
                if (!shown(groupOf(i))) {
                  return <li key={label} className="h-[18px] rounded bg-white/5" />
                }
                const isCurrent = i + 1 === CURRENT
                const isNext = i + 1 === CURRENT + 1
                return (
                  <li
                    key={label}
                    className={`anim-rise flex items-start gap-2 rounded px-1.5 py-[3px] ${
                      isCurrent ? 'bg-gold/15 ring-1 ring-gold/60' : isNext ? 'bg-white/[0.06]' : ''
                    }`}
                    style={{ animationDelay: `${(idx % 8) * 45}ms` }}
                  >
                    <span
                      className={`w-7 shrink-0 text-right font-mono text-[clamp(0.6rem,1.38cqw,0.82rem)] font-bold ${
                        isCurrent ? 'text-gold' : 'text-white/40'
                      }`}
                    >
                      {i === 0 ? 'Intro' : i}
                    </span>
                    <span
                      className={`min-w-0 text-[clamp(0.62rem,1.44cqw,0.86rem)] leading-snug ${
                        isCurrent ? 'font-semibold text-white' : 'text-white/75'
                      }`}
                    >
                      {label}
                    </span>
                    {isCurrent ? (
                      <span className="ml-auto shrink-0 rounded-full bg-gold px-1.5 py-[1px] font-mono text-[clamp(0.5rem,1.14cqw,0.67rem)] font-bold uppercase tracking-[0.1em] text-blue-deep">
                        You are here
                      </span>
                    ) : isNext ? (
                      <span className="ml-auto shrink-0 rounded-full border border-white/40 px-1.5 py-[1px] font-mono text-[clamp(0.5rem,1.14cqw,0.67rem)] font-bold uppercase tracking-[0.1em] text-white/80">
                        Up next
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          ))}
        </div>
      </div>
    </div>
  )
}
