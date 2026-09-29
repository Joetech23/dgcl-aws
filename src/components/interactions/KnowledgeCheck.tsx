'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { KnowledgeCheck as Spec } from '@/lib/lesson/types'

/**
 * A check the learner can get wrong without being punished for it.
 * Every option carries its own explanation, so the feedback teaches whichever
 * way they answered — the difference between a quiz and a lesson.
 */
export function KnowledgeCheck({
  spec,
  index,
  onAnswered,
}: {
  spec: Spec
  index?: number
  onAnswered?: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const correctIds = spec.options.filter((o) => o.correct).map((o) => o.id)
  const isCorrect =
    picked.length === correctIds.length && correctIds.every((id) => picked.includes(id))

  const toggle = (id: string) => {
    if (submitted) return
    setPicked((prev) =>
      spec.multi
        ? prev.includes(id)
          ? prev.filter((p) => p !== id)
          : [...prev, id]
        : [id],
    )
  }

  const submit = () => {
    setSubmitted(true)
    onAnswered?.(isCorrect)
  }

  return (
    <div className="border border-line bg-slate p-4">
      <p className="flex gap-2.5 text-[14px] leading-relaxed text-blue-deep">
        {index !== undefined ? (
          <span aria-hidden className="mt-0.5 font-mono text-[11px] text-blue-electric">
            {String(index + 1).padStart(2, '0')}
          </span>
        ) : null}
        <span>{spec.prompt}</span>
      </p>
      {spec.multi ? (
        <p className="mt-1 pl-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink/45">
          Choose all that apply
        </p>
      ) : null}

      <ul className="mt-3 space-y-2">
        {spec.options.map((o) => {
          const chosen = picked.includes(o.id)
          const show = submitted && (chosen || o.correct)
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={submitted}
                aria-pressed={chosen}
                onClick={() => toggle(o.id)}
                className={`w-full border px-3 py-2 text-left text-[13.5px] transition-colors ${
                  submitted
                    ? o.correct
                      ? 'border-mint/60 bg-mint/10 text-blue-deep'
                      : chosen
                        ? 'border-rose/60 bg-rose/10 text-blue-deep'
                        : 'border-line bg-slate text-ink/45'
                    : chosen
                      ? 'border-blue bg-blue/[0.1] text-blue-deep'
                      : 'border-line bg-white text-blue-deep hover:border-blue/50'
                }`}
              >
                <span className="flex items-start gap-2">
                  {submitted ? (
                    <span aria-hidden className={o.correct ? 'text-mint' : chosen ? 'text-rose' : 'text-transparent'}>
                      {o.correct ? '✓' : chosen ? '✕' : '·'}
                    </span>
                  ) : null}
                  <span>{o.label}</span>
                </span>
                {show ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1.5 block text-[12.5px] leading-relaxed text-ink/60"
                  >
                    {o.explain}
                  </motion.span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>

      {!submitted ? (
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={submit}
          className="mt-3 rounded-md border border-blue bg-blue px-4 py-2 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-slate disabled:text-ink/35"
        >
          Check
        </button>
      ) : (
        <p className={`mt-3 font-mono text-[11.5px] ${isCorrect ? 'text-mint' : 'text-blue-electric'}`}>
          {isCorrect ? 'Correct.' : 'Not quite. The reasoning is above.'}
        </p>
      )}
    </div>
  )
}
