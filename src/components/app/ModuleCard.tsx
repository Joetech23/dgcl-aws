import Link from 'next/link'
import type { CatalogModule } from '@/config/catalog'
import type { ModuleState } from '@/lib/access'
import { Progress } from '@/components/site/ui'
import { IconCheck, IconClock, IconLock, IconPlay } from '@/components/site/icons'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

const label: Record<ModuleState, string> = {
  done: 'Completed',
  open: 'Start',
  'needs-programme': 'Open with a programme',
  'in-production': 'Coming soon',
}

/** One module in a grid: number, title, time, progress, and what to do next. */
export function ModuleCard({ m, state, fraction }: { m: CatalogModule; state: ModuleState; fraction: number }) {
  const locked = state === 'needs-programme'
  const started = state === 'open' && fraction > 0
  return (
    <Link
      href={`/learn/${m.slug}/`}
      className={`group flex flex-col rounded-2xl border bg-surface p-4 transition sm:p-5 ${
        locked ? 'border-line/80' : 'border-line hover:-translate-y-0.5 hover:border-blue/30 hover:shadow-lift'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl font-display text-[13px] font-extrabold ${
            state === 'done' ? 'bg-mint text-white' : locked ? 'bg-slate text-ink/40' : 'bg-blue text-white'
          }`}
        >
          {state === 'done' ? <IconCheck size={16} /> : moduleBadge(m.number)}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-ink/45">
          <IconClock size={14} />
          {m.free ? 'Free · ' : ''}{m.minutes} min
        </span>
        {locked ? <IconLock size={16} className="text-ink/35" /> : null}
      </div>
      <p className={`mt-3 font-display text-[15px] font-bold leading-snug ${locked ? 'text-ink/55' : 'text-ink'}`}>{m.title}</p>
      <div className="mt-auto pt-4">
        {state === 'open' || state === 'done' ? <Progress value={fraction} /> : null}
        <p
          className={`mt-2.5 inline-flex items-center gap-1.5 font-display text-[12.5px] font-bold ${
            state === 'done' ? 'text-mint' : locked || state === 'in-production' ? 'text-ink/45' : 'text-blue'
          }`}
        >
          {state === 'open' ? <IconPlay size={11} /> : null}
          {started ? `Continue · ${Math.round(fraction * 100)}%` : label[state]}
        </p>
      </div>
    </Link>
  )
}
