'use client'

import { useAccount } from '@/lib/backend'
import { courses } from '@/config/courses'
import { tracks } from '@/config/tracks'
import { EnquireButton } from '@/components/site/Enquiry'
import { CourseIcon } from '@/components/site/CourseGrid'
import { buttonClass } from '@/components/site/ui'
import { IconCalendar, IconCheck, IconVideo } from '@/components/site/icons'

/**
 * Instructor-led: DGCL's live classes, one card per course. AWS Cloud is
 * here too (its live version is paid); DevOps, Cybersecurity and Data and AI
 * are taught live today. Every card leads to the enquiry form.
 */
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
          Small online classes, hands-on labs and a cohort to learn with. New cohorts start every four months.
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

      <h2 className="mt-8 font-display text-[18px] font-extrabold text-ink">Choose a course</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <article key={c.id} className="flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_rgb(var(--line))]">
            <div className="flex items-center gap-4 p-5 sm:p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white" style={{ background: c.tint }}>
                <CourseIcon kind={c.icon} size={28} />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[17px] font-extrabold leading-snug text-ink">{c.title}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-ink/50">
                  <IconCalendar size={14} /> Cohort every 4 months
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="text-[14px] leading-relaxed text-ink/65">{c.summary.replace(' The Introduction and Modules 1 to 4 are free.', '')}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {c.topics.map((t) => (
                  <li key={t} className="rounded-md bg-slate px-2 py-1 text-[12px] font-semibold text-ink/65">
                    {t}
                  </li>
                ))}
              </ul>
              {c.online ? (
                <p className="mt-3 text-[13px] text-ink/55">The self-paced version is free to start; live classes are a paid programme.</p>
              ) : null}
              <EnquireButton track="instructor-led" course={c.title} className={buttonClass(c.online ? 'secondary' : 'primary', 'md', 'mt-auto w-full')}>
                Ask about the next cohort
              </EnquireButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
