'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { catalog, type CatalogModule } from '@/config/catalog'
import { moduleFraction, moduleState, type ModuleState } from '@/lib/access'
import type { Enrollment } from '@/lib/backend'
import { IconCheck, IconChevron, IconClock, IconHand, IconLock, IconPlay } from '@/components/site/icons'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/**
 * Every module as an accordion; the current one open, showing its lessons.
 * Modelled on the learner's reference: numbered rows, time, a tick when done,
 * and a lock where a package is needed.
 */
export function CourseOutline({
  current,
  index,
  completed,
  enrollment,
  onSelect,
}: {
  current: CatalogModule
  index: number
  completed: Set<string>
  enrollment: Enrollment | null
  onSelect: (i: number) => void
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [index])

  return (
    <nav aria-label="Course outline" className="space-y-2">
      {catalog.map((m) => {
        const state = moduleState(m, completed, enrollment)
        const open = m.slug === current.slug
        return (
          <div key={m.slug} className={`rounded-2xl bg-surface ${open ? 'shadow-[0_1px_0_rgb(var(--line)),0_12px_30px_-22px_rgba(0,0,102,0.35)]' : ''}`}>
            <Link
              href={`/learn/${m.slug}/`}
              aria-current={open ? 'page' : undefined}
              className="flex min-h-[60px] items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-slate/60"
            >
              <Badge m={m} state={state} open={open} />
              <span className={`min-w-0 flex-1 font-display text-[14px] font-bold leading-snug ${state === 'needs-programme' ? 'text-ink/50' : 'text-ink'}`}>
                {m.short}
              </span>
              <Status m={m} state={state} completed={completed} />
              <IconChevron size={16} className={`shrink-0 text-ink/35 transition ${open ? 'rotate-180' : ''}`} />
            </Link>

            {open && m.lesson ? (
              <ol className="relative px-3 pb-3 pt-1">
                {m.lesson.slides.map((s, i) => {
                  const done = completed.has(s.id)
                  const here = i === index
                  return (
                    <li key={s.id} className="relative">
                      {i < m.lesson!.slides.length - 1 ? (
                        <span aria-hidden className="absolute left-[19px] top-9 h-[calc(100%-22px)] border-l border-dashed border-line" />
                      ) : null}
                      <button
                        ref={here ? activeRef : undefined}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-current={here ? 'step' : undefined}
                        className={`relative flex min-h-[48px] w-full items-center gap-3 rounded-xl px-1.5 py-1.5 text-left transition ${
                          here ? 'bg-blue/[0.06]' : 'hover:bg-slate/70'
                        }`}
                      >
                        <span
                          className={`relative z-10 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full ${
                            done ? 'bg-mint text-white' : here ? 'bg-blue text-white' : 'border border-line bg-surface text-ink/45'
                          }`}
                        >
                          {done ? <IconCheck size={14} /> : here ? <IconPlay size={10} /> : <span className="font-display text-[10.5px] font-bold">{i + 1}</span>}
                        </span>
                        <span className={`min-w-0 flex-1 text-[13.5px] leading-snug ${here ? 'font-semibold text-ink' : done ? 'text-ink/55' : 'text-ink/80'}`}>
                          {s.navLabel}
                        </span>
                        {s.interaction ? (
                          <span className="inline-flex shrink-0 items-center gap-1 font-display text-[11px] font-bold text-mint">
                            <IconHand size={13} />
                            Activity
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ol>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

function Badge({ m, state, open }: { m: CatalogModule; state: ModuleState; open: boolean }) {
  const base = 'grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-[13px] font-extrabold'
  if (state === 'done') return <span className={`${base} bg-mint text-white`}><IconCheck size={16} /></span>
  if (open || state === 'open') return <span className={`${base} ${open ? 'bg-blue text-white' : 'bg-blue-deep text-white'}`}>{m.number === 0 ? <span className="text-[10px]">Intro</span> : m.number}</span>
  return <span className={`${base} bg-slate text-ink/45`}>{m.number === 0 ? <span className="text-[10px]">Intro</span> : m.number}</span>
}

function Status({ m, state, completed }: { m: CatalogModule; state: ModuleState; completed: Set<string> }) {
  if (state === 'needs-programme') return <IconLock size={16} className="shrink-0 text-ink/35" />
  const f = moduleFraction(m, completed)
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-ink/45">
      {f > 0 && f < 1 ? <span className="font-display font-bold text-blue">{Math.round(f * 100)}%</span> : <><IconClock size={13} />{m.minutes}m</>}
    </span>
  )
}
