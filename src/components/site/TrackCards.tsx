'use client'

import { tracks } from '@/config/tracks'
import { courses } from '@/config/courses'
import { EnquireButton } from './Enquiry'
import { buttonClass } from './ui'
import { IconCheck, IconVideo, IconPlay } from './icons'
import { CourseIcon } from './CourseGrid'

/**
 * The two ways to learn, side by side. No prices: each button opens the
 * enquiry form with that track chosen, and sales quote by country.
 */
export function TrackCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tracks.map((t) => {
        const live = t.id === 'instructor-led'
        return (
          <article
            key={t.id}
            id={t.id}
            className={`relative flex scroll-mt-24 flex-col overflow-hidden rounded-3xl p-6 sm:p-8 ${
              live ? 'bg-blue-deep text-white' : 'border border-line bg-surface'
            }`}
          >
            {live ? <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[34px] border-gold/15" /> : null}
            <div className="relative flex items-center gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${live ? 'bg-gold text-blue-deep' : 'bg-blue/10 text-blue'}`}>
                {live ? <IconVideo size={24} /> : <IconPlay size={20} />}
              </span>
              <div>
                <h3 className={`font-display text-[22px] font-extrabold ${live ? '' : 'text-ink'}`}>{t.name}</h3>
                <p className={`text-[14.5px] ${live ? 'text-white/70' : 'text-ink/60'}`}>{t.tagline}</p>
              </div>
              {t.badge ? (
                <span className="ml-auto hidden rounded-full bg-gold px-2.5 py-1 font-display text-[11px] font-extrabold text-blue-deep sm:inline">{t.badge}</span>
              ) : null}
            </div>

            <ul className="relative mt-6 flex-1 space-y-3">
              {t.benefits.map((b) => (
                <li key={b} className={`flex gap-2.5 text-[15px] leading-snug ${live ? 'text-white/85' : 'text-ink/80'}`}>
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${live ? 'bg-gold/20 text-gold' : 'bg-mint/10 text-mint'}`}>
                    <IconCheck size={13} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {live ? (
              <div className="relative mt-6 flex flex-wrap gap-2">
                {courses.map((c) => (
                  <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12.5px] font-semibold text-white/85">
                    <CourseIcon kind={c.icon} size={14} />
                    {c.short}
                  </span>
                ))}
              </div>
            ) : null}

            <p className={`relative mt-6 text-[13px] ${live ? 'text-white/55' : 'text-ink/50'}`}>
              Pricing depends on your country. Our team will quote you personally.
            </p>
            <EnquireButton track={t.id} className={buttonClass(live ? 'gold' : 'primary', 'lg', 'relative mt-3 w-full')}>
              {t.cta}
            </EnquireButton>
          </article>
        )
      })}
    </div>
  )
}
