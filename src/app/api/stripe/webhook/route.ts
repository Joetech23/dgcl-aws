import { NextResponse, type NextRequest } from 'next/server'
import { fulfil } from '@/lib/server/fulfil'
import { getCheckout, verifyWebhook, type CheckoutSession } from '@/lib/server/stripe'
import { siteOrigin } from '@/lib/server/supabase'

/**
 * Stripe calls this when a payment completes, whether or not the learner
 * comes back to the site afterwards.
 *
 * In Stripe: Developers > Webhooks > Add endpoint
 *   URL     https://<site>/api/stripe/webhook/     (keep the final slash)
 *   Events  checkout.session.completed
 *           checkout.session.async_payment_succeeded
 * and put the endpoint's signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * Every call is checked against that secret; anything unsigned is refused.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EVENTS = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'not-configured' }, { status: 503 })

  // The signature covers the exact bytes Stripe sent, so read the body as text.
  const raw = await req.text()
  if (!verifyWebhook(raw, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'bad-signature' }, { status: 400 })
  }

  let event: { type?: string; data?: { object?: CheckoutSession } }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }
  const id = event.data?.object?.id
  if (!event.type || !EVENTS.has(event.type) || !id) return NextResponse.json({ received: true })

  try {
    // Read the session back from Stripe rather than trusting the copy in the message.
    const session = await getCheckout(id)
    const result = await fulfil(session, siteOrigin(req))
    // A 500 makes Stripe try again later, which is right when our database was the problem.
    if (!result.ok && (result.reason === 'failed' || result.reason === 'not-configured')) {
      return NextResponse.json({ error: result.reason }, { status: 500 })
    }
    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[stripe webhook]', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
