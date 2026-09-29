'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@/lib/backend'
import {
  createPartner,
  issueCertificate,
  loadAdmin,
  setPartnerActive,
  setTrack,
  suggestCode,
  updateLead,
  type AdminData,
  type LeadRow,
  type LeadStatus,
  type PartnerRow,
  type StudentRow,
} from '@/lib/backend/admin'
import { referralLink } from '@/lib/backend/referral'
import { exportCSV, exportPDF, type Column } from '@/lib/export'
import { catalog } from '@/config/catalog'
import { tracks, type TrackId } from '@/config/tracks'
import { moduleName } from '@/lib/course/names'
import { Bars, Card, Chip, Columns, ExportButtons, Kpi, SearchBox, ago, fmtDate } from './ui'
import { buttonClass } from '@/components/site/ui'
import { IconAward, IconCheck, IconPhone } from '@/components/site/icons'

type Tab = 'overview' | 'learners' | 'enquiries' | 'partners' | 'certificates'

export function AdminPanel() {
  const account = useAccount()
  const [data, setData] = useState<AdminData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('overview')

  const reload = useCallback(() => {
    loadAdmin()
      .then((d) => {
        setData(d)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    if (account.isAdmin) reload()
  }, [account.isAdmin, reload])

  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as Tab
    if (['overview', 'learners', 'enquiries', 'partners', 'certificates'].includes(fromHash)) setTab(fromHash)
  }, [])

  if (!account.ready) return null
  if (!account.isAdmin) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-[22px] font-extrabold text-ink">Admins only</h1>
        <p className="mt-2 text-[15px] text-ink/60">This area is for the DGCL team. If you should have access, ask an existing admin to switch it on for your account.</p>
      </Card>
    )
  }

  const go = (t: Tab) => {
    setTab(t)
    history.replaceState(null, '', `#${t}`)
  }

  const newLeads = data?.leads.filter((l) => l.status === 'new').length ?? 0

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-blue-electric">DGCL team</p>
          <h1 className="font-display text-[clamp(1.6rem,3.2vw,2.1rem)] font-extrabold tracking-[-0.025em] text-ink">Admin panel</h1>
        </div>
        <button type="button" onClick={reload} className={buttonClass('secondary', 'sm')}>
          Refresh
        </button>
      </div>

      {data?.preview ? (
        <p className="mt-4 rounded-2xl bg-gold/15 px-4 py-3 text-[13.5px] leading-relaxed text-[#7A5A00] dark:text-gold">
          <strong>Preview data.</strong> Learners and enquiries marked &ldquo;sample&rdquo; are examples so you can try every screen. Once Supabase is connected, this shows your real learners.
        </p>
      ) : null}
      {error ? <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-[14px] text-rose">Could not load: {error}</p> : null}

      <div className="mt-5">
        <Chip
          value={tab}
          onChange={go}
          options={[
            { id: 'overview', label: 'Overview' },
            { id: 'learners', label: 'Learners', count: data?.students.length },
            { id: 'enquiries', label: 'Enquiries', count: newLeads || undefined },
            { id: 'partners', label: 'Partners', count: data?.partners.length },
            { id: 'certificates', label: 'Certificates', count: data?.certificates.length },
          ]}
        />
      </div>

      <div className="mt-5">
        {!data ? (
          <div className="grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : tab === 'overview' ? (
          <Overview data={data} go={go} />
        ) : tab === 'learners' ? (
          <Learners data={data} reload={reload} />
        ) : tab === 'enquiries' ? (
          <Enquiries data={data} reload={reload} />
        ) : tab === 'partners' ? (
          <Partners data={data} reload={reload} />
        ) : (
          <Certificates data={data} />
        )}
      </div>
    </div>
  )
}

/* ================= overview ================= */

