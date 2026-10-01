'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Root user and IAM. Deck slides 29-30.
 *
 * The security posture explained as a hierarchy. Root at the top, IAM users
 * for staff, federated users for people who sign in elsewhere.
 */
const USERS = [
  {
    id: 'root',
    label: 'Root user',
    subtitle: 'Owner. All-powerful.',
    body: 'Use it once to set up, then lock it away. Never use it for daily work.',
    tint: '#E5484D',
    icon: (
      <>
        <path
          d="M16 4l10 4v8c0 6-4.5 10-10 12-5.5-2-10-6-10-12V8l10-4z"
          fill="#E5484D"
          opacity="0.15"
          stroke="#E5484D"
          strokeWidth="1.6"
        />
        <path d="M11 16l3 3 7-7" stroke="#E5484D" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: 'iam',
    label: 'IAM users',
    subtitle: 'People you employ',
    body: 'Identity and Access Management. Each user gets only the permissions the job needs.',
    tint: '#000099',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" stroke="#000099" strokeWidth="1.6" fill="none" />
        <circle cx="22" cy="14" r="3" stroke="#000099" strokeWidth="1.4" fill="none" />
        <path d="M4 26c0-4 3-7 8-7s8 3 8 7" stroke="#000099" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M20 26c0-3 2-5 5-5s5 2 5 5" stroke="#000099" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'federated',
    label: 'Federated users',
    subtitle: 'People signed in elsewhere',
    body: 'They log in with corporate credentials they already have. No new password to manage.',
    tint: '#F5871F',
    icon: (
      <>
        <rect x="6" y="8" width="10" height="16" rx="1.5" fill="#F5871F" opacity="0.15" stroke="#F5871F" strokeWidth="1.4" />
        <rect x="18" y="8" width="10" height="16" rx="1.5" fill="none" stroke="#F5871F" strokeWidth="1.4" />
        <path d="M14 16h6M19 13l3 3-3 3" stroke="#F5871F" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

export function RootAndIamScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Authentication" titleAccent="Root · IAM · Federated" compact={compact}>
      <div className="mt-3 space-y-2.5">
        {USERS.map((u, i) => (
          <UserRow key={u.id} u={u} visible={shown(u.id) || (u.id === 'root' && (shown('lock') || shown('iam') || shown('federated') || shown('summary')))} />
        ))}
      </div>

      {shown('summary') ? (
        <p className="anim-rise mt-3 border-l-[3px] border-gold pl-3 text-[clamp(0.79rem,1.68cqw,0.98rem)] leading-relaxed text-ink/70">
          <strong className="text-blue-deep">Root once</strong>. IAM for the people you
          employ. Federated for the people you trust to sign in elsewhere.
        </p>
      ) : null}
    </SlideFrame>
  )
}

type User = {
  id: string
  label: string
  subtitle: string
  body: string
  tint: string
  icon: React.ReactNode
}

function UserRow({ u, visible }: { u: User; visible: boolean }) {
  if (!visible) {
    return <div className="min-h-[62px] rounded-md border-2 border-dashed border-line/60 opacity-30" />
  }
  return (
    <div
      className="anim-rise flex items-start gap-3 rounded-md border-2 bg-white p-3 shadow-lift"
      style={{ borderColor: u.tint }}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md" style={{ background: `${u.tint}12` }}>
        <svg viewBox="0 0 32 32" className="h-7 w-7">
          {u.icon}
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-[clamp(0.9rem,1.96cqw,1.12rem)] font-bold" style={{ color: u.tint }}>
            {u.label}
          </h3>
          <span className="font-mono text-[11.5px] text-ink/50">{u.subtitle}</span>
        </div>
        <p className="mt-0.5 text-[clamp(0.74rem,1.51cqw,0.9rem)] leading-snug text-ink/65">
          {u.body}
        </p>
      </div>
    </div>
  )
}
