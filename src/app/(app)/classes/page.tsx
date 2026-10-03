'use client'

import { useAccount } from '@/lib/backend'
import { courses, type Course } from '@/config/courses'
import { tracks } from '@/config/tracks'
import { EnquireButton } from '@/components/site/Enquiry'
import { CourseIcon } from '@/components/site/CourseGrid'
import { buttonClass } from '@/components/site/ui'
import { IconCheck, IconPlay, IconVideo } from '@/components/site/icons'

/**
 * Instructor-led: DGCL's live classes, one card per domain. DevOps Tools,
 * Cybersecurity and Healthcare Data list their classes in order (1, 2, 3...);
 * each one becomes playable when its recording is added in config/courses.ts.
 * AWS Cloud is here too: its live classes are a paid programme.
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
          Small online classes and hands-on labs, taught by a DGCL instructor. The class recordings are published here, one by one.
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
                  <IconVideo size={14} /> Live instructor classes
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

              {c.liveClasses.length ? <ClassList course={c} /> : null}
              {c.online ? <p className="mt-3 text-[13px] text-ink/55">The self-paced version is free to start; live classes are a paid programme.</p> : null}

              <EnquireButton track="instructor-led" course={c.title} className={buttonClass(c.online ? 'secondary' : 'primary', 'md', 'mt-5 w-full md:mt-auto')}>
                {c.online ? 'Ask about live AWS classes' : 'Join the live classes'}
              </EnquireButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/** Class 1, 2, 3... A class with a recording plays; the rest say they are on the way. */
function ClassList({ course }: { course: Course }) {
  const ready = course.liveClasses.filter((k) => k.video).length
  return (
    <div className="mb-5 mt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-display text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink/45">Live classes</h4>
        <p className="text-[12.5px] text-ink/50">{ready ? `${ready} of ${course.liveClasses.length} ready to watch` : 'Recordings on the way'}</p>
      </div>
      <ol className="mt-2.5 overflow-hidden rounded-2xl border border-line">
        {course.liveClasses.map((k, i) => {
          const row = (
            <>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[13.5px] font-extrabold"
                style={k.video ? { background: course.tint, color: '#fff' } : { boxShadow: `inset 0 0 0 1.5px ${course.tint}66`, color: course.tint }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[14px] font-bold text-ink">{k.title}</span>
                {k.about ? <span className="block truncate text-[12.5px] text-ink/55">{k.about}</span> : null}
              </span>
              {k.video ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[12px] font-bold text-white" style={{ background: course.tint }}>
                  <IconPlay size={12} /> Watch
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate px-2.5 py-1.5 font-display text-[11.5px] font-bold text-ink/55">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70 motion-reduce:hidden" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  Coming soon
                </span>
              )}
            </>
          )
          const cls = `flex min-h-[56px] items-center gap-3 px-3.5 py-2.5 ${i ? 'border-t border-line' : ''}`
          return (
            <li key={k.title}>
              {k.video ? (
                <a href={k.video} target="_blank" rel="noopener noreferrer" className={`${cls} transition hover:bg-slate`}>
                  {row}
                </a>
              ) : (
                <div className={cls}>{row}</div>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/50">The first recordings are being prepared now, and a new class is added each week.</p>
    </div>
  )
}
