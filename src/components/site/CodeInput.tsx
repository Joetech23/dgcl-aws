'use client'

import { useEffect, useRef } from 'react'

/**
 * Six boxes for a one-time code. Typing moves to the next box, Backspace
 * moves back, pasting a whole code fills every box, and phones get the number
 * keypad and can autofill the code from the email or SMS bar.
 */
export function CodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  autoFocus = true,
}: {
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  disabled?: boolean
  autoFocus?: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const set = (next: string) => {
    const clean = next.replace(/\D/g, '').slice(0, 6)
    onChange(clean)
    if (clean.length === 6) onComplete?.(clean)
    return clean
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="6-digit code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1}`}
          maxLength={6}
          onChange={(e) => {
            const typed = e.target.value.replace(/\D/g, '')
            if (!typed) return
            // A paste or autofill lands in one box: spread it across the rest.
            const merged = (value.slice(0, i) + typed).slice(0, 6)
            const clean = set(merged)
            refs.current[Math.min(clean.length, 5)]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault()
              const at = d ? i : Math.max(0, i - 1)
              set(value.slice(0, at))
              refs.current[at]?.focus()
            } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            else if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus()
          }}
          onFocus={(e) => e.target.select()}
          className="h-14 w-full min-w-0 rounded-xl border border-line bg-surface text-center font-display text-[24px] font-extrabold text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10 disabled:opacity-60"
        />
      ))}
    </div>
  )
}
