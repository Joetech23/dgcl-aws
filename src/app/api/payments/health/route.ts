import { NextResponse, type NextRequest } from 'next/server'
import { admin, asUser, userFromRequest } from '@/lib/server/supabase'

/**
 * For the admin panel: is online payment set up correctly, and if not, why?
 *
 * Admins only. It reports which settings the server can see (never their
 * values), whether Stripe accepts the secret key, and whether the database
 * is ready to record payments. Stripe's own error message is passed on, since
 * that is usually the quickest way to the fix.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Check = { ok: boolean; detail: string }

export async function GET(req: NextRequest) {
  const user = await userFromRequest(req)
  if (!user) return NextResponse.json({ error: 'sign-in' }, { status: 401 })
  const { data: isAdmin } = await asUser(user.token).rpc('is_admin')
  if (isAdmin !== true) return NextResponse.json({ error: 'admins-only' }, { status: 403 })

  const key = (process.env.STRIPE_SECRET_KEY ?? '').trim()
  const raw = process.env.STRIPE_SECRET_KEY ?? ''
  const checks: Record<string, Check> = {}

  // ---------- the Stripe key ----------
  if (!key) checks.stripeKey = { ok: false, detail: 'STRIPE_SECRET_KEY is not set on the server.' }
  else if (key.startsWith('pk_')) checks.stripeKey = { ok: false, detail: 'STRIPE_SECRET_KEY holds the publishable key (pk_...). It needs the secret key (sk_test_... or sk_live_...).' }
  else if (!/^(sk|rk)_(test|live)_/.test(key)) checks.stripeKey = { ok: false, detail: 'STRIPE_SECRET_KEY does not look like a Stripe secret key. It should start with sk_test_ or sk_live_.' }
  else {
    const mode = key.includes('_live_') ? 'live' : 'test'
    const spaces = raw !== key ? ' Note: the value has spaces before or after it; remove them.' : ''
    try {
      const res = await fetch('https://api.stripe.com/v1/account', { headers: { Authorization: `Bearer ${key}` }, cache: 'no-store' })
      const json = (await res.json().catch(() => ({}))) as {
        error?: { message?: string }
        id?: string
        charges_enabled?: boolean
        country?: string
        settings?: { dashboard?: { display_name?: string } }
      }
      if (!res.ok) checks.stripeKey = { ok: false, detail: `Stripe refused the ${mode} key: ${json.error?.message ?? res.status}.${spaces}` }
      else if (mode === 'live' && json.charges_enabled === false)
        checks.stripeKey = { ok: false, detail: `The key works, but this Stripe account cannot take live payments yet. Finish activating it in the Stripe dashboard.${spaces}` }
      else
        checks.stripeKey = {
          ok: true,
          detail: `Stripe accepts the ${mode} key${json.settings?.dashboard?.display_name ? ` for "${json.settings.dashboard.display_name}"` : ''}${json.country ? ` (${json.country})` : ''}.${mode === 'test' ? ' Test mode: no real money is taken.' : ''}${spaces}`,
        }
    } catch (e) {
      checks.stripeKey = { ok: false, detail: `The server could not reach Stripe: ${e instanceof Error ? e.message : 'network error'}. The host may be blocking outgoing connections.` }
    }
  }

  // ---------- try a real (unpaid, unused) checkout page ----------
  if (checks.stripeKey.ok) {
    try {
      const body = new URLSearchParams({
        mode: 'payment',
        success_url: 'https://example.com/ok',
        cancel_url: 'https://example.com/cancel',
        'line_items[0][quantity]': '1',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][unit_amount]': '2000',
        'line_items[0][price_data][product_data][name]': 'Payment set-up check (not a real order)',
        'metadata[kind]': 'health-check',
      })
      const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        cache: 'no-store',
      })
      const json = (await res.json().catch(() => ({}))) as { error?: { message?: string }; id?: string }
      if (res.ok && json.id) {
        // Close it straight away so it can never be paid.
        await fetch(`https://api.stripe.com/v1/checkout/sessions/${json.id}/expire`, { method: 'POST', headers: { Authorization: `Bearer ${key}` } }).catch(() => {})
        checks.checkout = { ok: true, detail: 'Stripe can create a $20 payment page.' }
      } else checks.checkout = { ok: false, detail: `Stripe would not create a payment page: ${json.error?.message ?? res.status}` }
    } catch (e) {
      checks.checkout = { ok: false, detail: `Could not reach Stripe: ${e instanceof Error ? e.message : 'network error'}` }
    }
  }

  // ---------- webhook ----------
  const whsec = (process.env.STRIPE_WEBHOOK_SECRET ?? '').trim()
  checks.webhook = !whsec
    ? { ok: false, detail: 'STRIPE_WEBHOOK_SECRET is not set. Payments still open when the learner returns to the site, but not if they close the tab first.' }
    : whsec.startsWith('whsec_')
      ? { ok: true, detail: 'The webhook signing secret is set.' }
      : { ok: false, detail: 'STRIPE_WEBHOOK_SECRET should start with whsec_ (Stripe > Developers > Webhooks > your endpoint > Signing secret).' }

  // ---------- database ----------
  const db = admin()
  if (!db) checks.database = { ok: false, detail: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server, so a payment could not be recorded.' }
  else {
    const [purchases, leads] = await Promise.all([
      db.from('purchases').select('id', { count: 'exact', head: true }),
      db.from('leads').select('consultation_paid', { head: true }).limit(1),
    ])
    const err = purchases.error ?? leads.error
    if (!err) checks.database = { ok: true, detail: 'The service key works and the payment tables are in place.' }
    else if (/relation|does not exist|column|schema cache/i.test(err.message))
      checks.database = { ok: false, detail: 'The payment tables are missing: run supabase/migrations/0004_payments.sql in the Supabase SQL editor.' }
    else if (/jwt|api key|invalid|unauthor/i.test(err.message))
      checks.database = { ok: false, detail: 'SUPABASE_SERVICE_ROLE_KEY was refused by Supabase. Copy the service_role key again (not the anon key).' }
    else checks.database = { ok: false, detail: `Database check failed: ${err.message}` }
  }

  return NextResponse.json({ ok: Object.values(checks).every((c) => c.ok), checks }, { headers: { 'Cache-Control': 'no-store' } })
}
