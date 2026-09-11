'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { ScenarioMatchSpec } from '@/lib/lesson/types'
import { Frame } from './Frame'

/**
 * A real situation, then a choice. Feedback explains the reasoning either way —
 * a wrong answer is a teaching moment, not a buzzer.
 */
export function ScenarioMatch({
  spec,
  onComplete,
}: {
  spec: ScenarioMatchSpec
  onComplete: () => void
}) {
  const [picked, setPicked] = useState<Record<string, string>>({})
  const answeredRight = spec.scenarios.filter((s) => {
    const choice = s.options.find((o) => o.id === picked[s.id])
    return choice?.correct
  }).length
  const done = answeredRight === spec.scenarios.length

  useEffect(() => {
    if (done) onComplete()
  }, [done, onComplete])

  return (
    <Frame
      prompt={spec.prompt}
      done={done}
      status={`${answeredRight} of ${spec.scenarios.length} matched correctly.`}
    >
      <ul className="space-y-3">
        {spec.scenarios.map((s, idx) => {
          const choiceId = picked[s.id]
          const choice = s.options.find((o) => o.id === choiceId)
          return (
            <li key={s.id} className="border border-line bg-slate p-4">
              <p className="flex gap-2.5 text-[14px] leading-relaxed text-blue-deep">
                <span aria-hidden className="mt-0.5 font-mono text-[11px] text-blue-electric">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{s.scenario}</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {s.options.map((o) => {
                  const isPicked = choiceId === o.id
                  const settled = isPicked && choice
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={isPicked}
                      onClick={() => setPicked((p) => ({ ...p, [s.id]: o.id }))}
                      className={`border px-3 py-1.5 text-[13px] transition-colors ${
                        settled
                          ? o.correct
                            ? 'border-mint bg-mint/15 text-blue-deep'
                            : 'border-rose bg-rose/15 text-blue-deep'
                          : 'border-line bg-white text-blue-deep hover:border-blue/50'
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>

              {choice ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 border-l-2 pl-3 text-[13px] leading-relaxed ${
                    choice.correct ? 'border-mint text-blue-deep' : 'border-rose text-ink/60'
                  }`}
                >
                  {choice.feedback}
                </motion.p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}
