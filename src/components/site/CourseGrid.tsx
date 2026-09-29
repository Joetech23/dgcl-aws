import Link from 'next/link'
import { courses, type Course } from '@/config/courses'
import { IconArrowRight, IconCalendar } from './icons'
import { EnquireButton } from './Enquiry'

/**
 * All DGCL programmes. The AWS course leads to the free start; the others,
 * which DGCL runs as live cohorts today, take an enquiry until their online
 * versions exist.
 */
export function CourseGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {courses.map((c) => (
        <article key={c.id} className={`flex flex-col overflow-hidden rounded-2xl border bg-surface ${c.online ? 'border-blue/40 shadow-lift' : 'border-line'}`}>
          <div className="relative h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.tint} 0%, ${c.tint}CC 100%)` }}>
            <div aria-hidden className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-white/15" />
            <div aria-hidden className="absolute -bottom-12 right-16 h-24 w-24 rounded-full border-[12px] border-white/10" />
            <span className="absolute bottom-4 left-5 grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white">
              <CourseIcon kind={c.icon} />
            </span>
            {c.online ? (
              <span className="absolute right-4 top-4 rounded-full bg-gold px-2.5 py-1 font-display text-[11px] font-extrabold text-blue-deep">Start free</span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-[17px] font-extrabold leading-snug text-ink">{c.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/60">{c.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {c.topics.map((t) => (
                <li key={t} className="rounded-md bg-slate px-2 py-1 text-[12px] font-semibold text-ink/65">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-ink/50">
              <IconCalendar size={14} className="shrink-0" />
              {c.cohort}
            </p>
            <div className="mt-auto pt-5">
              {c.online ? (
                <Link href="/signup/" className="inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-blue">
                  Start Module 1 free <IconArrowRight size={16} />
                </Link>
              ) : (
                <EnquireLink course={c} />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function EnquireLink({ course }: { course: Course }) {
  return (
    <EnquireButton track="instructor-led" course={course.title} className="inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-ink/75 hover:text-blue">
      Ask about the next cohort <IconArrowRight size={16} />
    </EnquireButton>
  )
}

export function CourseIcon({ kind, size = 26 }: { kind: Course['icon']; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (kind === 'cloud') return <svg {...p}><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 9.2 4.4 4.4 0 0 0 7 18Z" /></svg>
  if (kind === 'pipeline') return <svg {...p}><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 12h4l5-6M11.5 12l5 6" /></svg>
  if (kind === 'shield') return <svg {...p}><path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
  return <svg {...p}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h.5V4H9ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-.5V4h.5Z" /></svg>
}
