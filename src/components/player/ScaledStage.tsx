'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A slide that behaves like video.
 *
 * Every slide is laid out once, on a fixed 960 x 540 canvas, and the whole
 * canvas is scaled to fit whatever box it is given. A phone therefore shows
 * exactly the picture a desktop shows, only smaller, which is how a Storyline
 * or video player behaves. Before this the slide reflowed to the screen, so on
 * a phone text wrapped differently and content ran off the bottom.
 *
 * The canvas is a size container, so scene typography written in `cqw` units
 * resolves against the canvas rather than the browser window.
 */
export const CANVAS_W = 960
export const CANVAS_H = 540

export function ScaledStage({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      const { width, height } = box.getBoundingClientRect()
      // Fit 16:9 inside the available box, limited by whichever side runs out
      // first. When the box has no height constraint (a phone in normal page
      // flow) width decides.
      const byWidth = width
      const byHeight = height > 0 ? (height * CANVAS_W) / CANVAS_H : Infinity
      const w = Math.max(0, Math.floor(Math.min(byWidth, byHeight)))
      setSize({ w, h: Math.round((w * CANVAS_H) / CANVAS_W) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const scale = size.w / CANVAS_W

  return (
    <div ref={boxRef} className={`flex items-center justify-center ${className}`}>
      <div
        className="relative overflow-hidden bg-white shadow-stage ring-1 ring-white/10"
        style={{ width: size.w, height: size.h }}
      >
        <div
          className="slide-canvas absolute left-0 top-0 origin-top-left"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            // Hide until measured so the first paint is never a full-size flash.
            visibility: size.w ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
