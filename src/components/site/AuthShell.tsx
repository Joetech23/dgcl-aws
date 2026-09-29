import Link from 'next/link'
import type { ReactNode } from 'react'
import { catalog } from '@/config/catalog'
import { Logo } from './ui'
import { IconCheck } from './icons'

/**
 * Sign-up and log-in share one frame: the form on white, and on wide screens
 * a DGCL blue panel reminding the learner what they get for free. On a phone
 * only the form shows, so the keyboard never hides anything important.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const free = catalog.filter((m) => m.free)
  return (
    <div className="grid min-h-[100dvh] bg-surface lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col px-5 pb-10 pt-5 sm:px-10">
        <Link href="/" aria-label="DGCL Digital Cloud Academy, home" className="self-start">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">{children}</div>
      </div>

      <aside className="relative hidden overflow-hidden bg-blue-deep p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border-[48px] border-white/[0.05]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[40px] border-gold/15" />
        <div className="relative max-w-md">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-gold">Free with your account</p>
          <h2 className="mt-3 font-display text-[34px] font-extrabold leading-[1.1] tracking-[-0.025em]">The Introduction and four modules, free</h2>
          <ul className="mt-8 space-y-3">
            {free.map((m) => (
              <li key={m.slug} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold font-display text-[12px] font-extrabold text-blue-deep">
                  {m.number === 0 ? 'i' : m.number}
                </span>
                <span className="font-display text-[14.5px] font-semibold">{m.title}</span>
                <IconCheck size={16} className="ml-auto shrink-0 text-mint" />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[14px] leading-relaxed text-white/60">Your progress saves as you go, so you can start on your laptop and carry on from your phone.</p>
        </div>
      </aside>
    </div>
  )
}

export function Field({
  label,
  hint,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="font-display text-[13.5px] font-bold text-ink">{label}</span>
      <input
        {...input}
        className="mt-1.5 block h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none transition placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
      {hint ? <span className="mt-1.5 block text-[12.5px] text-ink/50">{hint}</span> : null}
    </label>
  )
}
