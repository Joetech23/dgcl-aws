'use client'

import { useEffect, useState } from 'react'
import { confirmCheckout, payConsultation } from '@/lib/backend'
import { CONSULTATION_FEE_USD, money } from '@/config/pricing'
import { ButtonLink, Container, buttonClass } from './ui'
import { IconCheck, IconClock } from './icons'

/**
 * The page after the consultation fee.
 *
 *   /booking/?paid=<stripe session>   back from a payment: check it, then confirm
 *   /booking/?lead=<enquiry id>       they left the payment page: offer it again
 *
 * The check is made by the server against Stripe, so this page cannot be
 * made to say "paid" by editing its address.
 */
const FEE = money(CONSULTATION_FEE_USD)

type View = { kind: 'checking' } | { kind: 'paid' } | { kind: 'pending' } | { kind: 'unpaid'; lead: string } | { kind: 'none' }

export function BookingStatus() {
  const [view, setView] = useState<View>({ kind: 'checking' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const session = q.get('paid')
    const lead = q.get('lead')
    if (session) {
      let tries = 0
      const check = async () => {
        const res = await confirmCheckout(session)
        if (res.ok) return setView({ kind: 'paid' })
        // A card payment can take a few seconds to settle: look again, briefly.
        if (res.pending && ++tries < 4) return void setTimeout(check, 2500)
        setView({ kind: 'pending' })
      }
      void check()
    } else if (lead && /^[0-9a-f-]{36}$/i.test(lead)) setView({ kind: 'unpaid', lead })
    else setView({ kind: 'none' })
  }, [])

  async function pay(lead: string) {
    setBusy(true)
    setError(null)
    const res = await payConsultation(lead)
    if (res.ok && res.url) return window.location.assign(res.url)
    setBusy(false)
    if (res.ok) setView({ kind: 'paid' })
    else setError(res.error)
  }

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface p-7 text-center sm:p-10" aria-live="polite">
        {view.kind === 'checking' ? (
          <>
            <span className="mx-auto grid h-16 w-16 animate-pulse place-items-center rounded-full bg-slate text-ink/40">
              <IconClock size={28} />
            </span>
            <h1 className="mt-5 font-display text-[24px] font-extrabold text-ink">Checking your payment</h1>
            <p className="mt-2 text-[15px] text-ink/60">This takes a moment.</p>
          </>
        ) : view.kind === 'paid' ? (
          <>
            <span className="anim-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-white">
              <IconCheck size={32} />
            </span>
            <h1 className="mt-5 font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">Your consultation is booked</h1>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink/65">
              We have received your {FEE} consultation fee. A DGCL adviser will email or call you, usually within one working day, to agree a time for your one-to-one meeting.
            </p>
            <p className="mt-2 text-[14.5px] text-ink/55">If you go on to enrol, the {FEE} comes off your training fee.</p>
            <ButtonLink href="/dashboard/" size="lg" className="mt-7 w-full">
              Go to my dashboard
            </ButtonLink>
          </>
        ) : view.kind === 'pending' ? (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-[#7A5A00] dark:text-gold">
              <IconClock size={28} />
            </span>
            <h1 className="mt-5 font-display text-[24px] font-extrabold text-ink">We are still waiting for your payment</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              If you completed the payment, you do not need to do anything: we will email you as soon as it reaches us. If you were charged and hear nothing within a day, write to info@dgclgroup.com.
            </p>
            <ButtonLink href="/" variant="secondary" size="lg" className="mt-7 w-full">
              Back to the home page
            </ButtonLink>
          </>
        ) : view.kind === 'unpaid' ? (
          <>
            <h1 className="font-display text-[24px] font-extrabold text-ink">Confirm your consultation</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              Your details are saved, and nothing has been charged. Pay the {FEE} consultation fee to confirm your one-to-one meeting with a DGCL adviser.
            </p>
            {error ? (
              <p role="alert" className="mt-4 rounded-xl bg-rose/10 px-3.5 py-2.5 text-[14px] text-rose">
                {error}
              </p>
            ) : null}
            <button type="button" disabled={busy} onClick={() => void pay(view.lead)} className={buttonClass('primary', 'lg', 'mt-6 w-full')}>
              {busy ? 'Opening secure payment…' : `Pay ${FEE} now`}
            </button>
            <ButtonLink href="/" variant="ghost" size="md" className="mt-2 w-full">
              Not now
            </ButtonLink>
          </>
        ) : (
          <>
            <h1 className="font-display text-[24px] font-extrabold text-ink">Book a consultation</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">Choose a programme and leave your details to book a one-to-one consultation with a DGCL adviser.</p>
            <ButtonLink href="/plans/#instructor-led" size="lg" className="mt-6 w-full">
              See instructor-led training
            </ButtonLink>
          </>
        )}
      </div>
    </Container>
  )
}
