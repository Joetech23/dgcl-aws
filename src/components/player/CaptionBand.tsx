'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { Slide, SlideTiming } from '@/lib/course/types'

/**
 * Up to three lines of live transcript under the video.
 *
 * The line being spoken is bright, with the current word lit in gold; earlier
 * lines sit above it, dimmer. When a new line starts the column glides up and
 * the oldest line leaves. Only whole lines are ever shown: an earlier version
 * faded a clipped line through the top edge, which cut letters in half and read
 * as a rendering bug. Lines not yet spoken are never shown.
 */
export function CaptionBand({
  slide,
  timing,
  lineIndex,
  wordIndex,
  className = '',
}: {
  slide: Slide
  timing: SlideTiming | null
  lineIndex: number
  wordIndex: number
  className?: string
}) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const [offset, setOffset] = useState(0)

  useLayoutEffect(() => {
    const box = boxRef.current
    const active = lineRefs.current[lineIndex]
    if (!box || !active) return
    const avail = box.clientHeight
    const activeBottom = active.offsetTop + active.offsetHeight
    // Walk back from the active line and keep the earliest line that still
    // fits in full. The column is then shifted so that line sits at the top.
    let first = lineIndex
    for (let i = lineIndex - 1; i >= 0; i--) {
      const el = lineRefs.current[i]
      if (!el) break
      if (activeBottom - el.offsetTop > avail) break
      first = i
    }
    const firstEl = lineRefs.current[first]
    setOffset(firstEl ? firstEl.offsetTop : 0)
  }, [lineIndex, slide.id, timing])

  let wordsBefore = 0
  for (let i = 0; i < lineIndex; i++) {
    wordsBefore += slide.script[i].text.trim().split(/\s+/).length
  }
  const localWord = wordIndex - wordsBefore

  return (
    <div
      ref={boxRef}
      aria-live="polite"
      // Spacing above is a margin, not padding: overflow clips at the padding
      // edge, so top padding left a sliver of the scrolled-away line visible.
      className={`relative mt-2 h-[4.4rem] shrink-0 overflow-hidden px-4 sm:h-[4.6rem] sm:px-6 ${className}`}
    >
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${offset}px)` }}
      >
        {slide.script.map((line, i) => {
          const setRef = (el: HTMLParagraphElement | null) => {
            lineRefs.current[i] = el
          }
          if (i > lineIndex) return <p key={i} ref={setRef} className="hidden" />
          const isActive = i === lineIndex
          return (
            <p
              key={i}
              ref={setRef}
              className={`py-0.5 text-[13px] leading-snug transition-colors duration-500 sm:text-[14px] ${
                isActive ? 'font-medium text-white' : 'text-white/40'
              }`}
            >
              {isActive && timing ? <ActiveLine text={line.text} localWord={localWord} /> : line.text}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function ActiveLine({ text, localWord }: { text: string; localWord: number }) {
  const parts = text.split(/(\s+)/)
  let wi = -1
  return (
    <>
      {parts.map((chunk, i) => {
        if (/^\s+$/.test(chunk)) return <span key={i}>{chunk}</span>
        wi++
        return (
          <span
            key={i}
            className={`transition-colors duration-150 ${
              wi === localWord ? 'text-gold' : wi < localWord ? 'text-white' : 'text-white/55'
            }`}
          >
            {chunk}
          </span>
        )
      })}
    </>
  )
}