function Overview({ data, go }: { data: AdminData; go: (t: Tab) => void }) {
  const s = data.students.filter((x) => x.role === 'student')
  const week = Date.now() - 7 * 864e5
  const active = s.filter((x) => x.lastActive && new Date(x.lastActive).getTime() > week).length
  const avg = s.length ? Math.round((s.reduce((n, x) => n + x.progress, 0) / s.length) * 100) : 0
  const enrolled = s.filter((x) => x.track).length

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5)
    const key = d.toISOString().slice(0, 10)
    return { label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), value: s.filter((x) => x.joinedAt.slice(0, 10) === key).length }
  })

  const byCountry = Object.entries(
    s.reduce<Record<string, number>>((acc, x) => {
      const c = x.country || 'Not given'
      acc[c] = (acc[c] ?? 0) + 1
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }))

  // How far learners get: the share who finished each produced module.
  const funnel = catalog.filter((m) => m.lesson).map((m) => ({ label: `${moduleName(m.number)} · ${m.short}`, slug: m.slug }))

  const statusCount = (st: LeadStatus) => data.leads.filter((l) => l.status === st).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Learners" value={s.length} hint={`${active} active this week`} />
        <Kpi label="Average progress" value={`${avg}%`} hint="Across produced lessons" tone="gold" />
        <Kpi label="On a programme" value={enrolled} hint={`${s.length ? Math.round((enrolled / s.length) * 100) : 0}% of learners`} tone="mint" />
        <Kpi label="New enquiries" value={statusCount('new')} hint="Waiting for a call" tone="rose" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-[16px] font-extrabold text-ink">New learners, last 14 days</h2>
          <div className="mt-6">
            <Columns series={days} />
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-[16px] font-extrabold text-ink">Where learners are</h2>
          <div className="mt-4">
            <Bars rows={byCountry} />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-[16px] font-extrabold text-ink">Modules finished</h2>
          <p className="mt-1 text-[13px] text-ink/50">Share of learners who completed each module.</p>
          <div className="mt-4">
            <Bars
              max={Math.max(1, s.length)}
              tone="bg-gold"
              rows={funnel.map((f) => {
                const n = s.filter((x) => x.finished.includes(f.slug)).length
                return { label: f.label, value: n, note: `${s.length ? Math.round((n / s.length) * 100) : 0}%` }
              })}
            />
          </div>
        </Card>
        <Card>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[16px] font-extrabold text-ink">Enquiries</h2>
            <button type="button" onClick={() => go('enquiries')} className="font-display text-[13px] font-bold text-blue hover:underline">
              Open
            </button>
          </div>
          <div className="mt-4">
            <Bars
              tone="bg-mint"
              rows={(['new', 'contacted', 'joined', 'closed'] as LeadStatus[]).map((st) => ({ label: STATUS_LABEL[st], value: statusCount(st) }))}
            />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[13px] text-ink/55">Top partners by referrals</p>
            <ul className="mt-2 space-y-1.5">
              {data.partners
                .map((p) => ({ p, n: s.filter((x) => x.referralCode === p.code).length + data.leads.filter((l) => l.referralCode === p.code).length }))
                .sort((a, b) => b.n - a.n)
                .slice(0, 3)
                .map(({ p, n }) => (
                  <li key={p.id} className="flex justify-between text-[13.5px]">
                    <span className="truncate text-ink/75">{p.name}</span>
                    <span className="font-display font-bold text-ink">{n}</span>
                  </li>
                ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ================= learners ================= */

const learnerColumns: Column<StudentRow>[] = [
  { label: 'Name', value: (r) => r.name },
  { label: 'Email', value: (r) => r.email },
  { label: 'Phone', value: (r) => r.phone },
  { label: 'Country', value: (r) => r.country },
  { label: 'Joined', value: (r) => fmtDate(r.joinedAt) },
  { label: 'Programme', value: (r) => (r.track ? tracks.find((t) => t.id === r.track)?.name : 'Free') },
  { label: 'Progress %', value: (r) => Math.round(r.progress * 100) },
  { label: 'Modules done', value: (r) => r.modulesDone },
  { label: 'Last active', value: (r) => fmtDate(r.lastActive) },
  { label: 'Partner code', value: (r) => r.referralCode },
  { label: 'Certificate', value: (r) => r.certificate },
]

function Learners({ data, reload }: { data: AdminData; reload: () => void }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'free' | TrackId>('all')
  const [sort, setSort] = useState<'joined' | 'progress' | 'active'>('joined')
  const [busy, setBusy] = useState<string | null>(null)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return data.students
      .filter((s) => s.role === 'student' || filter === 'all')
      .filter((s) => (filter === 'all' ? true : filter === 'free' ? !s.track : s.track === filter))
      .filter((s) => !needle || [s.name, s.email, s.country, s.referralCode].some((v) => v?.toLowerCase().includes(needle)))
      .sort((a, b) =>
        sort === 'progress' ? b.progress - a.progress : sort === 'active' ? (b.lastActive ?? '').localeCompare(a.lastActive ?? '') : b.joinedAt.localeCompare(a.joinedAt),
      )
  }, [data.students, q, filter, sort])

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id)
    try {
      await fn()
      reload()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const count = (f: typeof filter) => data.students.filter((s) => (f === 'all' ? true : f === 'free' ? !s.track : s.track === f)).length

  return (
    <Card className="!p-0">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:p-5 lg:flex-row lg:items-center">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, email, country or partner code" />
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            value={filter}
            onChange={setFilter}
            options={[
              { id: 'all', label: 'All', count: count('all') },
              { id: 'free', label: 'Free', count: count('free') },
              { id: 'self-paced', label: 'Self-paced', count: count('self-paced') },
              { id: 'instructor-led', label: 'Instructor-led', count: count('instructor-led') },
            ]}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort"
            className="h-10 rounded-xl border border-line bg-surface px-2.5 text-[13px] font-semibold text-ink"
          >
            <option value="joined">Newest</option>
            <option value="progress">Most progress</option>
            <option value="active">Recently active</option>
          </select>
          <ExportButtons
            onCSV={() => exportCSV('learners', learnerColumns, rows)}
            onPDF={() => void exportPDF('learners', 'Learners', learnerColumns.filter((c) => c.label !== 'Certificate' && c.label !== 'Phone'), rows, filterNote(filter, q))}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-[13.5px]">
          <thead className="font-display text-[12px] font-bold uppercase tracking-[0.06em] text-ink/45">
            <tr className="border-b border-line">
              <th className="px-5 py-3">Learner</th>
              <th className="px-3 py-3">Country</th>
              <th className="px-3 py-3">Joined</th>
              <th className="px-3 py-3">Progress</th>
              <th className="px-3 py-3">Last active</th>
              <th className="px-3 py-3">Programme</th>
              <th className="px-3 py-3">Partner</th>
              <th className="px-5 py-3 text-right">Certificate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-slate/50">
                <td className="px-5 py-3">
                  <p className="font-display font-bold capitalize text-ink">
                    {s.name}
                    {s.sample ? <span className="ml-1.5 rounded bg-slate px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink/40">sample</span> : null}
                    {s.role === 'admin' ? <span className="ml-1.5 rounded bg-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue">admin</span> : null}
                  </p>
                  <p className="text-[12.5px] text-ink/50">{s.email}</p>
                </td>
                <td className="px-3 py-3 text-ink/70">{s.country ?? <span className="text-ink/30">None</span>}</td>
                <td className="px-3 py-3 text-ink/70">{fmtDate(s.joinedAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${s.progress * 100}%` }} />
                    </div>
                    <span className="font-display text-[12.5px] font-bold text-ink">{Math.round(s.progress * 100)}%</span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-ink/45">{s.modulesDone} modules</p>
                </td>
                <td className="px-3 py-3 text-ink/70">{ago(s.lastActive)}</td>
                <td className="px-3 py-3">
                  <select
                    value={s.track ?? ''}
                    disabled={busy === s.id}
                    onChange={(e) => void run(s.id, () => setTrack(s.id, (e.target.value || null) as TrackId | null))}
                    aria-label={`Programme for ${s.name}`}
                    className={`h-9 rounded-lg border px-2 text-[13px] font-semibold ${s.track ? 'border-mint/50 bg-mint/10 text-ink' : 'border-line bg-surface text-ink/70'}`}
                  >
                    <option value="">Free only</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 font-mono text-[12.5px] text-ink/70">{s.referralCode ?? ''}</td>
                <td className="px-5 py-3 text-right">
                  {s.certificate ? (
                    <Link href={`/c/${s.certificate}/`} className="inline-flex items-center gap-1 font-display text-[12.5px] font-bold text-mint hover:underline">
                      <IconAward size={15} /> {s.certificate}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={busy === s.id || !!s.sample}
                      onClick={() => {
                        if (confirm(`Issue a certificate to ${s.name}?`)) void run(s.id, () => issueCertificate(s))
                      }}
                      className="font-display text-[12.5px] font-bold text-blue hover:underline disabled:cursor-not-allowed disabled:text-ink/30 disabled:no-underline"
                      title={s.sample ? 'Not available for sample learners' : undefined}
                    >
                      Issue
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="p-8 text-center text-[14px] text-ink/50">No learners match.</p> : null}
      </div>
    </Card>
  )
}

function filterNote(filter: string, q: string) {
  const parts = []
  if (filter !== 'all') parts.push(`Filter: ${filter}`)
  if (q) parts.push(`Search: "${q}"`)
  return parts.join(' · ') || undefined
}

/* ================= enquiries ================= */

const STATUS_LABEL: Record<LeadStatus, string> = { new: 'New', contacted: 'Contacted', joined: 'Joined', closed: 'Closed' }
const STATUS_TONE: Record<LeadStatus, string> = {
  new: 'bg-rose/10 text-rose',
  contacted: 'bg-gold/20 text-[#7A5A00] dark:text-gold',
  joined: 'bg-mint/10 text-[#077A55] dark:text-mint',
  closed: 'bg-slate text-ink/50',
}

const leadColumns: Column<LeadRow>[] = [
  { label: 'Received', value: (r) => fmtDate(r.createdAt) },
  { label: 'Name', value: (r) => r.name },
  { label: 'Email', value: (r) => r.email },
  { label: 'Phone', value: (r) => r.phone },
  { label: 'Country', value: (r) => r.country },
  { label: 'Way to learn', value: (r) => (r.track === 'instructor-led' ? 'Instructor-led' : r.track === 'self-paced' ? 'Self-paced' : r.track) },
  { label: 'About', value: (r) => r.course },
  { label: 'Partner code', value: (r) => r.referralCode },
  { label: 'Status', value: (r) => STATUS_LABEL[r.status] },
  { label: 'Message', value: (r) => r.message },
  { label: 'Notes', value: (r) => r.notes },
]

function Enquiries({ data, reload }: { data: AdminData; reload: () => void }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | LeadStatus>('all')
  const rows = data.leads.filter(
    (l) =>
      (status === 'all' || l.status === status) &&
      (!q.trim() || [l.name, l.email, l.phone, l.country, l.course, l.referralCode].some((v) => v?.toLowerCase().includes(q.trim().toLowerCase()))),
  )

  const change = async (l: LeadRow, patch: { status?: LeadStatus; notes?: string }) => {
    try {
      await updateLead(l.id, patch)
      reload()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="!p-4 sm:!p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBox value={q} onChange={setQ} placeholder="Search name, email, phone, country, course or code" />
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              value={status}
              onChange={setStatus}
              options={[
                { id: 'all', label: 'All', count: data.leads.length },
                ...(['new', 'contacted', 'joined', 'closed'] as LeadStatus[]).map((s) => ({ id: s, label: STATUS_LABEL[s], count: data.leads.filter((l) => l.status === s).length })),
              ]}
            />
            <ExportButtons
              onCSV={() => exportCSV('enquiries', leadColumns, rows)}
              onPDF={() => void exportPDF('enquiries', 'Enquiries', leadColumns.filter((c) => !['Message', 'Notes'].includes(c.label)), rows, filterNote(status, q))}
            />
          </div>
        </div>
      </Card>

      <ul className="grid gap-3 lg:grid-cols-2">
        {rows.map((l) => (
          <li key={l.id} className="flex flex-col rounded-2xl bg-surface p-4 shadow-[0_1px_0_rgb(var(--line))] sm:p-5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold text-ink">
                  {l.name}
                  {l.sample ? <span className="ml-1.5 rounded bg-slate px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink/40">sample</span> : null}
                </p>
                <p className="text-[12.5px] text-ink/50">
                  {ago(l.createdAt)} · {l.country ?? 'Country not given'}
                </p>
              </div>
              <select
                value={l.status}
                onChange={(e) => void change(l, { status: e.target.value as LeadStatus })}
                aria-label={`Status for ${l.name}`}
                className={`h-8 rounded-lg border-0 px-2 font-display text-[12.5px] font-bold ${STATUS_TONE[l.status]}`}
              >
                {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-[13.5px] text-ink/75">
              <strong className="font-semibold text-ink">{l.track === 'instructor-led' ? 'Instructor-led' : 'Self-paced'}</strong> · {l.course}
              {l.referralCode ? <span className="ml-1.5 rounded bg-blue/10 px-1.5 py-0.5 font-mono text-[11.5px] text-blue">{l.referralCode}</span> : null}
            </p>
            {l.message ? <p className="mt-2 rounded-xl bg-slate px-3 py-2 text-[13px] text-ink/70">{l.message}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {l.phone ? (
                <>
                  <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue px-3 font-display text-[12.5px] font-bold text-white">
                    <IconPhone size={15} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${l.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-display text-[12.5px] font-bold text-ink hover:bg-slate"
                  >
                    WhatsApp
                  </a>
                </>
              ) : null}
              <a href={`mailto:${l.email}`} className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-display text-[12.5px] font-bold text-ink hover:bg-slate">
                Email
              </a>
            </div>
            <NotesField value={l.notes ?? ''} onSave={(notes) => change(l, { notes })} />
          </li>
        ))}
      </ul>
      {!rows.length ? <Card className="text-center text-[14px] text-ink/50">No enquiries match.</Card> : null}
    </div>
  )
}

function NotesField({ value, onSave }: { value: string; onSave: (v: string) => Promise<void> }) {
  const [v, setV] = useState(value)
  const [saved, setSaved] = useState(false)
  return (
    <div className="mt-3 flex gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Add a note (price quoted, call back Tuesday…)"
        className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none placeholder:text-ink/35 focus:border-blue"
      />
      <button
        type="button"
        disabled={v === value}
        onClick={async () => {
          await onSave(v)
          setSaved(true)
          setTimeout(() => setSaved(false), 1800)
        }}
        className="h-9 shrink-0 rounded-lg border border-line px-3 font-display text-[12.5px] font-bold text-ink hover:bg-slate disabled:opacity-40"
      >
        {saved ? <IconCheck size={15} className="text-mint" /> : 'Save'}
      </button>
    </div>
  )
}

/* ================= partners ================= */

function Partners({ data, reload }: { data: AdminData; reload: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', code: '', reward: '' })
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const stats = (p: PartnerRow) => {
    const learners = data.students.filter((s) => s.referralCode === p.code)
    return {
      signups: learners.length,
      enquiries: data.leads.filter((l) => l.referralCode === p.code).length,
      joined: learners.filter((s) => s.track).length + data.leads.filter((l) => l.referralCode === p.code && l.status === 'joined').length,
    }
  }

  const columns: Column<PartnerRow>[] = [
    { label: 'Partner', value: (r) => r.name },
    { label: 'Email', value: (r) => r.email },
    { label: 'Code', value: (r) => r.code },
    { label: 'Link', value: (r) => referralLink(r.code) },
    { label: 'Sign-ups', value: (r) => stats(r).signups },
    { label: 'Enquiries', value: (r) => stats(r).enquiries },
    { label: 'Joined', value: (r) => stats(r).joined },
    { label: 'Reward', value: (r) => r.reward },
    { label: 'Active', value: (r) => (r.active ? 'Yes' : 'No') },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-display text-[16px] font-extrabold text-ink">Add a partner</h2>
        <p className="mt-1 text-[13.5px] text-ink/55">They get a code and a link. Anyone who signs up or enquires with it is credited to them.</p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1.2fr_0.8fr_1.2fr_auto]"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            try {
              await createPartner(form)
              setForm({ name: '', email: '', code: '', reward: '' })
              reload()
            } catch (err) {
              setError((err as Error).message)
            }
          }}
        >
          <Input label="Name" value={form.name} required onChange={(v) => setForm((f) => ({ ...f, name: v, code: f.code || (v.length > 2 ? suggestCode(v) : '') }))} placeholder="TechHub Lagos" />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="partner@example.com" />
          <Input label="Code" value={form.code} required onChange={(v) => setForm((f) => ({ ...f, code: v.toUpperCase() }))} placeholder="TECHHUB10" mono />
          <Input label="Reward" value={form.reward} onChange={(v) => setForm((f) => ({ ...f, reward: v }))} placeholder="£50 per learner who joins" />
          <div className="flex items-end">
            <button type="submit" className={buttonClass('primary', 'md', 'w-full')}>
              Add
            </button>
          </div>
        </form>
        {error ? <p className="mt-3 text-[13.5px] text-rose">{error}</p> : null}
      </Card>

      <Card className="!p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
          <h2 className="font-display text-[16px] font-extrabold text-ink">Partners</h2>
          <ExportButtons onCSV={() => exportCSV('partners', columns, data.partners)} onPDF={() => void exportPDF('partners', 'Partner referrals', columns.filter((c) => c.label !== 'Link'), data.partners)} />
        </div>
        <ul className="divide-y divide-line">
          {data.partners.map((p) => {
            const st = stats(p)
            return (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-bold text-ink">
                    {p.name}
                    {!p.active ? <span className="ml-1.5 rounded bg-slate px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink/45">paused</span> : null}
                  </p>
                  <p className="text-[12.5px] text-ink/50">{p.reward ?? 'No reward set'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue/10 px-2.5 py-1.5 font-mono text-[13px] font-medium text-blue">{p.code}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(referralLink(p.code))
                      setCopied(p.id)
                      setTimeout(() => setCopied(null), 1600)
                    }}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-line px-3 font-display text-[12.5px] font-bold text-ink hover:bg-slate"
                  >
                    {copied === p.id ? (
                      <>
                        <IconCheck size={14} className="text-mint" /> Copied
                      </>
                    ) : (
                      'Copy link'
                    )}
                  </button>
                </div>
                <dl className="grid grid-cols-3 gap-4 text-center lg:w-[270px]">
                  {(
                    [
                      ['Sign-ups', st.signups],
                      ['Enquiries', st.enquiries],
                      ['Joined', st.joined],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11.5px] text-ink/45">{k}</dt>
                      <dd className="font-display text-[18px] font-extrabold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={async () => {
                    await setPartnerActive(p.id, !p.active)
                    reload()
                  }}
                  className="h-9 shrink-0 rounded-lg border border-line px-3 font-display text-[12.5px] font-bold text-ink/70 hover:bg-slate"
                >
                  {p.active ? 'Pause' : 'Resume'}
                </button>
              </li>
            )
          })}
        </ul>
        {!data.partners.length ? <p className="p-8 text-center text-[14px] text-ink/50">No partners yet.</p> : null}
      </Card>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  mono,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void; mono?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <label className="block min-w-0">
      <span className="font-display text-[12.5px] font-bold text-ink">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block h-10 w-full rounded-xl border border-line bg-surface px-3 text-[14px] text-ink outline-none placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10 ${mono ? 'font-mono uppercase' : ''}`}
      />
    </label>
  )
}

/* ================= certificates ================= */

function Certificates({ data }: { data: AdminData }) {
  const columns: Column<AdminData['certificates'][number]>[] = [
    { label: 'ID', value: (r) => r.code },
    { label: 'Name', value: (r) => r.name },
    { label: 'Course', value: (r) => r.course },
    { label: 'Issued', value: (r) => fmtDate(r.issuedAt) },
  ]
  return (
    <Card className="!p-0">
      <div className="flex items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div>
          <h2 className="font-display text-[16px] font-extrabold text-ink">Certificates issued</h2>
          <p className="text-[13px] text-ink/50">Issue new ones from the Learners tab.</p>
        </div>
        <ExportButtons onCSV={() => exportCSV('certificates', columns, data.certificates)} onPDF={() => void exportPDF('certificates', 'Certificates issued', columns, data.certificates)} />
      </div>
      <ul className="divide-y divide-line">
        {data.certificates.map((c) => (
          <li key={c.code} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <IconAward size={20} className="shrink-0 text-gold" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[14px] font-bold capitalize text-ink">{c.name}</p>
              <p className="text-[12.5px] text-ink/50">
                {c.course} · {fmtDate(c.issuedAt)}
              </p>
            </div>
            <Link href={`/c/${c.code}/`} className="font-mono text-[12.5px] text-blue hover:underline">
              {c.code}
            </Link>
          </li>
        ))}
      </ul>
      {!data.certificates.length ? <p className="p-8 text-center text-[14px] text-ink/50">No certificates yet.</p> : null}
    </Card>
  )
}
