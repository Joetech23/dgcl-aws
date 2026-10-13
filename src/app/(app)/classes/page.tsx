'use client'

import { useAccount } from '@/lib/backend'
import { catalog } from '@/config/catalog'
import { courses, type Course, type OutlineSection } from '@/config/courses'
import { CONSULTATION_FEE_USD, money } from '@/config/pricing'
import { tracks } from '@/config/tracks'
import { EnquireButton } from '@/components/site/Enquiry'
import { CourseIcon } from '@/components/site/CourseGrid'
import { buttonClass } from '@/components/site/ui'
import { IconCheck, IconVideo } from '@/components/site/icons'

/**
 * Instructor-led: DGCL's four products, each with what it teaches, module by
 * module. There are no recorded classes here. To join, a learner books a
 * one-to-one consultation: the Enrol button opens the enquiry form, and the
 * consultation fee confirms it. DGCL then agrees the training fee for the
 * learner's country directly with them.
 */
const fee = money(CONSULTATION_FEE_USD)

/**
 * A product's table of contents: its own outline, or for AWS the course
 * catalogue (the Introduction, then Modules 1 to 14).
 */
function outlineOf(c: Course): { sections: OutlineSection[]; label?: string } {
  if (c.outline.length) return { sections: c.outline, label: c.outlineLabel }
  if (c.id === 'aws') {
    const intro = catalog.filter((m) => m.number === 0).map((m) => m.title)
    const modules = catalog.filter((m) => m.number > 0).map((m) => m.title)
    return { sections: [{ items: intro }, { items: modules, numbered: true }], label: `Introduction and ${modules.length} modules` }
  }
  return { sections: [] }
}

export default function InstructorLed() {
  const { enrollment } = useAccount()
  const live = tracks.find((t) => t.id === 'instructor-led')!
  const onLive = enrollment?.track === 'instructor-led'

  return (
    <div className="mx-auto max-w-[1180px]">
      <section className="relative overflow-hidden rounded-3xl bg-blue-deep p-6 text-white sm:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-gold/15" />
        <p className="relative inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
          <IconVideo size={15} /> Instructor-led
        </p>
        <h1 className="relative mt-2 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold leading-tight tracking-[-0.025em]">
          Learn live with a DGCL instructor
        </h1>
        <p className="relative mt-2 max-w-xl text-[15px] leading-relaxed text-white/70">
          Four training programmes, taught live online by a DGCL instructor. Look through what each one covers, then book a one-to-one consultation to join.
        </p>
        <ul className="relative mt-5 grid gap-2 sm:grid-cols-2 lg:max-w-3xl">
          {live.benefits.slice(0, 4).map((b) => (
            <li key={b} className="flex gap-2 text-[14px] text-white/85">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-gold" />
              {b}
            </li>
          ))}
        </ul>
        {onLive ? (
          <p className="relative mt-5 inline-flex rounded-full bg-mint/20 px-3 py-1.5 font-display text-[13px] font-bold text-white">
            You are on the instructor-led programme. Your class details come by email.
          </p>
        ) : null}
      </section>

      {/* ---------- how joining works ---------- */}
      <section aria-label="How to join" className="mt-5 grid gap-3 rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:grid-cols-3 sm:p-6">
        {[
          ['Choose a programme', 'See its modules below and press Enrol.'],
          [`Book your consultation, ${fee}`, 'Leave your details and pay the fee. An adviser then agrees a time with you.'],
          ['Meet your adviser', `One to one. If you enrol, the ${fee} comes off your training fee.`],
        ].map(([title, body], n) => (
          <div key={title} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue font-display text-[13px] font-extrabold text-white">{n + 1}</span>
            <div>
              <p className="font-display text-[14.5px] font-extrabold leading-snug text-ink">{title}</p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-ink/60">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <h2 className="mt-8 font-display text-[18px] font-extrabold text-ink">Choose a programme</h2>
      <div className="mt-3 grid items-start gap-4 md:grid-cols-2">
        {courses.map((c) => {
          const { sections, label } = outlineOf(c)
          return (
            <article key={c.id} data-course={c.id} className="flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_rgb(var(--line))]">
              <div className="flex items-center gap-4 p-5 sm:p-6">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white" style={{ background: c.tint }}>
                  <CourseIcon kind={c.icon} size={28} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[17px] font-extrabold leading-snug text-ink">{c.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-ink/50">
                    <IconVideo size={14} /> Instructor-led, live online
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="text-[14px] leading-relaxed text-ink/65">{c.summary}</p>

                {sections.length ? (
                  <details className="group mt-4 rounded-2xl border border-line" open>
                    <summary className="flex min-h-[48px] cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 font-display text-[13.5px] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                      What you will learn
                      {label ? <span className="rounded-full bg-slate px-2 py-0.5 text-[11.5px] font-bold text-ink/55">{label}</span> : null}
                      <span aria-hidden className="ml-auto text-ink/40 transition group-open:rotate-180">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 5 5 5-5" /></svg>
                      </span>
                    </summary>
                    <div className="border-t border-line px-4 pb-3 pt-1">
                      {sections.map((section, n) => (
                        <section key={section.heading ?? n} className={section.heading ? 'mt-3' : 'mt-2'}>
                          {section.heading ? (
                            <h4 className="font-display text-[11.5px] font-extrabold uppercase tracking-[0.1em]" style={{ color: c.tint }}>
                              {section.heading}
                            </h4>
                          ) : null}
                          <ol className={section.heading ? 'mt-1' : ''}>
                            {section.items.map((title, i) => (
                              <li key={title} className="flex gap-3 py-1.5 text-[13.5px] leading-snug text-ink/75">
                                {section.numbered ? (
                                  <span className="w-5 shrink-0 text-right font-display text-[12.5px] font-extrabold" style={{ color: c.tint }}>
                                    {i + 1}
                                  </span>
                                ) : (
                                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.tint, marginLeft: section.heading ? 0 : 14 }} />
                                )}
                                {title}
                              </li>
                            ))}
                          </ol>
                        </section>
                      ))}
                    </div>
                  </details>
                ) : (
                  <div className="mt-4 rounded-2xl border border-line px-4 py-3">
                    <p className="font-display text-[13.5px] font-extrabold text-ink">What you will learn</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {c.topics.map((t) => (
                        <li key={t} className="rounded-md bg-slate px-2 py-1 text-[12.5px] font-semibold text-ink/70">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-4 text-[13px] leading-relaxed text-ink/55">
                  To enrol, book a one-to-one consultation for {fee}. It comes off your training fee if you join.
                </p>
                <EnquireButton track="instructor-led" course={c.title} className={buttonClass('primary', 'md', 'mt-3 w-full')}>
                  Enrol
                </EnquireButton>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
