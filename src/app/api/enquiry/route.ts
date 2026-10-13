import { NextResponse, type NextRequest } from 'next/server'
import { enquiryReceipt, salesAlert, type EnquiryEmailInput } from '@/lib/email/enquiry'
import { salesInbox, sendEmail } from '@/lib/server/email'
import { siteOrigin } from '@/lib/server/supabase'

/**
 * Sends the two enquiry emails through Resend: an alert to DGCL's sales
 * inbox and a confirmation to the enquirer.
 *
 * The enquiry itself is saved to Supabase by the browser; this route only
 * sends email, so a failure here never loses a lead.
 *
 * Server environment (cPanel > Setup Node.js App > Environment variables):
 *   RESEND_API_KEY   required; without it this route quietly does nothing
 *   EMAIL_FROM       optional; default below
 *   SALES_EMAIL      optional; where alerts go, default info@dgclgroup.com
 *
 * The key is read at request time and never sent to the browser.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// A small brake on abuse: this route emails whatever address it is given, so
// each visitor may trigger it only a few times in a short window.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 4
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)

export async function POST(req: NextRequest) {
  // Only the site's own form may call this, not another website's script.
  const origin = req.headers.get('origin')
  const self = req.headers.get('x-forwarded-host') || req.headers.get('host')
  if (origin && self && new URL(origin).host !== self) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })

  const e: EnquiryEmailInput = {
    name: clean(body.name, 120),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 40),
    country: clean(body.country, 80),
    track: clean(body.track, 40),
    course: clean(body.course, 160),
    message: String(body.message ?? '').trim().slice(0, 1500) || null,
    referralCode: clean(body.referralCode, 24) || null,
    awaitingPayment: body.awaitingPayment === true,
  }
  if (!e.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email) || !e.course) {
    return NextResponse.json({ ok: false, error: 'Missing details' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })

  if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: true, sent: false })

  const sales = salesInbox()
  // Links and the logo point at the public address, not the internal one the server hears on.
  const siteUrl = process.env.SITE_URL || siteOrigin(req)

  const alert = salesAlert(e, siteUrl)
  const receipt = enquiryReceipt(e, siteUrl)
  const [toSales, toLearner] = await Promise.all([
    sendEmail({ to: sales, replyTo: e.email, ...alert }),
    // With a consultation fee still to pay, the learner hears from us once it is paid.
    e.awaitingPayment ? Promise.resolve(true) : sendEmail({ to: e.email, replyTo: sales, ...receipt }),
  ])
  return NextResponse.json({ ok: true, sent: toSales && toLearner })
}
