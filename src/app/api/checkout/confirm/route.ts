import { NextResponse, type NextRequest } from 'next/server'
import { fulfil } from '@/lib/server/fulfil'
import { getCheckout, stripeConfigured } from '@/lib/server/stripe'
import { crossSite, siteOrigin } from '@/lib/server/supabase'

/**
 * The page a learner returns to after paying calls this with the session id
 * Stripe put in the address. The server asks Stripe whether that session was
 * really paid, and only then records it. It does the same job as the webhook,
 * so access opens straight away even if the webhook is slow or not set up.
 *
 * The session id is a long random string only the payer has, and what it
 * unlocks was fixed when the session was created, so calling this with
 * someone else's id could at most confirm their own purchase for them.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (crossSite(req)) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
  const body = (await req.json().catch(() => null)) as { sessionId?: string } | null
  const id = String(body?.sessionId ?? '')
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,}$/.test(id)) return NextResponse.json({ ok: false, error: 'bad-request' }, { status: 400 })
  if (!stripeConfigured()) return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 503 })

  try {
    const session = await getCheckout(id)
    const result = await fulfil(session, siteOrigin(req))
    return NextResponse.json(result, { status: result.ok || result.reason === 'unpaid' ? 200 : 500 })
  } catch (e) {
    console.error('[checkout confirm]', e instanceof Error ? e.message : e)
    return NextResponse.json({ ok: false, error: 'payment-provider' }, { status: 502 })
  }
}
