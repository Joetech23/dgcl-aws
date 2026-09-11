'use client'

import { useEffect, useRef, useState } from 'react'
import type { Slide, SlideTiming } from '@/lib/course/types'

/**
 * The left rail: contents and transcript.
 *
 * The transcript is not a static notes dump. It follows the voice word by word
 * and every line is a seek target, so a learner who missed something can click
 * the sentence rather than hunting with the scrubber.
 */
export function Rail({
  slides,
  currentIndex,
  completed,
  slide,
  timing,
  lineIndex,
  wordIndex,
  collapsed = false,
  onExpand,
  onSelectSlide,
  onSeek,
}: {
  slides: Slide[]
  currentIndex: number
  completed: Set<string>
  slide: Slide
  timing: SlideTiming | null
  lineIndex: number
  wordIndex: number
  collapsed?: boolean
  onExpand?: () => void
  onSelectSlide: (i: number) => void
  onSeek: (ms: number) => void
}) {
  if (collapsed) {
    return (
      <nav aria-label="Slides" className="flex h-full flex-col items-center gap-1 py-3">
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand contents"
          className="mb-2 grid h-8 w-8 place-items-center rounded-md border border-white/10 text-white/70 transition hover:border-gold/50 hover:text-gold"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
        {slides.map((s, i) => {
          const isCurrent = i === currentIndex
          const isDone = completed.has(s.id)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSlide(i)}
              aria-current={isCurrent ? 'true' : undefined}
              title={s.navLabel}
              className={`grid h-8 w-8 place-items-center rounded-md font-mono text-[10.5px] font-semibold transition ${
                isCurrent
                  ? 'bg-gold text-blue-deep'
                  : isDone
                    ? 'text-mint hover:bg-white/10'
                    : 'text-white/45 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          )
        })}
      </nav>
    )
  }
  const [tab, setTab] = useState<'contents' | 'transcript'>('contents')
  const activeLineRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (tab === 'transcript') {
      activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [lineIndex, tab])

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 pt-3">
        {(['contents', 'transcript'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-selected={tab === t}
            role="tab"
            className={`relative px-3 pb-2.5 pt-1 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
              tab === t ? 'text-gold' : 'text-white/45 hover:text-white/75'
            }`}
          >
            {t}
            {tab === t ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold" />
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'contents' ? (
        <nav aria-label="Slides" className="rail-scroll flex-1 overflow-y-auto px-2 py-3">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            Section 1 · AWS Fundamentals
          </p>
          <ol className="space-y-0.5">
            {slides.map((s, i) => {
              const isCurrent = i === currentIndex
              const isDone = completed.has(s.id)
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSlide(i)}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`flex w-full items-center gap-2.5 rounded px-2 py-2 text-left text-[13px] font-semibold leading-snug transition ${
                      isCurrent
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-5 shrink-0 font-mono text-[10.5px] tabular-nums ${
                        isCurrent ? 'text-gold' : 'text-white/30'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{s.navLabel}</span>
                    {isDone ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        className="shrink-0 text-mint"
                        aria-label="Completed"
                      >
                        <path d="M3 8.4l3.2 3.2L13 4.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      ) : (
        <div className="rail-scroll flex-1 overflow-y-auto px-3 py-3">
          <p className="pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            Click any line to jump there
          </p>
          <ol className="space-y-2.5">
            {slide.script.map((line, i) => {
              const isActive = i === lineIndex
              const start = timing?.lines[i]?.startMs ?? 0
              return (
                <li key={i}>
                  <button
                    ref={isActive ? activeLineRef : null}
                    type="button"
                    onClick={() => onSeek(start)}
                    className={`w-full rounded px-2 py-1.5 text-left text-[13px] leading-relaxed transition ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : i < lineIndex
                          ? 'text-white/45 hover:bg-white/5'
                          : 'text-white/25 hover:bg-white/5'
                    }`}
                  >
                    {isActive && timing ? (
                      <HighlightedLine
                        text={line.text}
                        lineStart={i}
                        script={slide.script}
                        timing={timing}
                        wordIndex={wordIndex}
                      />
                    ) : (
                      line.text
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

/**
 * Lights up the word currently being spoken.
 *
 * Word timings come from the synthesiser, so the highlight is driven by the
 * same clock as the audio rather than an estimate.
 */
function HighlightedLine({
  text,
  lineStart,
  script,
  timing,
  wordIndex,
}: {
  text: string
  lineStart: number
  script: { text: string }[]
  timing: SlideTiming
  wordIndex: number
}) {
  // Words before this line, to convert a global word index into a local one.
  let before = 0
  for (let i = 0; i < lineStart; i++) {
    before += script[i].text.trim().split(/\s+/).length
  }
  const local = wordIndex - before
  const words = text.split(/(\s+)/)
  let wi = -1

  return (
    <>
      {words.map((chunk, i) => {
        if (/^\s+$/.test(chunk)) return <span key={i}>{chunk}</span>
        wi++
        const isNow = wi === local
        return (
          <span key={i} className={isNow ? 'rounded bg-gold/30 text-white' : undefined}>
            {chunk}
          </span>
        )
      })}
    </>
  )
}
