'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { catalog, findModule } from '@/config/catalog'
import { canLearn, freeTrackDone, moduleFraction, moduleState } from '@/lib/access'
import { getProgressStore } from '@/lib/progress'
import { useRequireUser, Avatar, StreakPill } from '@/components/app/AppShell'
import { LessonPlayer } from './LessonPlayer'
import { CourseOutline } from './CourseOutline'
import { Paywall } from './Paywall'
import { ButtonLink, Progress } from '@/components/site/ui'
import { moduleName } from '@/lib/course/names'
import { ThemeToggle } from '@/components/site/Theme'
import { IconArrowLeft, IconArrowRight, IconAward, IconBook, IconCheck, IconClose, IconMenu } from '@/components/site/icons'

/**
 * /learn/<module>. Outline on the left (a bottom sheet on phones), the lesson
 * on the right, and whatever the learner needs instead when the module is not
 * open to them yet: the module before it, or a package.
 */
const OUTLINE_KEY = 'dgcl-outline'

export function LearnView({ slug }: { slug: string }) {
  const a = useRequireUser()
  const router = useRouter()
  const m = findModule(slug)!
  const [index, setIndex] = useState<number | null>(null)
  const [sheet, setSheet] = useState(false)
  // Desktop only: the outline can be folded away so the lesson gets the full
  // width. Remembered between visits.
  const [outlineOpen, setOutlineOpen] = useState(true)
  useEffect(() => {
    try {
      if (window.localStorage.getItem(OUTLINE_KEY) === 'closed') setOutlineOpen(false)
    } catch {
      /* no storage: stay open */
    }
  }, [])
  const toggleOutline = () => {
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      setSheet(true)
      return
    }
    setOutlineOpen((v) => {
      try {
        window.localStorage.setItem(OUTLINE_KEY, v ? 'closed' : 'open')
      } catch {
        /* ignore */
      }
      return !v
    })
  }

  // Resume at the bookmark if it is in this module, else the first unfinished lesson.
  useEffect(() => {
    if (!a.ready || index !== null || !m.lesson) return
    const slides = m.lesson.slides
    const bm = getProgressStore().load().bookmark
    const at = slides.findIndex((s) => s.id === bm)
    const first = slides.findIndex((s) => !a.completed.has(s.id))
    setIndex(at >= 0 && !a.completed.has(slides[at].id) ? at : first >= 0 ? first : 0)
  }, [a.ready, a.completed, index, m.lesson])

  if (!a.ready || !a.user) return <div className="min-h-[100dvh] bg-slate" aria-busy="true" />

  const state = moduleState(m, a.completed, a.enrollment)
  const nextM = catalog.find((c) => c.number === m.number + 1) ?? null
  const nextState = nextM ? moduleState(nextM, a.completed, a.enrollment) : null
  const done = moduleFraction(m, a.completed) === 1
  const i = index ?? 0
  const total = m.lesson?.slides.length ?? 0

  const select = (n: number) => {
    setIndex(n)
    setSheet(false)
  }

  const outline = <CourseOutline current={m} index={i} completed={a.completed} enrollment={a.enrollment} onSelect={select} />

  return (
    <div className="min-h-[100dvh] bg-slate">
      {/* ---------- top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex h-16 items-center gap-2 px-3 sm:px-5 lg:h-[72px] lg:px-6">
          {m.lesson && canLearn(state) ? (
            <button
              type="button"
              onClick={toggleOutline}
              aria-label="Course content"
              aria-expanded={outlineOpen}
              title={outlineOpen ? 'Hide course content' : 'Show course content'}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition ${
                outlineOpen ? 'border-line bg-surface text-ink hover:bg-slate' : 'border-blue/20 bg-blue/[0.06] text-blue hover:bg-blue/10'
              }`}
            >
              <IconMenu size={21} />
            </button>
          ) : null}
          <Link
            href="/dashboard/"
            className="flex h-11 items-center gap-2 rounded-xl pr-3 font-display text-[15px] font-bold text-ink hover:text-blue"
            aria-label="Back to dashboard"
          >
            <IconArrowLeft size={22} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="min-w-0 flex-1 border-l border-line pl-3 sm:pl-4">
            <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.12em] text-blue-electric">{moduleName(m.number)}</p>
            <p className="truncate font-display text-[14.5px] font-bold text-ink sm:text-[16px]">{m.title}</p>
          </div>
          <div className="hidden sm:block">
            <StreakPill days={a.streak} />
          </div>
          <ThemeToggle />
          <Link href="/account/" aria-label="Account">
            <Avatar name={a.user.name} />
          </Link>
        </div>
        {m.lesson && canLearn(state) ? <Progress value={moduleFraction(m, a.completed)} className="!h-[3px] !rounded-none" /> : null}
      </header>

      <div
        className={`mx-auto grid max-w-[1880px] gap-5 px-3 py-4 sm:px-5 lg:gap-6 lg:px-6 lg:py-6 ${
          outlineOpen ? 'lg:grid-cols-[320px_1fr] 2xl:grid-cols-[360px_1fr]' : 'lg:grid-cols-1'
        }`}
      >
        {outlineOpen ? (
          <aside className="anim-fade no-scrollbar hidden lg:sticky lg:top-[96px] lg:block lg:max-h-[calc(100dvh-120px)] lg:overflow-y-auto">
            {outline}
          </aside>
        ) : null}

        <main className="min-w-0">
          {m.lesson && canLearn(state) && index !== null ? (
            <>
              <div className="mb-3 flex items-end gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-ink/50">
                    Lesson {i + 1} of {total}
                  </p>
                  <h1 className="truncate font-display text-[clamp(1.1rem,2.2vw,1.45rem)] font-extrabold tracking-[-0.02em] text-ink">
                    {m.lesson.slides[i].navLabel}
                  </h1>
                </div>
              </div>

              {done && nextM ? (
                <section className="anim-rise mb-4 flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:flex-row sm:items-center sm:p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint/10 text-mint">
                    <IconAward size={26} />
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-[17px] font-extrabold text-ink">{moduleName(m.number)} complete</p>
                    <p className="text-[14px] text-ink/60">
                      {nextState === 'needs-programme'
                        ? `You have finished the free modules. ${moduleName(nextM.number)}, ${nextM.short}, is next.`
                        : `Next: ${moduleName(nextM.number)}, ${nextM.title}.`}
                    </p>
                  </div>
                  <ButtonLink href={`/learn/${nextM.slug}/`} variant={nextState === 'needs-programme' ? 'gold' : 'primary'} size="lg">
                    {nextState === 'needs-programme' ? `Continue to ${moduleName(nextM.number)}` : `Start ${moduleName(nextM.number)}`}
                    <IconArrowRight size={18} />
                  </ButtonLink>
                </section>
              ) : null}
              <div className="mx-auto">
                <LessonPlayer
                  key={m.slug}
                  mod={m.lesson}
                  index={i}
                  onIndexChange={setIndex}
                  completed={a.completed}
                  onModuleEnd={() => {
                    if (nextM) router.push(`/learn/${nextM.slug}/`)
                  }}
                />
              </div>

              <UpNext slides={m.lesson.slides} index={i} completed={a.completed} onSelect={select} />
            </>
          ) : state === 'needs-programme' ? (
            <Paywall m={m} celebrate={freeTrackDone(a.completed)} />
          ) : state === 'in-production' ? (
            <Notice
              icon={<IconBook size={26} />}
              title={m.free ? `${moduleName(m.number)} is coming soon` : 'This animated module is being produced'}
              body={m.free ? 'It will be free, like the modules before it. We will let you know when it is ready.' : 'It will appear here as soon as it is ready. Instructor-led classes already cover it.'}
              href="/classes/"
              cta="See instructor-led classes"
            />
          ) : null}
        </main>
      </div>

      {/* ---------- phone outline sheet ---------- */}
      {sheet ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close lessons"
            onClick={() => setSheet(false)}
            className="anim-fade absolute inset-0 bg-black/50"
          />
          <div className="anim-sheet absolute inset-x-0 bottom-0 flex max-h-[82dvh] flex-col rounded-t-3xl bg-slate pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center px-4 pb-2 pt-3">
              <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/15" />
              <p className="pt-2 font-display text-[16px] font-extrabold text-ink">Course outline</p>
              <button
                type="button"
                onClick={() => setSheet(false)}
                aria-label="Close lessons"
                className="ml-auto mt-1 grid h-11 w-11 place-items-center rounded-xl text-ink"
              >
                <IconClose size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-3 pb-4">{outline}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Notice({ icon, title, body, href, cta }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string }) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center shadow-[0_1px_0_rgb(var(--line))] sm:p-12">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate text-ink/50">{icon}</span>
      <h1 className="mt-4 font-display text-[22px] font-extrabold text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-ink/60">{body}</p>
      <ButtonLink href={href} size="lg" className="mt-6">
        {cta}
      </ButtonLink>
    </div>
  )
}

function UpNext({
  slides,
  index,
  completed,
  onSelect,
}: {
  slides: { id: string; navLabel: string; interaction?: unknown }[]
  index: number
  completed: Set<string>
  onSelect: (i: number) => void
}) {
  const upcoming = slides.slice(index + 1, index + 4)
  if (!upcoming.length) return null
  return (
    <section className="mx-auto mt-5">
      <h2 className="font-display text-[15px] font-extrabold text-ink">Up next</h2>
      <ol className="mt-2 grid gap-2 md:grid-cols-3">
        {upcoming.map((s, n) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(index + 1 + n)}
              className="flex h-full min-h-[56px] w-full items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left shadow-[0_1px_0_rgb(var(--line))] transition hover:shadow-lift"
            >
              <span className="font-display text-[12px] font-bold text-ink/40">{String(index + 2 + n).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 font-display text-[14px] font-bold leading-snug text-ink">{s.navLabel}</span>
              {completed.has(s.id) ? <IconCheck size={16} className="shrink-0 text-mint" /> : null}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
