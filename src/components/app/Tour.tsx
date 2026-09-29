'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useAccount } from '@/lib/backend'
import { IconArrowLeft, IconArrowRight, IconClose, IconSparkle } from '@/components/site/icons'

/**
 * First-visit guide to the dashboard.
 *
 * A dimmed page with a spotlight on one part at a time and a short note on
 * what it is for. Steps whose target is not on screen (the sidebar card on a
 * phone, say) are skipped. Runs once automatically, then from "Show me
 * around" in the account menu.
 */

const DONE_KEY = 'dgcl-tour-done'
const EVENT = 'dgcl-tour-start'

export const startTour = () => window.dispatchEvent(new Event(EVENT))

type Step = { target?: string; title: string; body: string }

const STEPS: Step[] = [
  {
    title: 'Welcome to your dashboard',
    body: 'A one-minute tour of where everything is. You can skip it and come back any time from the menu under your name.',
  },
  {
    target: 'continue',
    title: '1. Start here',
    body: 'This is always your next lesson. Press play with the sound on. Each lesson pauses to hand you a short activity; finish it and the lesson carries on.',
  },
  {
    target: 'stats',
    title: '2. See how far you have come',
    body: 'Modules finished, points (10 for every lesson) and your overall progress, updated as you learn.',
  },
  {
    target: 'nav-self',
    title: '3. Self-paced lessons',
    body: 'Every module in one place. The Introduction and Modules 1 to 4 are free, and you can open them in any order.',
  },
  {
    target: 'nav-live',
    title: '4. Instructor-led classes',
    body: 'Prefer a teacher? Live classes run for AWS Cloud, DevOps, Cybersecurity, and Data and AI. Ask our team from there.',
  },
  {
    target: 'goals',
    title: '5. Keep a streak',
    body: 'Learn a little each day to build your streak and complete the weekly goals.',
  },
  {
    target: 'theme',
    title: '6. Light or dark',
    body: 'Switch the look whenever you like. The lessons themselves always stay easy to read.',
  },
  {
    title: 'You are all set',
    body: 'Press play on your next lesson whenever you are ready. Good luck!',
  },
]

function visible(el: Element) {
  const r = el.getBoundingClientRect()
  const s = getComputedStyle(el)
  return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
}

function findTarget(key?: string): HTMLElement | null {
  if (!key) return null
  return (Array.from(document.querySelectorAll(`[data-tour="${key}"]`)).find(visible) as HTMLElement) ?? null
}

export function Tour() {
  return (
    <Suspense>
      <TourInner />
    </Suspense>
  )
}

