'use client'

import { useState } from 'react'
import { PROGRAMME_MODULES_TEXT, type CatalogModule } from '@/config/catalog'
import { money } from '@/config/pricing'
import { tracks } from '@/config/tracks'
import { buyModule, useAccount } from '@/lib/backend'
import { moduleName } from '@/lib/course/names'
import { EnquireButton } from '@/components/site/Enquiry'
import { buttonClass } from '@/components/site/ui'
import { IconArrowRight, IconCheck, IconLock, IconPlay, IconVideo } from '@/components/site/icons'

/**
 * Shown in place of the lesson when a module is not open to the learner yet.
 *
 * Leads with what the module teaches, so the learner is choosing an outcome.
 * A priced module is bought here, in one payment on Stripe's own page. A
 * module with no price needs a programme: either button opens the enquiry
 * form and DGCL's team quotes for the learner's country.
 */
export function Paywall({ m, celebrate = false }: { m: CatalogModule; celebrate?: boolean }) {
  const priced = m.price !== null
  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_rgb(var(--line))]">
      <div className="relative overflow-hidden bg-blue-deep px-6 py-8 text-white sm:px-8">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-[28px] border-gold/20" />
        <p className="relative inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
          {celebrate ? (
            'Free modules complete'
          ) : (
            <>
              <IconLock size={14} /> {moduleName(m.number)}
            </>
          )}
        </p>
        <h1 className="relative mt-2 max-w-xl font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight tracking-[-0.02em]">
          {celebrate ? `Well done. Next up: ${m.title}` : m.title}
        </h1>
        <ul className="relative mt-5 grid gap-2 sm:grid-cols-3">
          {m.outcomes.map((o) => (
            <li key={o} className="flex gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[13.5px] leading-snug text-white/85">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-gold" />
              {o}
            </li>
          ))}
        </ul>
      </div>

      {priced ? <Buy m={m} /> : <Programmes />}
    </div>
  )
}

/** One module, one payment. */
function Buy({ m }: { m: CatalogModule }) {
  const { mode } = useAccount()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lessons = m.lesson?.slides.length ?? 0

  async function pay() {
    setBusy(true)
    setError(null)
    const res = await buyModule(m.slug)
    if (res.ok && res.url) {
      window.location.assign(res.url)
      return
    }
    setBusy(false)
    if (!res.ok) setError(res.error)
  }

  return (
    <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <p className="font-display text-[17px] font-extrabold text-ink">Unlock {moduleName(m.number)}</p>
        <ul className="mt-3 space-y-2">
          {[
            lessons ? `${lessons} narrated lessons, about ${m.minutes} minutes` : `About ${m.minutes} minutes of narrated lessons`,
            'Activities that check you understood',
            'One payment. The module stays open on your account',
          ].map((t) => (
            <li key={t} className="flex gap-2 text-[14px] text-ink/70">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-mint" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border-2 border-blue/40 bg-blue/[0.03] p-5 sm:p-6">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] text-ink">{money(m.price ?? 0)}</span>
          <span className="text-[13.5px] text-ink/55">US dollars, one time</span>
        </p>
        <button type="button" onClick={pay} disabled={busy} className={buttonClass('primary', 'lg', 'mt-4 w-full')}>
          {busy ? 'Opening secure payment…' : `Unlock for ${money(m.price ?? 0)}`}
          {!busy ? <IconArrowRight size={18} /> : null}
        </button>
        {error ? (
          <p role="alert" className="mt-3 rounded-xl bg-rose/10 px-3.5 py-2.5 text-[13.5px] text-rose">
            {error}
          </p>
        ) : null}
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink/50">
          {mode === 'preview' ? 'Preview mode: no payment is taken, the module simply opens.' : 'You pay on Stripe’s secure page. Your card details never reach this site.'}
        </p>
        <p className="mt-3 border-t border-line pt-3 text-[13px] text-ink/60">
          Prefer the whole course?{' '}
          <EnquireButton track="self-paced" className="font-semibold text-blue hover:underline">
            Ask about a programme
          </EnquireButton>
        </p>
      </div>
    </div>
  )
}

/** No price online: join a programme through DGCL's team. */
function Programmes() {
  return (
    <div className="p-5 sm:p-8">
      <p className="font-display text-[17px] font-extrabold text-ink">Choose how to continue</p>
      <p className="mt-1 text-[14px] text-ink/55">
        {PROGRAMME_MODULES_TEXT} open when you join a programme. Tell us which suits you and our team will contact you with a price for your country.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {tracks.map((t) => {
          const live = t.id === 'instructor-led'
          return (
            <div key={t.id} className={`flex flex-col rounded-2xl border-2 p-5 ${live ? 'border-blue/40 bg-blue/[0.03]' : 'border-line'}`}>
              <div className="flex items-center gap-2.5">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${live ? 'bg-blue text-white' : 'bg-blue/10 text-blue'}`}>
                  {live ? <IconVideo size={18} /> : <IconPlay size={15} />}
                </span>
                <span className="font-display text-[16px] font-extrabold text-ink">{t.name}</span>
              </div>
              <ul className="mt-3 flex-1 space-y-1.5">
                {t.short.map((s) => (
                  <li key={s} className="flex gap-2 text-[13.5px] text-ink/70">
                    <IconCheck size={15} className="mt-0.5 shrink-0 text-mint" />
                    {s}
                  </li>
                ))}
              </ul>
              <EnquireButton track={t.id} className={buttonClass(live ? 'primary' : 'secondary', 'md', 'mt-4 w-full')}>
                {t.cta}
              </EnquireButton>
            </div>
          )
        })}
      </div>
    </div>
  )
}
