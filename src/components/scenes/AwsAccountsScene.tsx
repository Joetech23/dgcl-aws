'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * All about AWS accounts. Deck slide 26.
 *
 * Three cards arranged as the metaphor gets built: an account is a container,
 * accounts can be signed into, and one company usually has several of them for
 * isolation.
 */
export function AwsAccountsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="All About" titleAccent="AWS Accounts" compact={compact}>
      {shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[85%] text-[clamp(0.68rem,1.05vw,0.88rem)] leading-relaxed text-ink/65">
          Everything you do on AWS happens inside an account. Two minutes on what one is.
        </p>
      ) : null}

      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        <Fact
          visible={shown('container')}
          eyebrow="Definition"
          title="A container"
          body="Its own login. Its own bill. Its own resources."
          tint="#000099"
          icon={
            <>
              <rect x="6" y="10" width="20" height="14" rx="1.5" fill="#000099" opacity="0.15" />
              <rect x="6" y="10" width="20" height="14" rx="1.5" stroke="#000099" strokeWidth="1.8" fill="none" />
              <path d="M10 14h12M10 18h8M10 21h5" stroke="#000099" strokeWidth="1.4" strokeLinecap="round" />
            </>
          }
        />
        <Fact
          visible={shown('signin')}
          eyebrow="Access"
          title="Sign in, see a dashboard"
          body="Having an AWS account means you can log in and be charged."
          tint="#0000BC"
          icon={
            <>
              <circle cx="16" cy="12" r="4" stroke="#0000BC" strokeWidth="1.8" fill="none" />
              <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#0000BC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </>
          }
        />
        <Fact
          visible={shown('many')}
          eyebrow="Isolation"
          title="Many per company"
          body="Dev, staging, production — a hard boundary between each. A mistake in dev cannot damage production."
          tint="#F5871F"
          span
          icon={
            <>
              <rect x="4" y="12" width="8" height="14" rx="1" fill="#F5871F" opacity="0.15" stroke="#F5871F" strokeWidth="1.4" />
              <rect x="12" y="8" width="8" height="18" rx="1" fill="#F5871F" opacity="0.25" stroke="#F5871F" strokeWidth="1.4" />
              <rect x="20" y="12" width="8" height="14" rx="1" fill="#F5871F" opacity="0.15" stroke="#F5871F" strokeWidth="1.4" />
              <text x="8" y="24" textAnchor="middle" fill="#F5871F" fontSize="6" fontWeight="700">DEV</text>
              <text x="16" y="20" textAnchor="middle" fill="#F5871F" fontSize="6" fontWeight="700">STG</text>
              <text x="24" y="24" textAnchor="middle" fill="#F5871F" fontSize="6" fontWeight="700">PRD</text>
            </>
          }
        />
      </div>

      {shown('environment') ? (
        <p className="anim-rise mt-3 border-l-[3px] border-gold pl-3 font-display text-[clamp(0.7rem,1.05vw,0.9rem)] font-semibold text-blue-deep">
          "Account" here means an environment, not a person.
        </p>
      ) : null}
    </SlideFrame>
  )
}

function Fact({
  visible,
  eyebrow,
  title,
  body,
  tint,
  icon,
  span,
}: {
  visible: boolean
  eyebrow: string
  title: string
  body: string
  tint: string
  icon: React.ReactNode
  span?: boolean
}) {
  if (!visible) {
    return (
      <div className={`min-h-[92px] rounded-md border-2 border-dashed border-line/60 opacity-30 ${span ? 'col-span-2' : ''}`} />
    )
  }
  return (
    <div
      className={`anim-rise flex items-start gap-3 rounded-md border-2 bg-white p-3 shadow-lift ${
        span ? 'col-span-2' : ''
      }`}
      style={{ borderColor: tint }}
    >
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md"
        style={{ background: `${tint}12` }}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          {icon}
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: tint }}>
          {eyebrow}
        </p>
        <h3 className="font-display text-[clamp(0.78rem,1.2vw,0.95rem)] font-bold text-blue-deep">
          {title}
        </h3>
        <p className="mt-0.5 text-[clamp(0.62rem,0.9vw,0.75rem)] leading-snug text-ink/60">
          {body}
        </p>
      </div>
    </div>
  )
}
