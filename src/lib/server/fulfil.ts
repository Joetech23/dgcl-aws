import { PAID_MODULES } from '@/config/pricing'
import { consultationPaidAlert, consultationReceipt } from '@/lib/email/enquiry'
import { sendEmail, salesInbox } from './email'
import { admin } from './supabase'
import type { CheckoutSession } from './stripe'

/**
 * Records a payment Stripe has confirmed, exactly once.
 *
 * Called from two places with the same session: the Stripe webhook, and the
 * page the learner lands on after paying. Whichever arrives first does the
 * work; the other finds it already done. What was bought, and for whom, comes
 * from the labels this server put on the session when it was created, never
 * from the browser.
 */
export type Fulfilled =
  | { ok: true; kind: 'module'; slug: string }
  | { ok: true; kind: 'consultation'; lead: string }
  | { ok: false; reason: 'unpaid' | 'unknown' | 'not-configured' | 'failed' }

export async function fulfil(session: CheckoutSession, siteUrl: string): Promise<Fulfilled> {
  if (session.payment_status !== 'paid') return { ok: false, reason: 'unpaid' }
  const db = admin()
  if (!db) return { ok: false, reason: 'not-configured' }
  const meta = session.metadata ?? {}

  if (meta.kind === 'module' && meta.user_id && PAID_MODULES[meta.module_slug]) {
    const { error } = await db.from('purchases').upsert(
      {
        user_id: meta.user_id,
        module_slug: meta.module_slug,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        source: 'stripe',
      },
      { onConflict: 'stripe_session_id', ignoreDuplicates: true },
    )
    if (error) {
      console.error('[fulfil module]', error.message)
      return { ok: false, reason: 'failed' }
    }
    return { ok: true, kind: 'module', slug: meta.module_slug }
  }

  if (meta.kind === 'consultation' && meta.lead_id) {
    // Only the first call changes the row, so the emails go out once.
    const { data, error } = await db
      .from('leads')
      .update({ consultation_paid: true, paid_at: new Date().toISOString(), amount_cents: session.amount_total ?? 0, stripe_session_id: session.id })
      .eq('id', meta.lead_id)
      .eq('consultation_paid', false)
      .select('name, email, phone, country, course')
    if (error) {
      console.error('[fulfil consultation]', error.message)
      return { ok: false, reason: 'failed' }
    }
    const lead = data?.[0]
    if (lead) {
      const amount = (session.amount_total ?? 0) / 100
      const alert = consultationPaidAlert({ ...lead, amount }, siteUrl)
      const receipt = consultationReceipt({ ...lead, amount }, siteUrl)
      await Promise.all([
        sendEmail({ to: salesInbox(), replyTo: lead.email, ...alert }),
        sendEmail({ to: lead.email, replyTo: salesInbox(), ...receipt }),
      ])
    }
    return { ok: true, kind: 'consultation', lead: meta.lead_id }
  }

  console.error('[fulfil] paid session with no usable labels', session.id)
  return { ok: false, reason: 'unknown' }
}
