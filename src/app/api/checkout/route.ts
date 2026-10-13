import { NextResponse, type NextRequest } from 'next/server'
import { CONSULTATION_FEE_USD, PAID_MODULES } from '@/config/pricing'
import { createCheckout, stripeConfigured } from '@/lib/server/stripe'
import { admin, crossSite, siteOrigin, userFromRequest } from '@/lib/server/supabase'

/**
 * Starts a payment and answers with the Stripe page to send the learner to.
 *
 *   { kind: 'module', slug }          a signed-in learner unlocks one module
 *   { kind: 'consultation', leadId }  the fee that confirms an instructor-led enquiry
 *
 * The amount is always taken from config/pricing.ts. Nothing is opened here:
 * access is granted only after Stripe confirms the payment (see ../stripe/webhook
 * and ./confirm).
 *
 * Needs STRIPE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY on the server. Without
 * both it refuses to start, so nobody can pay for something that could not
 * then be delivered.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status })

export async function POST(req: NextRequest) {
  if (crossSite(req)) return fail(403, 'forbidden')
  const body = (await req.json().catch(() => null)) as { kind?: string; slug?: string; leadId?: string } | null
  if (!body) return fail(400, 'bad-request')

  const db = admin()
  if (!stripeConfigured() || !db) return fail(503, 'not-configured')
  const site = siteOrigin(req)

  try {
    if (body.kind === 'module') {
      const slug = String(body.slug ?? '')
      const item = PAID_MODULES[slug]
      if (!item) return fail(400, 'unknown-module')
      const user = await userFromRequest(req)
      if (!user) return fail(401, 'sign-in')

      // Already theirs (bought before, or on a programme): do not charge again.
      const [{ data: bought }, { data: profile }] = await Promise.all([
        db.from('purchases').select('id').eq('user_id', user.id).eq('module_slug', slug).limit(1),
        db.from('profiles').select('track').eq('id', user.id).maybeSingle(),
      ])
      if (bought?.length || profile?.track) return NextResponse.json({ ok: true, owned: true })

      const session = await createCheckout({
        name: item.name,
        description: 'AWS Cloud Training, self-paced. One payment, and the module stays open on your account.',
        usd: item.usd,
        email: user.email,
        reference: user.id,
        metadata: { kind: 'module', user_id: user.id, module_slug: slug },
        successUrl: `${site}/learn/${slug}/?paid={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${site}/learn/${slug}/`,
      })
      return NextResponse.json({ ok: true, url: session.url })
    }

    if (body.kind === 'consultation') {
      const leadId = String(body.leadId ?? '')
      if (!UUID.test(leadId)) return fail(400, 'unknown-enquiry')
      const { data: lead } = await db.from('leads').select('id, email, course, consultation_paid').eq('id', leadId).maybeSingle()
      if (!lead) return fail(404, 'unknown-enquiry')
      if (lead.consultation_paid) return NextResponse.json({ ok: true, owned: true })

      const session = await createCheckout({
        name: 'One-to-one consultation with a DGCL adviser',
        description: `${lead.course ?? 'Instructor-led training'}. This fee comes off your training fee if you enrol.`,
        usd: CONSULTATION_FEE_USD,
        email: lead.email,
        reference: lead.id,
        metadata: { kind: 'consultation', lead_id: lead.id },
        successUrl: `${site}/booking/?paid={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${site}/booking/?lead=${lead.id}`,
      })
      return NextResponse.json({ ok: true, url: session.url })
    }
  } catch (e) {
    console.error('[checkout]', e instanceof Error ? e.message : e)
    return fail(502, 'payment-provider')
  }

  return fail(400, 'bad-request')
}
