'use client'

import type { ReactNode } from 'react'

/** Small shared pieces for the admin screens. */

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:p-6 ${className}`}>{children}</section>
}

export function Kpi({ label, value, hint, tone = 'blue' }: { label: string; value: string | number; hint?: string; tone?: 'blue' | 'gold' | 'mint' | 'rose' }) {
  const bar = { blue: 'bg-blue', gold: 'bg-gold', mint: 'bg-mint', rose: 'bg-rose' }[tone]
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface p-4 shadow-[0_1px_0_rgb(var(--line))] sm:p-5">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <p className="text-[12.5px] font-semibold text-ink/55">{label}</p>
      <p className="mt-1 font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] text-ink">{value}</p>
      {hint ? <p className="mt-1.5 text-[12px] text-ink/45">{hint}</p> : null}
    </div>
  )
}

/** Horizontal bars, labelled, for small breakdowns. */
export function Bars({ rows, max, tone = 'bg-blue' }: { rows: { label: string; value: number; note?: string }[]; max?: number; tone?: string }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length) return <p className="text-[13.5px] text-ink/45">Nothing yet.</p>
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate text-ink/75">{r.label}</span>
            <span className="shrink-0 font-display font-bold text-ink">{r.note ?? r.value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate">
            <div className={`h-full rounded-full ${tone} transition-[width] duration-700`} style={{ width: `${(r.value / top) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Column chart for a day-by-day series. */
export function Columns({ series }: { series: { label: string; value: number }[] }) {
  const top = Math.max(1, ...series.map((s) => s.value))
  return (
    <div>
      <div className="flex h-36 items-end gap-1.5">
        {series.map((s) => (
          <div key={s.label} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-blue/80 transition-[height] duration-700 group-hover:bg-blue"
              style={{ height: `${Math.max(3, (s.value / top) * 100)}%` }}
              title={`${s.label}: ${s.value}`}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[11px] font-bold text-surface group-hover:block">
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink/40">
        <span>{series[0]?.label}</span>
        <span>{series[series.length - 1]?.label}</span>
      </div>
    </div>
  )
}

export function ExportButtons({ onCSV, onPDF }: { onCSV: () => void; onPDF: () => void }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onCSV} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 font-display text-[13px] font-bold text-ink hover:bg-slate">
        <DownloadIcon /> CSV
      </button>
      <button type="button" onClick={onPDF} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 font-display text-[13px] font-bold text-ink hover:bg-slate">
        <DownloadIcon /> PDF
      </button>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
    </svg>
  )
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search</span>
      <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="9" cy="9" r="5.5" />
        <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-[14px] text-ink outline-none placeholder:text-ink/40 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </label>
  )
}

export function Chip<T extends string>({ options, value, onChange }: { options: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-slate p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-8 shrink-0 rounded-lg px-3 font-display text-[12.5px] font-bold transition ${value === o.id ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-ink/55 hover:text-ink'}`}
        >
          {o.label}
          {o.count !== undefined ? <span className="ml-1 text-ink/40">{o.count}</span> : null}
        </button>
      ))}
    </div>
  )
}

export const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

export function ago(iso: string | null) {
  if (!iso) return 'Never'
  const d = (Date.now() - new Date(iso).getTime()) / 36e5
  if (d < 1) return 'Just now'
  if (d < 24) return `${Math.floor(d)}h ago`
  const days = Math.floor(d / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}
