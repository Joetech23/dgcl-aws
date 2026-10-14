import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * A small Stripe client: only the three things this site does (create a
 * Checkout Session, read one back, check a webhook's signature). Plain HTTPS
 * calls, so there is no extra package to keep on the server.
 *
 * Server only. The secret key is read from the environment at request time
 * and is never sent to the browser:
 *   STRIPE_SECRET_KEY       sk_test_... or sk_live_...
 *   STRIPE_WEBHOOK_SECRET   whsec_... (from the webhook endpoint in Stripe)
 */

const API = 'https://api.stripe.com/v1'

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY?.trim())

export type CheckoutSession = {
  id: string
  url: string | null
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  status: 'open' | 'complete' | 'expired' | null
  amount_total: number | null
  currency: string | null
  payment_intent: string | null
  customer_details?: { email?: string | null } | null
  metadata: Record<string, string> | null
}

/** Stripe takes form fields with bracketed names: line_items[0][quantity]=1. */
export function encodeForm(input: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = []
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue
    const name = prefix ? `${prefix}[${key}]` : key
    if (Array.isArray(value)) value.forEach((v, i) => out.push(...encodeForm({ [i]: v }, name)))
    else if (typeof value === 'object') out.push(...encodeForm(value as Record<string, unknown>, name))
    else out.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`)
  }
  return out
}

async function call<T>(method: 'GET' | 'POST', path: string, body?: Record<string, unknown>): Promise<T> {
  // Trimmed: a space or line break pasted with the key makes every call fail.
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) throw new Error('Stripe is not configured')
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) },
    body: body ? encodeForm(body).join('&') : undefined,
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
  if (!res.ok) throw new Error(json.error?.message || `Stripe answered ${res.status}`)
  return json as T
}

export function createCheckout(input: {
  name: string
  description?: string
  usd: number
  email?: string | null
  reference?: string
  metadata: Record<string, string>
  successUrl: string
  cancelUrl: string
}) {
  return call<CheckoutSession>('POST', '/checkout/sessions', {
    mode: 'payment',
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.reference,
    customer_email: input.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(input.usd * 100),
          product_data: { name: input.name, description: input.description },
        },
      },
    ],
    metadata: input.metadata,
    // The same labels on the payment itself, so it can be traced in Stripe.
    payment_intent_data: { metadata: input.metadata },
  })
}

export const getCheckout = (id: string) => call<CheckoutSession>('GET', `/checkout/sessions/${encodeURIComponent(id)}`)

/**
 * Checks that a webhook really came from Stripe: the header carries a
 * timestamp and an HMAC of "timestamp.body" made with the endpoint's secret.
 * Old messages are refused so a captured one cannot be replayed.
 */
export function verifyWebhook(rawBody: string, header: string | null, secret: string, toleranceSeconds = 300, now = Date.now()): boolean {
  if (!header || !secret) return false
  const parts = header.split(',').map((p) => p.trim().split('='))
  const t = parts.find(([k]) => k === 't')?.[1]
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!t || !sigs.length || !/^\d+$/.test(t)) return false
  if (Math.abs(now / 1000 - Number(t)) > toleranceSeconds) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest('hex'), 'utf8')
  return sigs.some((s) => {
    const given = Buffer.from(s ?? '', 'utf8')
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}
