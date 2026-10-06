'use client'

import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { findTrack, tracks, type TrackId } from '@/config/tracks'
import { courses } from '@/config/courses'
import { saveLead, useAccount } from '@/lib/backend'
import { getReferral } from '@/lib/backend/referral'
import { PartnerSelect } from './PartnerSelect'
import { buttonClass } from './ui'
import { IconCheck, IconClose } from './icons'

/**
 * "Talk to us" form. Any button on the site can open it with a track and a
 * course already chosen. The details go to DGCL's sales team, who call back
 * with a price for the learner's country.
 */

type Prefill = { track?: TrackId; course?: string }
const Ctx = createContext<(p?: Prefill) => void>(() => {})
export const useEnquiry = () => useContext(Ctx)

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Prefill | null>(null)
  const show = useCallback((p: Prefill = {}) => setOpen(p), [])
  return (
    <Ctx.Provider value={show}>
      {children}
      {open ? <EnquiryModal prefill={open} onClose={() => setOpen(null)} /> : null}
    </Ctx.Provider>
  )
}

/** A button that opens the form. */
export function EnquireButton({
  track,
  course,
  children,
  className,
}: {
  track?: TrackId
  course?: string
  children: ReactNode
  className?: string
}) {
  const open = useEnquiry()
  return (
    <button type="button" onClick={() => open({ track, course })} className={className}>
      {children}
    </button>
  )
}

/* ---------- countries ---------- */

const TOP = ['United Kingdom', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ireland', 'United States', 'Canada', 'India', 'United Arab Emirates']

function allCountries(): string[] {
  try {
    const names = new Intl.DisplayNames(['en'], { type: 'region' })
    const out = new Set<string>()
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (const a of A)
      for (const b of A) {
        const code = a + b
        const n = names.of(code)
        // Unknown codes echo back; skip those and groupings like "European Union".
        if (n && n !== code && !/union|world|unknown|nations|pseudo|outlying|eurozone/i.test(n)) out.add(n)
      }
    return [...out].sort((x, y) => x.localeCompare(y))
  } catch {
    return TOP
  }
}

/* ---------- the form ---------- */

function EnquiryModal({ prefill, onClose }: { prefill: Prefill; onClose: () => void }) {
  const { user } = useAccount()
  const [track, setTrack] = useState<TrackId>(prefill.track ?? 'self-paced')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const first = useRef<HTMLInputElement | null>(null)
  const countries = useMemo(allCountries, [])
  const t = findTrack(track)!

  useEffect(() => {
    setCode(getReferral())
    first.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])


  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const phone = String(f.get('phone') ?? '').trim()
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Please add a phone number our team can call, with the country code.')
      return
    }
    setBusy(true)
    setError(null)
    const res = await saveLead({
      name,
      email: String(f.get('email') ?? ''),
      phone,
      country: String(f.get('country') ?? ''),
      track,
      course: String(f.get('course') ?? ''),
      message: String(f.get('message') ?? ''),
      referralCode: code,
    })
    setBusy(false)
    if (!res.ok) setError(res.error ?? 'Please try again.')
    else setSent(name.split(' ')[0] || 'there')
  }

  const courseOptions = track === 'self-paced' ? courses.filter((c) => c.online) : courses

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
      <button type="button" aria-label="Close" onClick={onClose} className="anim-fade absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
      <div className="anim-sheet relative flex max-h-[94dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-3xl bg-surface shadow-stage sm:rounded-3xl">
        <div className="relative shrink-0 overflow-hidden bg-blue-deep px-6 pb-6 pt-5 text-white">
          <div aria-hidden className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full border-[26px] border-gold/20" />
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white">
            <IconClose size={20} />
          </button>
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold">{sent ? 'Sent' : 'Talk to our team'}</p>
          <h2 id="enquiry-title" className="mt-1 pr-10 font-display text-[23px] font-extrabold leading-tight">
            {sent ? `Thank you, ${sent}.` : `${t.name} learning`}
          </h2>
          {!sent ? (
            <div role="radiogroup" aria-label="Way to learn" className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/10 p-1">
              {tracks.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={track === x.id}
                  onClick={() => setTrack(x.id)}
                  className={`h-10 rounded-lg font-display text-[13.5px] font-bold transition ${track === x.id ? 'bg-white text-blue-deep' : 'text-white/80 hover:text-white'}`}
                >
                  {x.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {sent ? (
          <div className="p-6 text-center sm:p-8">
            <span className="anim-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-white">
              <IconCheck size={32} />
            </span>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/70">
              Our team will call or email you within one working day with the options and price for your country.
            </p>
            <p className="mt-2 text-[14px] text-ink/50">In the meantime, the free modules are open to you.</p>
            <button type="button" onClick={onClose} className={buttonClass('primary', 'lg', 'mt-6 w-full')}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3.5 overflow-y-auto p-5 sm:p-6">
            <p className="text-[14px] leading-relaxed text-ink/60">
              Leave your details and a DGCL adviser will contact you with a price for your country. No payment now.
            </p>
            <Input ref={first} label="Full name" name="name" autoComplete="name" required defaultValue={user?.name ?? ''} />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={user?.email ?? ''} />
              <Input label="Phone (with country code)" name="phone" type="tel" autoComplete="tel" required placeholder="+44 7700 900000" defaultValue={user?.phone ?? ''} />
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Select label="Country" name="country" required defaultValue={user?.country ?? ''}>
                <option value="" disabled>
                  Choose…
                </option>
                <optgroup label="Most learners">
                  {TOP.map((c) => (
                    <option key={`top-${c}`}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="All countries">
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </optgroup>
              </Select>
              <Select label="About" name="course" key={track} defaultValue={prefill.course ?? courseOptions[0].title}>
                {prefill.course && !courseOptions.some((c) => c.title === prefill.course) ? <option value={prefill.course}>{prefill.course}</option> : null}
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
            <PartnerSelect id="enquiry-partner" value={code} onChange={setCode} />
            <label className="block">
              <span className="font-display text-[13px] font-bold text-ink">
                Anything we should know? <span className="font-normal text-ink/45">(optional)</span>
              </span>
              <textarea
                name="message"
                rows={2}
                className="mt-1.5 block w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
                placeholder="Best time to call, your background, questions…"
              />
            </label>
            {error ? (
              <p role="alert" className="rounded-xl bg-rose/10 px-3.5 py-2.5 text-[14px] text-rose">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={busy} className={buttonClass('primary', 'lg', 'w-full')}>
              {busy ? 'Sending…' : 'Send my details'}
            </button>
            <p className="text-center text-[12px] leading-relaxed text-ink/45">DGCL will only use these details to contact you about your training.</p>
          </form>
        )}
      </div>
    </div>
  )
}


const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string }>(function Input({ label, ...props }, ref) {
  return (
    <label className="block">
      <span className="font-display text-[13px] font-bold text-ink">{label}</span>
      <input
        ref={ref}
        {...props}
        className="mt-1.5 block h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[15.5px] text-ink outline-none transition placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </label>
  )
})

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <span className="font-display text-[13px] font-bold text-ink">{label}</span>
      <select
        {...props}
        className="mt-1.5 block h-12 w-full rounded-xl border border-line bg-surface px-3 text-[15px] text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
      >
        {children}
      </select>
    </label>
  )
}
