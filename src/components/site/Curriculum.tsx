import Link from 'next/link'
import { catalog } from '@/config/catalog'
import { IconClock, IconLock, IconPlay } from './icons'
import { Pill } from './ui'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/**
 * All fifteen modules as one path. Free modules link straight to sign-up and
 * the lesson; paid ones show what they cover and a lock, so the learner can
 * see exactly what the packages buy.
 */
export function Curriculum({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative">
      {catalog.map((m, n) => (
        <li key={m.slug} className="relative flex gap-4 pb-3 sm:gap-5">
          {/* the path line */}
          {n < catalog.length - 1 ? (
            <span
              aria-hidden
              className={`absolute left-[19px] top-11 h-[calc(100%-36px)] w-px ${m.free ? 'bg-blue/25' : 'border-l border-dashed border-line'}`}
            />
          ) : null}
          <span
            className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-[13px] font-extrabold ${
              m.free ? 'bg-blue text-white' : 'bg-slate text-ink/45'
            }`}
          >
            {moduleBadge(m.number)}
          </span>

          <Link
            href={m.free ? `/signup/?next=/learn/${m.slug}/` : '/plans/'}
            className="group flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border border-line bg-surface p-4 transition hover:border-blue/30 hover:shadow-lift sm:flex-row sm:items-center sm:gap-5"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15.5px] font-bold leading-snug text-ink">{m.title}</p>
              {!compact ? <p className="mt-1 text-[13.5px] leading-snug text-ink/55">{m.blurb}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[12.5px] text-ink/45">
                <IconClock size={14} />
                {m.minutes} min
              </span>
              {m.free ? (
                <Pill tone="mint">
                  <IconPlay size={10} />
                  Free
                </Pill>
              ) : (
                <Pill tone="grey">
                  <IconLock size={12} />
                  Paid
                </Pill>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}
