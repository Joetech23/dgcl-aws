'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Slide, SlideTiming } from '@/lib/course/types'
import { useTimeline } from '@/lib/timeline/useTimeline'
import { Scene } from '@/components/scenes'
import { Interaction } from '@/components/interactions'
import { Rail } from './Rail'
import { Transport } from './Transport'
import { getProgressStore } from '@/lib/progress'

/**
 * The whole course.
 *
 * A designed player around the audio timeline: collapsible left rail, a stage
 * that is always 16:9 (mobile included), a header that reads like the deck's
 * own brand chrome rather than a web app header, and a gate panel that stays
 * on screen after completion so the learner and the reviewer can both see the
 * outcome of the activity.
 */
export function CoursePlayer({ slides }: { slides: Slide[] }) {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [timings, setTimings] = useState<Record<string, SlideTiming>>({})
  const [activeModel, setActiveModel] = useState(0)
  const [railOpen, setRailOpen] = useState(true)

  const slide = slides[index]
  const timing = timings[slide.id] ?? null

  /* ---------- progress ---------- */

  useEffect(() => {
    const loaded = getProgressStore().load()
    if (loaded?.completed?.length) setCompleted(new Set(loaded.completed))
    if (loaded?.bookmark) {
      const i = slides.findIndex((s) => s.id === loaded.bookmark)
      if (i >= 0) setIndex(i)
    }
  }, [slides])

  /* ---------- timings ---------- */

  useEffect(() => {
    let cancelled = false
    if (timings[slide.id]) return
    fetch(`./audio/${slide.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SlideTiming | null) => {
        if (!cancelled && data) setTimings((t) => ({ ...t, [slide.id]: data }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slide.id, timings])

  /* ---------- the gate ---------- */

  const gateLine = useMemo(
    () => slide.script.findIndex((l) => l.gate),
    [slide.script],
  )
  const [gateDone, setGateDone] = useState(false)

  useEffect(() => {
    setGateDone(completed.has(slide.id))
    setActiveModel(0)
  }, [slide.id, completed])

  const timeline = useTimeline({
    src: `./audio/${slide.id}.mp3`,
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
      if (next.size >= slides.length) store.finish(progress)
      else store.save(progress)
      return next
    })
  }, [slide.id, slides.length])

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
    if (!started) return
    if (!timing) return
    if (autoplayRef.current) {
      autoplayRef.current = false
      play()
    }
  }, [started, timing, slide.id, play])

  const next = useCallback(() => {
    autoplayRef.current = true
    go(index + 1)
  }, [go, index])

  const prev = useCallback(() => {
    autoplayRef.current = true
    go(index - 1)
  }, [go, index])

  if (!started) {
    return (
      <Poster
        onStart={() => {
          setStarted(true)
          setTimeout(() => play(), 60)
        }}
        slideCount={slides.length}
      />
    )
  }

  const gateMs =
    timing && gateLine >= 0 ? (timing.lines[gateLine]?.endMs ?? null) : null

  // Show the activity panel from the moment the gate is reached, and keep it
  // on screen for the rest of the slide so the completed state is visible.
  const gatePanelVisible =
    slide.interaction != null &&
    gateMs !== null &&
    timeline.currentMs >= gateMs - 20

  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink lg:h-[100dvh] lg:flex-row">
      <aside
        className={`chrome shrink-0 border-white/10 transition-[width] duration-300 lg:order-1 lg:h-auto lg:border-r ${
          railOpen ? 'order-2 border-t lg:order-1 lg:w-[var(--rail-w)]' : 'hidden lg:block lg:w-[54px]'
        }`}
      >
        <Rail
          slides={slides}
          currentIndex={index}
          completed={completed}
          slide={slide}
          timing={timing}
          lineIndex={timeline.lineIndex}
          wordIndex={timeline.wordIndex}
          collapsed={!railOpen}
          onExpand={() => setRailOpen(true)}
          onSelectSlide={go}
          onSeek={seek}
        />
      </aside>

      <main className="chrome order-1 flex min-h-0 flex-1 flex-col lg:order-2">
        <MinimalBar
          index={index}
          total={slides.length}
          progressPct={
            timeline.durationMs ? (timeline.currentMs / timeline.durationMs) * 100 : 0
          }
          railOpen={railOpen}
          onToggleRail={() => setRailOpen((v) => !v)}
        />

        {/* the stage — sharp edges, always 16:9. The gate panel floats over
            it, so the scene keeps its full width and the diagram is never
            squeezed by the activity. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-1 sm:px-4">
          {/* Mobile keeps the video aspect but at a slightly taller floor so
              the header and the body copy inside the slide both have room.
              Desktop stays a clean 16:9. */}
          <div className="stage-container relative flex aspect-[4/3] max-h-full w-full overflow-hidden shadow-stage ring-1 ring-white/10 sm:aspect-video">
            <div className="absolute inset-0">
              <Scene
                slide={slide}
                shown={shown}
                currentMs={timeline.currentMs}
                activeModel={activeModel}
              />
            </div>

            {/* Desktop: activity floats as a side popup, layered on top. */}
            {gatePanelVisible ? (
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                <div className="pointer-events-auto absolute inset-y-3 right-3 flex w-[40%] max-w-[520px] flex-col overflow-hidden rounded-lg border-2 border-gold bg-white shadow-[0_28px_80px_-24px_rgba(0,0,60,0.55)] anim-slide-in">
                  <GatePanel
                    slideId={slide.id}
                    gateDone={gateDone}
                    onModelChange={setActiveModel}
                    interaction={slide.interaction!}
                    onComplete={() => {
                      setGateDone(true)
                      markComplete()
                      const remaining =
                        gateMs !== null ? timeline.durationMs - gateMs : 0
                      if (remaining > 400) setTimeout(() => play(), 250)
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile: activity flows underneath the stage instead of splitting it. */}
        {gatePanelVisible ? (
          <div className="border-t-[3px] border-gold bg-white lg:hidden">
            <MobileGate
              slideId={slide.id}
              gateDone={gateDone}
              interaction={slide.interaction!}
              onModelChange={setActiveModel}
              onComplete={() => {
                setGateDone(true)
                markComplete()
                const remaining =
                  gateMs !== null ? timeline.durationMs - gateMs : 0
                if (remaining > 400) setTimeout(() => play(), 250)
              }}
            />
          </div>
        ) : null}

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
          hasPrev={index > 0}
          hasNext={index < slides.length - 1}
        />

        <PlayerFooter />
      </main>
    </div>
  )
}

/**
 * The minimal outer bar.
 *
 * The slide carries its own header — this strip just holds the rail toggle,
 * the slide counter, and a thin progress meter. Everything else has moved
 * onto the slide itself.
 */
function MinimalBar({
  index,
  total,
  progressPct,
  railOpen,
  onToggleRail,
}: {
  index: number
  total: number
  progressPct: number
  railOpen: boolean
  onToggleRail: () => void
}) {
  return (
    <div className="shrink-0 border-b border-white/10 bg-gradient-to-b from-black/30 to-transparent">
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={onToggleRail}
          aria-label={railOpen ? 'Collapse contents' : 'Expand contents'}
          aria-pressed={railOpen}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:border-gold/60 hover:bg-white/10 hover:text-gold"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M3 4h10M3 8h10M3 12h10" />
          </svg>
        </button>

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
          <span className="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 font-mono text-[11px] tabular-nums font-semibold text-white">
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
    </div>
  )
}

/**
 * The activity as a stacked panel on phones.
 *
 * The user's rule: the activity must not eat into the video area on a small
 * screen. So it sits below the stage in normal document flow, and the stage
 * stays a clean 16:9 all the way down to 375px.
 */
function MobileGate({
  slideId,
  interaction,
  gateDone,
  onComplete,
  onModelChange,
}: {
  slideId: string
  interaction: NonNullable<Slide['interaction']>
  gateDone: boolean
  onComplete: () => void
  onModelChange: (i: number) => void
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`flex shrink-0 items-center gap-2 px-3 py-1.5 transition-colors duration-300 ${
          gateDone ? 'bg-mint text-blue-deep' : 'bg-blue-deep text-gold'
        }`}
      >
        <span className={`block h-2 w-2 rotate-45 ${gateDone ? 'bg-blue-deep' : 'bg-gold'}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
          {gateDone ? 'Complete' : 'Your turn'}
        </span>
      </div>
      <div className="min-h-0 max-h-[55vh] overflow-y-auto p-3 bg-white">
        <Interaction
          key={slideId}
          spec={interaction}
          onComplete={onComplete}
          onModelChange={onModelChange}
        />
      </div>
    </div>
  )
}

function PlayerFooter() {
  return (
    <footer className="flex shrink-0 items-center gap-3 border-t border-white/10 bg-black/30 px-3 py-1.5 sm:px-4">
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

/**
 * The activity, presented as a side panel.
 *
 * Stays on screen from the moment the gate is reached until the slide changes,
 * so a completed activity does not vanish the second the learner finishes it.
 * The gold header stripe flips green on completion.
 */
function GatePanel({
  slideId,
  interaction,
  gateDone,
  onComplete,
  onModelChange,
}: {
  slideId: string
  interaction: NonNullable<Slide['interaction']>
  gateDone: boolean
  onComplete: () => void
  onModelChange: (i: number) => void
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`flex shrink-0 items-center gap-2 px-3 py-1.5 transition-colors duration-300 ${
          gateDone ? 'bg-mint text-blue-deep' : 'bg-blue-deep text-gold'
        }`}
      >
        <span className={`block h-2 w-2 rotate-45 ${gateDone ? 'bg-blue-deep' : 'bg-gold'}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
          {gateDone ? 'Complete' : 'Your turn'}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <Interaction
          key={slideId}
          spec={interaction}
          onComplete={onComplete}
          onModelChange={onModelChange}
        />
      </div>
    </div>
  )
}

function Poster({ onStart, slideCount }: { onStart: () => void; slideCount: number }) {
  return (
    <div className="chrome relative flex h-[100dvh] items-center justify-center overflow-hidden px-6">
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
            className="mx-auto h-16 w-auto brightness-0 invert lg:mx-0"
            style={{ filter: 'brightness(0) invert(1)' }}
            priority
          />
          <h1 className="anim-rise mt-6 font-display text-[clamp(1.9rem,5vw,3.2rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            AWS Cloud Training
          </h1>
          <p className="anim-rise mt-3 font-display text-[clamp(0.95rem,1.6vw,1.25rem)] font-semibold text-gold">
            Section 1 · {slideCount} lessons
          </p>
          <p className="anim-rise mt-2 text-[15px] leading-relaxed text-white/65">
            Amazon Web Services Fundamentals
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
            <Image
              src="/art/cloud-render.png"
              alt=""
              fill
              sizes="45vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