function TourInner() {
  const { user } = useAccount()
  const path = usePathname()
  const params = useSearchParams()
  const [step, setStep] = useState<number | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const steps = STEPS
  const onDashboard = path.startsWith('/dashboard')

  // Start on the first dashboard visit, or when asked.
  useEffect(() => {
    if (!onDashboard || !user) return
    let done = false
    try {
      done = localStorage.getItem(DONE_KEY) === '1'
    } catch {
      done = true
    }
    if (params.get('tour') === '1' || !done) {
      const t = setTimeout(() => setStep(0), 700)
      return () => clearTimeout(t)
    }
  }, [onDashboard, user, params])

  useEffect(() => {
    const go = () => setStep(0)
    window.addEventListener(EVENT, go)
    return () => window.removeEventListener(EVENT, go)
  }, [])

  const finish = useCallback(() => {
    setStep(null)
    try {
      localStorage.setItem(DONE_KEY, '1')
    } catch {
      /* it may show again next time */
    }
  }, [])

  // Move to the next step that has something on screen (or no target).
  const move = useCallback(
    (from: number, dir: 1 | -1) => {
      let i = from + dir
      while (i > 0 && i < steps.length - 1 && steps[i].target && !findTarget(steps[i].target)) i += dir
      if (i < 0) i = 0
      if (i >= steps.length) return finish()
      setStep(i)
    },
    [steps, finish],
  )

  const current = step !== null ? steps[step] : null

  // Measure the spotlight, and keep it glued on scroll and resize.
  useLayoutEffect(() => {
    if (!current) return
    const el = findTarget(current.target)
    if (!el) {
      setRect(null)
      return
    }
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const measure = () => setRect(el.getBoundingClientRect())
    const t = setTimeout(measure, 380)
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [current])

  useEffect(() => {
    if (step === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
      if (e.key === 'ArrowRight') move(step, 1)
      if (e.key === 'ArrowLeft' && step > 0) move(step, -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, move, finish])

  if (step === null || !current) return null

  const pad = 8
  const spot = rect && current.target ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null
  const isPhone = typeof window !== 'undefined' && window.innerWidth < 640
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  // Put the note below the spotlight if there is room, else above it.
  const below = spot ? spot.top + spot.height + 230 < vh : true
  const cardStyle: React.CSSProperties =
    !spot || isPhone
      ? {}
      : {
          position: 'fixed',
          top: below ? spot.top + spot.height + 14 : undefined,
          bottom: below ? undefined : vh - spot.top + 14,
          left: Math.min(Math.max(16, spot.left), vw - 376),
        }
  const count = steps.length - 2
  const numbered = step > 0 && step < steps.length - 1

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Dashboard tour">
      {spot ? (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-2xl transition-all duration-300 ease-out"
          style={{ ...spot, boxShadow: '0 0 0 9999px rgba(3, 6, 22, 0.62), 0 0 0 3px #FFC000' }}
        />
      ) : (
        <div aria-hidden className="anim-fade fixed inset-0 bg-[rgba(3,6,22,0.62)]" />
      )}
      {/* Clicks outside the card do nothing, so a stray tap cannot lose the tour. */}
      <div className="fixed inset-0" />

      {/* The wrapper places the card; the card animates. Keeping them apart
          stops the entrance animation's transform from undoing the centring. */}
      <div
        style={cardStyle}
        className={`z-10 ${
          !spot
            ? 'fixed inset-0 grid place-items-center p-4'
            : isPhone
              ? 'fixed inset-x-4 bottom-[calc(84px+env(safe-area-inset-bottom))]'
              : 'w-[min(360px,calc(100vw-32px))]'
        }`}
      >
        <div key={step} className="anim-rise w-full max-w-[360px] rounded-2xl bg-surface p-5 shadow-stage ring-1 ring-line">
          <div className="flex items-start gap-3">
            {!current.target ? (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold text-blue-deep">
                <IconSparkle size={20} />
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-display text-[16.5px] font-extrabold leading-snug text-ink">{current.title}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{current.body}</p>
            </div>
            <button
              type="button"
              onClick={finish}
              aria-label="Close tour"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/50 hover:bg-slate hover:text-ink"
            >
              <IconClose size={18} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2">
            {numbered ? (
              <div className="flex gap-1" aria-label={`Step ${step} of ${count}`}>
                {Array.from({ length: count }).map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i + 1 === step ? 'w-5 bg-blue' : 'w-1.5 bg-line'}`} />
                ))}
              </div>
            ) : step === 0 ? (
              <button type="button" onClick={finish} className="text-[13.5px] font-semibold text-ink/55 hover:text-ink">
                Skip
              </button>
            ) : null}
            <div className="ml-auto flex gap-2">
              {step > 0 && step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => move(step, -1)}
                  aria-label="Back"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink hover:bg-slate"
                >
                  <IconArrowLeft size={18} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => (step === steps.length - 1 ? finish() : move(step, 1))}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue px-4 font-display text-[14px] font-bold text-white hover:bg-blue-electric"
              >
                {step === 0 ? 'Show me' : step === steps.length - 1 ? 'Start learning' : 'Next'}
                {step < steps.length - 1 ? <IconArrowRight size={16} /> : null}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
