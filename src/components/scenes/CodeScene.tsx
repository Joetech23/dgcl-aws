'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * A code listing whose lines light up as the narrator explains them.
 *
 * The IAM deck teaches policies by showing JSON, and a screenshot of JSON is
 * the one thing learners cannot follow while being talked through it. Here
 * the element being described is highlighted in the listing and explained in
 * the panel beside it, in step with the voice.
 *
 * The active highlight is the last one whose line has started, derived from
 * the clock, so scrubbing backwards moves the highlight back as well.
 */
export function CodeScene({ slide, shown, moduleLabel }: SceneProps) {
  const data = slide.data
  if (data?.kind !== 'code') return null

  const revealed = data.highlights.filter((h) => shown(h.id))
  const active = revealed[revealed.length - 1]
  const inActive = (n: number) => !!active && n >= active.lines[0] && n <= active.lines[1]

  return (
    <SlideFrame title={slide.title} titleAccent={slide.subtitle} sectionLabel={moduleLabel} chevron="none">
      {data.intro && shown('intro') ? (
        <p className="anim-rise mt-1 max-w-[92%] text-[clamp(0.62rem,1.33cqw,0.82rem)] leading-relaxed text-ink/65">
          {data.intro}
        </p>
      ) : null}

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-3">
        {/* the listing */}
        <div className="min-h-0 overflow-hidden rounded-md bg-[#0B1226] py-2 shadow-lift ring-1 ring-black/20">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 pb-1.5">
            <span className="h-2 w-2 rounded-full bg-rose/80" />
            <span className="h-2 w-2 rounded-full bg-gold/80" />
            <span className="h-2 w-2 rounded-full bg-mint/80" />
            <span className="ml-2 font-mono text-[9px] text-white/40">{data.filename ?? 'policy.json'}</span>
          </div>
          <pre className="pt-1 font-mono text-[clamp(0.5rem,1.15cqw,0.7rem)] leading-[1.55]">
            {data.code.map((line, i) => {
              const n = i + 1
              const on = inActive(n)
              return (
                <div
                  key={i}
                  className={`flex transition-colors duration-300 ${on ? 'bg-gold/15' : ''}`}
                  style={{ boxShadow: on ? 'inset 3px 0 0 #FFC000' : undefined }}
                >
                  <span className="w-7 shrink-0 select-none pr-2 text-right text-white/25">{n}</span>
                  <span className={active && !on ? 'opacity-45' : undefined}>
                    <Highlighted line={line} />
                  </span>
                </div>
              )
            })}
          </pre>
        </div>

        {/* the explanations, one per highlight, in order */}
        <ol className="flex min-h-0 flex-col gap-1.5">
          {data.highlights.map((h) => {
            const isOn = shown(h.id)
            const isActive = active?.id === h.id
            if (!isOn) {
              return <li key={h.id} className="h-[38px] rounded-md border border-dashed border-line/60 opacity-30" />
            }
            return (
              <li
                key={h.id}
                className={`anim-rise rounded-md border-l-[3px] px-2.5 py-1.5 transition-colors duration-300 ${
                  isActive ? 'border-gold bg-gold/10 shadow-lift' : 'border-line bg-white'
                }`}
              >
                <p className="font-mono text-[9px] text-ink/40">
                  {h.lines[1] !== h.lines[0] ? `lines ${h.lines[0]}-${h.lines[1]}` : `line ${h.lines[0]}`}
                </p>
                <p className="font-display text-[clamp(0.62rem,1.3cqw,0.82rem)] font-bold text-blue-deep">{h.label}</p>
                <p className="text-[clamp(0.52rem,1.1cqw,0.68rem)] leading-snug text-ink/65">{h.body}</p>
              </li>
            )
          })}
        </ol>
      </div>

      {data.footnote && shown(data.footnote.id) ? (
        <p className="anim-rise mt-2 border-l-[3px] border-gold pl-3 text-[clamp(0.6rem,1.26cqw,0.78rem)] leading-relaxed text-ink/70">
          {data.footnote.text}
        </p>
      ) : null}
    </SlideFrame>
  )
}

/** Minimal JSON colouring: keys, string values, and everything else. */
function Highlighted({ line }: { line: string }) {
  // shell comments, for the EC2 listings
  if (/^\s*#/.test(line)) return <span className="italic text-white/40">{line}</span>
  const parts: { text: string; kind: 'key' | 'str' | 'plain' }[] = []
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index), kind: 'plain' })
    parts.push({ text: m[1], kind: m[2] ? 'key' : 'str' })
    if (m[2]) parts.push({ text: m[2], kind: 'plain' })
    last = re.lastIndex
  }
  if (last < line.length) parts.push({ text: line.slice(last), kind: 'plain' })
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          className={p.kind === 'key' ? 'text-[#7DD3FC]' : p.kind === 'str' ? 'text-[#FCD34D]' : 'text-white/70'}
        >
          {p.text}
        </span>
      ))}
    </>
  )
}
