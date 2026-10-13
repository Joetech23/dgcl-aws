'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CourseModule, SlideTiming } from '@/lib/course/types'
import { useTimeline } from '@/lib/timeline/useTimeline'
import { Scene } from '@/components/scenes'
import { ScaledStage } from '@/components/player/ScaledStage'
import { CaptionBand } from '@/components/player/CaptionBand'
import { Transport } from '@/components/player/Transport'
import { GateDock } from '@/components/player/CoursePlayer'
import { getProgressStore } from '@/lib/progress'
import { authHeader, lessonMediaUrl, notifyProgress } from '@/lib/backend'
import { PAID_MODULES } from '@/config/pricing'
import { IconPlay } from '@/components/site/icons'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/**
 * One module's lessons, for the website.
 *
 * The same engine as the SCORM CoursePlayer (audio clock, derived reveals,
 * gated activities docked below the video, three-line captions, transport),
 * without its module tabs and sidebar: on the site the page around it owns
 * navigation between modules, through the course outline.
 *
 * The slide index is controlled by the page, so the outline and the player
 * always agree on where the learner is.
 */
export function LessonPlayer({
  mod,
  index,
  onIndexChange,
  completed,
  onModuleEnd,
}: {
  mod: CourseModule
  index: number
  onIndexChange: (i: number) => void
  completed: Set<string>
  /** Called when the learner presses next on the last slide. */
  onModuleEnd: () => void
}) {
  const slides = mod.slides
  const slide = slides[Math.min(index, slides.length - 1)]
  const [started, setStarted] = useState(false)
  const [timings, setTimings] = useState<Record<string, SlideTiming>>({})
  const [activeModel, setActiveModel] = useState(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const timing = timings[slide.id] ?? null

  const completedRef = useRef(completed)
  completedRef.current = completed

  // A paid module's narration is not a public file: it is fetched from the
  // server with the learner's token (see src/app/media), and the server
  // checks they have bought it. Free modules load straight from /audio.
  const gated = Boolean(PAID_MODULES[mod.id])
  const [gatedSrc, setGatedSrc] = useState<Record<string, string>>({})
  const [mediaError, setMediaError] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (timings[slide.id]) return
    setMediaError(false)
    if (!gated) {
      fetch(`/audio/${slide.id}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: SlideTiming | null) => {
          if (!cancelled && data) setTimings((t) => ({ ...t, [slide.id]: data }))
        })
        .catch(() => {})
    } else {
      // Sound and timings arrive together, so the lesson never starts silent.
      void (async () => {
        try {
          const [src, res] = await Promise.all([
            lessonMediaUrl(`${slide.id}.mp3`),
            fetch(`/media/audio/${slide.id}.json`, { headers: await authHeader(), cache: 'no-store' }),
          ])
          const data = res.ok ? ((await res.json()) as SlideTiming) : null
          if (cancelled) return
          if (!src || !data) return setMediaError(true)
          setGatedSrc((g) => ({ ...g, [slide.id]: src }))
          setTimings((t) => ({ ...t, [slide.id]: data }))
        } catch {
          if (!cancelled) setMediaError(true)
        }
      })()
    }
    return () => {
      cancelled = true
    }
  }, [slide.id, timings, gated])

  /* ---------- the gate ---------- */

  const gateLine = useMemo(() => slide.script.findIndex((l) => l.gate), [slide.script])
  const [gateDone, setGateDone] = useState(false)
  const [gateDismissed, setGateDismissed] = useState(false)

  useEffect(() => {
    setGateDone(completed.has(slide.id))
  }, [slide.id, completed])

  useEffect(() => {
    setGateDismissed(completedRef.current.has(slide.id))
    setActiveModel(0)
  }, [slide.id])

  const markComplete = useCallback(() => {
    if (completedRef.current.has(slide.id)) return
    const store = getProgressStore()
    const p = store.load()
    store.save({ ...p, completed: Array.from(new Set([...p.completed, slide.id])), bookmark: slide.id })
    notifyProgress()
  }, [slide.id])

  const timeline = useTimeline({
    src: gated ? (gatedSrc[slide.id] ?? '') : `/audio/${slide.id}.mp3`,
    timing,
    gateLine,
    gateSatisfied: gateDone || gateLine < 0,
    onEnded: () => markComplete(),
  })
  const { seek, play, pause } = timeline

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

  const autoplayRef = useRef(false)
  useEffect(() => {
    if (!started || !timing) return
    if (autoplayRef.current) {
      autoplayRef.current = false
      play()
    }
  }, [started, timing, slide.id, play])

  // Any change of slide, from the buttons or the outline, keeps playing if
  // the learner had already started.
  const lastSlide = useRef(slide.id)
  useEffect(() => {
    if (lastSlide.current === slide.id) return
    lastSlide.current = slide.id
    if (started) autoplayRef.current = true
    const store = getProgressStore()
    store.save({ ...store.load(), bookmark: slide.id })
  }, [slide.id, started])

  const next = useCallback(() => {
    pause()
    if (index < slides.length - 1) onIndexChange(index + 1)
    else onModuleEnd()
  }, [pause, index, slides.length, onIndexChange, onModuleEnd])

  const prev = useCallback(() => {
    if (index === 0) return
    pause()
    onIndexChange(index - 1)
  }, [pause, index, onIndexChange])

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.().catch(() => {})
  }, [])

  const gateMs = timing && gateLine >= 0 ? (timing.lines[gateLine]?.endMs ?? null) : null
  const gateReached = slide.interaction != null && gateMs !== null && timeline.currentMs >= gateMs - 20
  const gateOpen = gateReached && !gateDismissed
  const gatePill = gateReached && gateDismissed

  const onGateComplete = () => {
    setGateDone(true)
    markComplete()
    const remaining = gateMs !== null ? timeline.durationMs - gateMs : 0
    if (remaining > 400) setTimeout(() => play(), 250)
  }

  return (
    <div className="light-scope chrome overflow-hidden rounded-2xl shadow-stage lg:rounded-3xl">
      <div ref={stageRef} className="stage-fs relative p-2 sm:p-3">
        <ScaledStage className="w-full" fit="width">
          <Scene
            slide={slide}
            shown={shown}
            currentMs={timeline.currentMs}
            activeModel={activeModel}
            moduleLabel={sectionLabel(mod.number)}
          />
        </ScaledStage>

        {mediaError ? (
          <p role="alert" className="absolute inset-x-4 top-4 z-10 rounded-xl bg-white px-4 py-3 text-center font-display text-[13.5px] font-bold text-[#A8262B] shadow-stage">
            This lesson could not be loaded. Check your connection and refresh the page. If you have just paid, log out and log in again.
          </p>
        ) : null}
        {!started ? (
          <button
            type="button"
            onClick={() => {
              setStarted(true)
              // Paid narration may still be arriving: play as soon as it does.
              if (!timing) autoplayRef.current = true
              else setTimeout(() => play(), 60)
            }}
            className="group absolute inset-2 grid place-items-center bg-gradient-to-t from-[#000728]/45 via-[#000728]/10 to-transparent transition hover:from-[#000728]/35 sm:inset-3"
            aria-label={`Play lesson ${index + 1}: ${slide.navLabel}`}
          >
            <span className="flex flex-col items-center gap-3">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-blue-deep shadow-stage transition group-hover:scale-105 sm:h-20 sm:w-20">
                <IconPlay size={28} />
              </span>
              <span className="rounded-full bg-white/95 px-3.5 py-1.5 font-display text-[13px] font-bold text-blue-deep">
                {completed.has(slide.id) ? 'Watch again' : index === 0 ? 'Start lesson' : 'Continue'} · sound on
              </span>
            </span>
          </button>
        ) : null}
      </div>

      {gateOpen ? (
        <div className="bg-white/[0.03] pb-1">
          <GateDock
            slideId={slide.id}
            interaction={slide.interaction!}
            gateDone={gateDone}
            onComplete={onGateComplete}
            onModelChange={setActiveModel}
            onClose={() => setGateDismissed(true)}
          />
        </div>
      ) : (
        <div className="relative">
          <CaptionBand
            slide={slide}
            timing={timing}
            lineIndex={timeline.lineIndex}
            wordIndex={timeline.wordIndex}
            className={gatePill ? 'pr-40 sm:pr-44' : ''}
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
        onToggle={() => {
          if (!started) setStarted(true)
          timeline.toggle()
        }}
        onSeek={seek}
        onReplay={timeline.replay}
        onToggleMute={timeline.toggleMute}
        onPrev={prev}
        onNext={next}
        onFullscreen={toggleFullscreen}
        hasPrev={index > 0}
        hasNext
      />
    </div>
  )
}
