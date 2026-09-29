'use client'

import type { CatalogModule } from '@/config/catalog'
import { tracks } from '@/config/tracks'
import { moduleName } from '@/lib/course/names'
import { EnquireButton } from '@/components/site/Enquiry'
import { buttonClass } from '@/components/site/ui'
import { IconCheck, IconLock, IconPlay, IconVideo } from '@/components/site/icons'

/**
 * Shown in place of the lesson when a module needs a programme.
 *
 * Leads with what this module teaches, so the learner is choosing an outcome,
 * then offers the two ways to continue. There is no price here: either button
 * opens the enquiry form and DGCL's team quotes for the learner's country.
 */
export function Paywall({ m, celebrate = false }: { m: CatalogModule; celebrate?: boolean }) {
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

      <div className="p-5 sm:p-8">
        <p className="font-display text-[17px] font-extrabold text-ink">Choose how to continue</p>
        <p className="mt-1 text-[14px] text-ink/55">Modules 5 to 14 open when you join a programme. Tell us which suits you and our team will call with a price for your country.</p>

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
    </div>
  )
}
