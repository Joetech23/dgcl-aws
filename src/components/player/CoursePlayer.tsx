'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { CourseModule, Slide, SlideTiming } from '@/lib/course/types'
import { useTimeline } from '@/lib/timeline/useTimeline'
import { Scene } from '@/components/scenes'
import { Interaction } from '@/components/interactions'
import { Rail } from './Rail'
import { Transport } from './Transport'
import { ScaledStage } from './ScaledStage'
import { CaptionBand } from './CaptionBand'
import { getProgressStore } from '@/lib/progress'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/** Seconds an activity stays on screen after it is completed. */
const AUTO_CLOSE_S = 6

/**
 * The whole course.
 *
 * Main column, top to bottom: bar, the video-like stage, the activity dock
 * (when the course stops to ask something), three lines of live transcript,
 * and the transport. The contents rail is a collapsible sidebar on desktop and
 * a slide-in drawer on phones, so a phone's main view is just video and
 * controls.
 *
 * The course is split into modules, switched from tabs in the top bar. Each
 * module has its own contents and counter, and stays locked until every slide
 * of the module before it is complete.
 */
export function CoursePlayer({
  modules,
  assetBase = './',
}: {
  modules: CourseModule[]
  /** Where public/ is served from: './' inside a SCORM package, '/' on the site. */
  assetBase?: string
}) {
  const [started, setStarted] = useState(false)
  const [moduleIndex, setModuleIndex] = useState(0)
  const [index, setIndex] = useState(0)
  const [lockNotice, setLockNotice] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [timings, setTimings] = useState<Record<string, SlideTiming>>({})
  const [activeModel, setActiveModel] = useState(0)
  const [railOpen, setRailOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)

  const mod = modules[moduleIndex]
  const slides = mod.slides
  const slide = slides[Math.min(index, slides.length - 1)]
  const timing = timings[slide.id] ?? null

  const completedRef = useRef(completed)
  completedRef.current = completed

  const moduleDone = (m: number) => modules[m].slides.every((s) => completed.has(s.id))
  const moduleUnlocked = (m: number) => m === 0 || moduleDone(m - 1)

  useEffect(() => {
    if (!lockNotice) return
    const t = setTimeout(() => setLockNotice(null), 2800)
    return () => clearTimeout(t)
  }, [lockNotice])

  /* ---------- progress ---------- */

  useEffect(() => {
    const loaded = getProgressStore().load()
    const done = new Set(loaded?.completed ?? [])
    if (done.size) setCompleted(done)
    if (!loaded?.bookmark) return
    for (let m = 0; m < modules.length; m++) {
      const i = modules[m].slides.findIndex((s) => s.id === loaded.bookmark)
      if (i < 0) continue
      // Never resume inside a module that is still locked.
      const unlocked = m === 0 || modules[m - 1].slides.every((s) => done.has(s.id))
      if (unlocked) {
        setModuleIndex(m)
        setIndex(i)
      }
      break
    }
  }, [modules])

  /* ---------- timings ---------- */

  useEffect(() => {
    let cancelled = false
    if (timings[slide.id]) return
    fetch(`${assetBase}audio/${slide.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SlideTiming | null) => {
        if (!cancelled && data) setTimings((t) => ({ ...t, [slide.id]: data }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slide.id, timings, assetBase])

  /* ---------- the gate ---------- */

  const gateLine = useMemo(() => slide.script.findIndex((l) => l.gate), [slide.script])
  const [gateDone, setGateDone] = useState(false)
  const [gateDismissed, setGateDismissed] = useState(false)

  useEffect(() => {
    setGateDone(completed.has(slide.id))
  }, [slide.id, completed])

  // Per slide, not per completion: keying this on `completed` would slam the
  // panel shut the instant the learner finished, before they read the result.
  // A slide already completed on arrival starts dismissed, so revisiting does
  // not re-open an activity they have done.
  useEffect(() => {
    setGateDismissed(completedRef.current.has(slide.id))
    setActiveModel(0)
  }, [slide.id, started])

  const timeline = useTimeline({
    src: `${assetBase}audio/${slide.id}.mp3`,
    timing,
    gateLine,
    gateSatisfied: gateDone || gateLine < 0,
    onEnded: () => markComplete(),
  })

  const { seek, play, pause } = timeline

  const markComplete = useCallback(() => {
    setCompleted((prev) => {
      if (prev.has(slide.id)) return prev
      const next = new Set(prev)
      next.add(slide.id)
      const store = getProgressStore()
      const progress = { ...store.load(), completed: [...next], bookmark: slide.id }
      // Stale ids from older builds can sit in the set, so count real slides
      // rather than comparing sizes.
      const all = modules.every((m) => m.slides.every((s) => next.has(s.id)))
      if (all) store.finish(progress)
      else store.save(progress)
      return next
    })
  }, [slide.id, modules])

  const shown = useCallback(
    (id: string) => {
      if (!timing) return false
      const line = slide.script.findIndex((l) => l.reveal === id)
      if (line < 0) return false
      const at = timing.lines[line]?.startMs
      return at !== undefined && timeline.currentMs >= at
    },
    [timing, slide.script, timeline.currentMs],
  )

  /* ---------- navigation ---------- */

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= slides.length) return
      pause()
      setIndex(i)
      const store = getProgressStore()
      store.save({ ...store.load(), bookmark: slides[i].id })
    },
    [slides, pause],
  )

  const autoplayRef = useRef(false)
  useEffect(() => {
    if (!started || !timing) return
    if (autoplayRef.current) {
      autoplayRef.current = false
      play()
    }
  }, [started, timing, slide.id, play])

  /** Switch module. Refused, with a notice, while the module is locked. */
  const openModule = useCallback(
    (m: number, autoplay = false) => {
      if (m < 0 || m >= modules.length) return
      const done = completedRef.current
      const unlocked = m === 0 || modules[m - 1].slides.every((s) => done.has(s.id))
      if (!unlocked) {
        setLockNotice(
          `Finish ${moduleName(modules[m - 1].number)} to unlock ${moduleName(modules[m].number)}`,
        )
        return
      }
      pause()
      // Pick up at the first slide not yet finished, so returning to a module
      // resumes rather than restarts.
      const first = modules[m].slides.findIndex((s) => !done.has(s.id))
      const i = first >= 0 ? first : 0
      autoplayRef.current = autoplay
      setModuleIndex(m)
      setIndex(i)
      const store = getProgressStore()
      store.save({ ...store.load(), bookmark: modules[m].slides[i].id })
    },
    [modules, pause],
  )

  const next = useCallback(() => {
    if (index < slides.length - 1) {
      autoplayRef.current = true
      go(index + 1)
    } else {
      openModule(moduleIndex + 1, true)
    }
  }, [go, index, slides.length, openModule, moduleIndex])

  const prev = useCallback(() => {
    if (index > 0) {
      autoplayRef.current = true
      go(index - 1)
      return
    }
    if (moduleIndex === 0) return
    // Step back into the previous module at its last slide.
    const m = moduleIndex - 1
    const i = modules[m].slides.length - 1
    pause()
    autoplayRef.current = true
    setModuleIndex(m)
    setIndex(i)
    const store = getProgressStore()
    store.save({ ...store.load(), bookmark: modules[m].slides[i].id })
  }, [go, index, moduleIndex, modules, pause])

  const closeGate = useCallback(() => setGateDismissed(true), [])

  const toggleContents = useCallback(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) setRailOpen((v) => !v)
    else setDrawerOpen((v) => !v)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.().catch(() => {})
  }, [])

  if (!started) {
    return (
      <Poster
        onStart={() => {
          setStarted(true)
          setTimeout(() => play(), 60)
        }}
        moduleCount={modules.length}
        lessonCount={modules.reduce((n, m) => n + m.slides.length, 0)}
      />
    )
  }

  const gateMs = timing && gateLine >= 0 ? (timing.lines[gateLine]?.endMs ?? null) : null
  const gateReached =
    slide.interaction != null && gateMs !== null && timeline.currentMs >= gateMs - 20
  const gateOpen = gateReached && !gateDismissed

  const onGateComplete = () => {
    setGateDone(true)
    markComplete()
    const remaining = gateMs !== null ? timeline.durationMs - gateMs : 0
    if (remaining > 400) setTimeout(() => play(), 250)
  }

  const nextModule = moduleIndex + 1 < modules.length ? modules[moduleIndex + 1] : null
  // At the end of a finished module, offer the next one right where the eye is.
  const offerNextModule =
    nextModule !== null && index === slides.length - 1 && moduleDone(moduleIndex)
  const gatePill = gateReached && gateDismissed
  const pillShown = gatePill || offerNextModule

  const railProps = {
    heading: `${moduleName(mod.number)} · ${mod.title}`,
    slides,
    currentIndex: index,
    completed,
    slide,
    timing,
    lineIndex: timeline.lineIndex,
    wordIndex: timeline.wordIndex,
    onSeek: seek,
  }

  return (
    <div className="light-scope flex min-h-[100dvh] bg-ink lg:h-[100dvh]">
      {/* Desktop sidebar, collapsible */}
      <aside
        className={`chrome hidden shrink-0 border-r border-white/10 transition-[width] duration-300 lg:block ${
          railOpen ? 'w-[var(--rail-w)]' : 'w-[54px]'
        }`}
      >
        <Rail
          {...railProps}
          collapsed={!railOpen}
          onExpand={() => setRailOpen(true)}
          onSelectSlide={go}
        />
      </aside>

      {/* Phone drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close contents"
            onClick={() => setDrawerOpen(false)}
            className="anim-fade absolute inset-0 bg-black/60"
          />
          <aside className="chrome anim-drawer absolute inset-y-0 left-0 flex w-[84%] max-w-[320px] flex-col border-r border-white/10 shadow-stage">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <Image
                src="/brand/dgcl-logo.png"
                alt="DGCL Digital Cloud Academy"
                width={520}
                height={220}
                className="h-7 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close contents"
                className="ml-auto grid h-8 w-8 place-items-center rounded-md text-white/75 hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Rail
                {...railProps}
                onSelectSlide={(i) => {
                  go(i)
                  setDrawerOpen(false)
                }}
              />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="chrome flex min-w-0 flex-1 flex-col">
        <MinimalBar
          modules={modules}
          moduleIndex={moduleIndex}
          unlocked={modules.map((_, m) => moduleUnlocked(m))}
          done={modules.map((_, m) => moduleDone(m))}
          onSelectModule={(m) => openModule(m)}
          lockNotice={lockNotice}
          index={index}
          total={slides.length}
          progressPct={timeline.durationMs ? (timeline.currentMs / timeline.durationMs) * 100 : 0}
          contentsOpen={railOpen}
          onToggleContents={toggleContents}
        />

        {/* The stage. Always the same slide, scaled to fit. */}
        <div
          ref={stageRef}
          className="stage-fs flex shrink-0 px-3 pt-3 sm:px-4 lg:min-h-0 lg:flex-1 lg:pb-2"
        >
          <ScaledStage className="w-full lg:h-full">
            <Scene
              slide={slide}
              shown={shown}
              currentMs={timeline.currentMs}
              activeModel={activeModel}
              moduleLabel={sectionLabel(mod.number)}
            />
          </ScaledStage>
        </div>

        {/* The activity, below the video. */}
        {gateOpen ? (
          <GateDock
            slideId={slide.id}
            interaction={slide.interaction!}
            gateDone={gateDone}
            onComplete={onGateComplete}
            onModelChange={setActiveModel}
            onClose={closeGate}
          />
        ) : (
          <div className="relative shrink-0">
            <CaptionBand
              slide={slide}
              timing={timing}
              lineIndex={timeline.lineIndex}
              wordIndex={timeline.wordIndex}
              className={pillShown ? 'pr-44 sm:pr-48' : ''}
            />
            {gatePill ? (
              <button
                type="button"
                onClick={() => setGateDismissed(false)}
                className="anim-rise absolute bottom-2 right-3 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 font-display text-[12px] font-bold text-blue-deep shadow-stage hover:brightness-110 sm:right-4"
              >
                <span className="block h-1.5 w-1.5 rotate-45 bg-blue-deep" />
                {gateDone ? 'Review activity' : 'Your turn'}
              </button>
            ) : offerNextModule && nextModule ? (
              <button
                type="button"
                onClick={() => openModule(moduleIndex + 1, true)}
                className="anim-pop absolute bottom-2 right-3 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 font-display text-[12px] font-bold text-blue-deep shadow-stage hover:brightness-110 sm:right-4"
              >
                Start {moduleName(nextModule.number)}
                <span aria-hidden>›</span>
              </button>
            ) : null}
          </div>
        )}

        <Transport
          currentMs={timeline.currentMs}
          durationMs={timeline.durationMs}
          playing={timeline.playing}
          atGate={timeline.atGate}
          gateMs={gateMs}
          gateDone={gateDone}
          muted={timeline.muted}
          onToggle={timeline.toggle}
          onSeek={seek}
          onReplay={timeline.replay}
          onToggleMute={timeline.toggleMute}
          onPrev={prev}
          onNext={next}
          onFullscreen={toggleFullscreen}
          hasPrev={index > 0 || moduleIndex > 0}
          hasNext={
            index < slides.length - 1 ||
            (moduleIndex + 1 < modules.length && moduleUnlocked(moduleIndex + 1))
          }
        />

        <PlayerFooter />
      </main>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

/** The slim bar above the stage: contents toggle, module tabs, dots, counter. */
function MinimalBar({
  modules,
  moduleIndex,
  unlocked,
  done,
  onSelectModule,
  lockNotice,
  index,
  total,
  progressPct,
  contentsOpen,
  onToggleContents,
}: {
  modules: CourseModule[]
  moduleIndex: number
  unlocked: boolean[]
  done: boolean[]
  onSelectModule: (m: number) => void
  lockNotice: string | null
  index: number
  total: number
  progressPct: number
  contentsOpen: boolean
  onToggleContents: () => void
}) {
  return (
    <div className="relative z-30 shrink-0 border-b border-white/10 bg-gradient-to-b from-black/30 to-transparent">
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={onToggleContents}
          aria-label="Contents"
          aria-expanded={contentsOpen}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:border-gold/60 hover:bg-white/10 hover:text-gold"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M3 4h10M3 8h10M3 12h10" />
          </svg>
        </button>

        <ModuleTabs
          modules={modules}
          current={moduleIndex}
          unlocked={unlocked}
          done={done}
          onSelect={onSelectModule}
        />

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-1 rounded-full transition-all ${
                  i === index ? 'w-6 bg-gold' : i < index ? 'w-1.5 bg-white/45' : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>
          <span className="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-white">
            {String(index + 1).padStart(2, '0')}
            <span className="text-white/40">/{String(total).padStart(2, '0')}</span>
          </span>
        </div>
      </div>
      <div className="relative h-[2px] w-full bg-white/5">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold via-gold to-blue-electric transition-[width] duration-150"
          style={{ width: `${Math.min(100, progressPct)}%` }}
        />
      </div>
      {lockNotice ? (
        <div
          role="status"
          className="anim-rise absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-md border border-gold/50 bg-blue-deep px-3 py-1.5 font-display text-[12px] font-semibold text-white shadow-stage"
        >
          <LockIcon className="text-gold" />
          {lockNotice}
        </div>
      ) : null}
    </div>
  )
}

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

/**
 * Module tabs.
 *
 * A locked module is still a real, focusable button: clicking it explains
 * what unlocks it, rather than doing nothing the way a disabled control would.
 */
function ModuleTabs({
  modules,
  current,
  unlocked,
  done,
  onSelect,
}: {
  modules: CourseModule[]
  current: number
  unlocked: boolean[]
  done: boolean[]
  onSelect: (m: number) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Modules"
      className="flex min-w-0 items-center gap-0.5 rounded-md border border-white/10 bg-black/25 p-0.5"
    >
      {modules.map((m, i) => {
        const active = i === current
        const locked = !unlocked[i]
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={locked}
            aria-label={`${moduleName(m.number)}: ${m.title}${locked ? ' (locked)' : ''}`}
            onClick={() => onSelect(i)}
            title={locked ? `Finish ${moduleName(modules[i - 1].number)} to unlock` : m.title}
            className={`flex items-center gap-1 rounded px-2 py-1 font-display text-[12px] font-semibold transition sm:gap-1.5 sm:px-2.5 ${
              active
                ? 'bg-gold text-blue-deep'
                : locked
                  ? 'cursor-not-allowed text-white/35 hover:bg-white/5'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {locked ? (
              <LockIcon />
            ) : done[i] && !active ? (
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-mint" aria-hidden>
                <path d="M3 8.4l3.2 3.2L13 4.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <span className="whitespace-nowrap">
              <span className="sm:hidden">{m.number === 0 ? 'Intro' : `M${m.number}`}</span>
              <span className="hidden sm:inline">{moduleName(m.number)}</span>
            </span>
            <span className="hidden whitespace-nowrap font-normal opacity-80 md:inline">
              · {m.short}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * The activity, docked under the video.
 *
 * Closable at any time with the X. Once the learner finishes, it closes itself
 * after a few seconds, with a visible countdown so the result does not vanish
 * without warning. A closed activity can be reopened from the gold pill.
 */
export function GateDock({
  slideId,
  interaction,
  gateDone,
  onComplete,
  onModelChange,
  onClose,
}: {
  slideId: string
  interaction: NonNullable<Slide['interaction']>
  gateDone: boolean
  onComplete: () => void
  onModelChange: (i: number) => void
  onClose: () => void
}) {
  const [finishedHere, setFinishedHere] = useState(false)

  useEffect(() => {
    if (!finishedHere) return
    const t = setTimeout(onClose, AUTO_CLOSE_S * 1000)
    return () => clearTimeout(t)
  }, [finishedHere, onClose])

  return (
    <section
      aria-label="Your turn"
      className="anim-rise mx-3 mb-1 mt-1 flex max-h-[44vh] shrink-0 flex-col overflow-hidden rounded-md border-2 border-gold bg-white shadow-stage sm:mx-4 lg:max-h-[42%]"
    >
      <div
        className={`relative flex shrink-0 items-center gap-2 px-3 py-1.5 transition-colors duration-300 ${
          gateDone ? 'bg-mint text-blue-deep' : 'bg-blue-deep text-gold'
        }`}
      >
        <span className={`block h-2 w-2 rotate-45 ${gateDone ? 'bg-blue-deep' : 'bg-gold'}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
          {gateDone ? 'Complete' : 'Your turn'}
        </span>
        {finishedHere ? (
          <span className="font-mono text-[10px] text-blue-deep/70">closing in {AUTO_CLOSE_S}s</span>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close activity"
          className={`ml-auto grid h-7 w-7 place-items-center rounded-md transition ${
            gateDone ? 'text-blue-deep hover:bg-blue-deep/10' : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CloseIcon />
        </button>
        {finishedHere ? (
          <span
            aria-hidden
            className="countdown absolute inset-x-0 bottom-0 h-[3px] bg-blue-deep/60"
            style={{ ['--countdown' as string]: `${AUTO_CLOSE_S}s` }}
          />
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <Interaction
          key={slideId}
          spec={interaction}
          onComplete={() => {
            setFinishedHere(true)
            onComplete()
          }}
          onModelChange={onModelChange}
        />
      </div>
    </section>
  )
}

function PlayerFooter() {
  return (
    <footer className="hidden shrink-0 items-center gap-3 border-t border-white/10 bg-black/30 px-4 py-1.5 lg:flex">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40">
        DGCL Digital Cloud Academy
      </span>
      <span className="ml-auto flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
        <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-mint" />
        Interactive · SCORM 1.2
      </span>
    </footer>
  )
}

function Poster({
  onStart,
  moduleCount,
  lessonCount,
}: {
  onStart: () => void
  moduleCount: number
  lessonCount: number
}) {
  return (
    <div className="light-scope chrome relative flex h-[100dvh] items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-electric to-transparent" />

      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <Image
            src="/brand/dgcl-logo.png"
            alt="DGCL Digital Cloud Academy"
            width={520}
            height={220}
            className="mx-auto h-16 w-auto lg:mx-0"
            style={{ filter: 'brightness(0) invert(1)' }}
            priority
          />
          <h1 className="anim-rise mt-6 font-display text-[clamp(1.9rem,5vw,3.2rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            AWS Cloud Training
          </h1>
          <p className="anim-rise mt-3 font-display text-[clamp(0.95rem,1.6vw,1.25rem)] font-semibold text-gold">
            CO2/CO3 · Introduction + {moduleCount - 1} modules · {lessonCount} lessons
          </p>
          <p className="anim-rise mt-2 text-[15px] leading-relaxed text-white/65">
            DGCL Digital Cloud Academy
          </p>

          <button
            type="button"
            onClick={onStart}
            className="anim-pop group mt-7 inline-flex items-center gap-3 rounded-md bg-gold py-3 pl-5 pr-6 font-display text-[15px] font-bold uppercase tracking-wide text-blue-deep shadow-stage transition hover:brightness-110"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d="M2.5 1.4v9.2a.6.6 0 0 0 .93.5l7-4.6a.6.6 0 0 0 0-1L3.43.9a.6.6 0 0 0-.93.5Z" />
            </svg>
            Start
          </button>
        </div>

        <div className="pointer-events-none relative hidden aspect-square lg:block">
          <div className="anim-float absolute inset-0">
            <Image src="/art/cloud-render.png" alt="" fill sizes="45vw" className="object-contain" priority />
          </div>
        </div>
      </div>
    </div>
  )
}
