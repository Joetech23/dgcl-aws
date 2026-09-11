'use client'

/**
 * The transport bar.
 *
 * One deliberate difference from a normal player: the scrubber shows where the
 * course will stop and ask the learner to do something. A featureless progress
 * bar tells you how long is left; this tells you what is coming.
 */

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function Transport({
  currentMs,
  durationMs,
  playing,
  atGate,
  gateMs,
  gateDone,
  muted,
  onToggle,
  onSeek,
  onReplay,
  onToggleMute,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  currentMs: number
  durationMs: number
  playing: boolean
  atGate: boolean
  gateMs: number | null
  gateDone: boolean
  muted: boolean
  onToggle: () => void
  onSeek: (ms: number) => void
  onReplay: () => void
  onToggleMute: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const pct = durationMs ? Math.min(100, (currentMs / durationMs) * 100) : 0
  const gatePct =
    gateMs !== null && durationMs ? Math.min(100, (gateMs / durationMs) * 100) : null

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 px-3 py-2.5 sm:px-4">
      <button
        type="button"
        onClick={onToggle}
        disabled={atGate}
        aria-label={playing ? 'Pause' : 'Play'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-blue-deep transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
            <rect x="1.5" y="1" width="3" height="10" rx="1" />
            <rect x="7.5" y="1" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
            <path d="M2.5 1.4v9.2a.6.6 0 0 0 .93.5l7-4.6a.6.6 0 0 0 0-1L3.43.9a.6.6 0 0 0-.93.5Z" />
          </svg>
        )}
      </button>

      <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/60">
        {fmt(currentMs)} / {fmt(durationMs)}
      </span>

      <div className="relative order-last flex h-5 w-full min-w-[160px] flex-1 items-center sm:order-none sm:w-auto">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{ width: `${pct}%` }}
        />
        {/* the gate marker — the thing their bar cannot show */}
        {gatePct !== null ? (
          <span
            className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${gatePct}%` }}
            title={gateDone ? 'Activity — completed' : 'The course stops here and asks you something'}
          >
            <span
              className={`block h-3 w-3 rotate-45 rounded-[2px] border-2 ${
                gateDone ? 'border-mint bg-mint' : 'border-white bg-blue-electric'
              }`}
            />
          </span>
        ) : null}
        <input
          type="range"
          className="scrub relative z-20 h-5 w-full bg-transparent"
          min={0}
          max={Math.max(1, durationMs)}
          value={Math.min(currentMs, durationMs)}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Seek through this slide"
          aria-valuetext={`${fmt(currentMs)} of ${fmt(durationMs)}`}
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <TransportBtn onClick={onReplay} label="Replay this slide">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" strokeLinecap="round" />
            <path d="M13.7 2.2v3.1h-3.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </TransportBtn>
        <TransportBtn onClick={onToggleMute} label={muted ? 'Unmute' : 'Mute'} pressed={muted}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M4 6H2.2A.7.7 0 0 0 1.5 6.7v2.6a.7.7 0 0 0 .7.7H4l3 2.4V3.6L4 6Z" strokeLinejoin="round" />
            {muted ? (
              <path d="M10 6.2l3.2 3.6M13.2 6.2L10 9.8" strokeLinecap="round" />
            ) : (
              <path d="M9.8 5.6a3.2 3.2 0 0 1 0 4.8M11.8 3.8a5.8 5.8 0 0 1 0 8.4" strokeLinecap="round" />
            )}
          </svg>
        </TransportBtn>

        <div className="mx-1 h-5 w-px bg-white/15" />

        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="rounded px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:bg-transparent"
        >
          ‹ Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="rounded px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:bg-transparent"
        >
          Next ›
        </button>
      </div>
    </div>
  )
}

function TransportBtn({
  onClick,
  label,
  pressed,
  children,
}: {
  onClick: () => void
  label: string
  pressed?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded text-white/75 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  )
}
