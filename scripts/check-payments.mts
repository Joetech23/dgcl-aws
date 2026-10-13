/**
 * Checks the payment code that can be checked without Stripe or a database:
 * prices, the webhook signature check, and the form encoding Stripe expects.
 *
 *   npx tsx scripts/check-payments.mts
 *
 * With BASE set to a running production build that has Supabase keys but no
 * Stripe keys, it also checks the server refuses what it should:
 *
 *   BASE=http://localhost:4190 npx tsx scripts/check-payments.mts
 */
import { createHmac } from 'node:crypto'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { CONSULTATION_FEE_USD, PAID_MODULES, paidModuleForAudio } from '../src/config/pricing'
import { encodeForm, verifyWebhook } from '../src/lib/server/stripe'

let failed = 0
const check = (name: string, ok: boolean, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  ${extra}` : ''}`)
  if (!ok) failed++
}

// ---------- prices ----------
check('Modules 3 and 4 are $20 each', PAID_MODULES['m03-ec2']?.usd === 20 && PAID_MODULES['m04-s3']?.usd === 20 && Object.keys(PAID_MODULES).length === 2)
check('the consultation fee is $25', CONSULTATION_FEE_USD === 25)

// ---------- which narration is paid ----------
const audio = await readdir(path.resolve(import.meta.dirname, '..', 'public', 'audio'))
const paid = audio.filter((f) => paidModuleForAudio(f))
const free = audio.filter((f) => !paidModuleForAudio(f))
check('EC2 and S3 narration is treated as paid', paid.length > 0 && paid.every((f) => /^[eb]\d\d-/.test(f)), `${paid.length} files`)
check('Introduction, Module 1 and Module 2 narration stays free', free.length > 0 && free.every((f) => /^[si]\d\d-/.test(f)), `${free.length} files`)
check('an EC2 file maps to Module 3, an S3 file to Module 4', paidModuleForAudio('e01-title.mp3') === 'm03-ec2' && paidModuleForAudio('b01-title.json') === 'm04-s3')

// ---------- what Stripe is sent ----------
const form = encodeForm({
  mode: 'payment',
  line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: 2000, product_data: { name: 'Module 3: EC2 & more' } } }],
  metadata: { kind: 'module', user_id: 'abc' },
  customer_email: undefined,
}).map(decodeURIComponent)
check(
  'checkout fields are encoded the way Stripe expects',
  form.includes('mode=payment') &&
    form.includes('line_items[0][quantity]=1') &&
    form.includes('line_items[0][price_data][unit_amount]=2000') &&
    form.includes('line_items[0][price_data][product_data][name]=Module 3: EC2 & more') &&
    form.includes('metadata[user_id]=abc') &&
    !form.some((f) => f.startsWith('customer_email')),
)
check('special characters are escaped', encodeForm({ a: 'x&y=z' })[0] === 'a=x%26y%3Dz')

// ---------- webhook signatures ----------
const secret = 'whsec_test_secret'
const body = JSON.stringify({ type: 'checkout.session.completed', data: { object: { id: 'cs_test_123' } } })
const now = 1_800_000_000_000
const t = Math.floor(now / 1000)
const sign = (payload: string, key = secret, at = t) => `t=${at},v1=${createHmac('sha256', key).update(`${at}.${payload}`).digest('hex')}`

check('a correctly signed webhook is accepted', verifyWebhook(body, sign(body), secret, 300, now))
check('a changed body is refused', !verifyWebhook(body.replace('cs_test_123', 'cs_test_999'), sign(body), secret, 300, now))
check('a signature made with another secret is refused', !verifyWebhook(body, sign(body, 'whsec_other'), secret, 300, now))
check('an old message is refused (no replays)', !verifyWebhook(body, sign(body, secret, t - 3600), secret, 300, now))
check('a missing or malformed header is refused', !verifyWebhook(body, null, secret, 300, now) && !verifyWebhook(body, 'v1=abc', secret, 300, now) && !verifyWebhook(body, 't=abc,v1=', secret, 300, now))
check('an empty secret never passes', !verifyWebhook(body, sign(body, ''), '', 300, now))
check('one valid signature among several is enough', verifyWebhook(body, `${sign(body)},v1=${'0'.repeat(64)}`, secret, 300, now))

// ---------- a running production build ----------
const BASE = process.env.BASE
if (BASE) {
  const status = async (p: string, init?: RequestInit) => (await fetch(BASE + p, { redirect: 'manual', ...init })).status
  const json = { 'Content-Type': 'application/json' }
  const paidFile = paid.find((f) => f.endsWith('.mp3'))!
  const freeFile = free.find((f) => f.endsWith('.mp3'))!

  check('free narration is a public file', (await status(`/audio/${freeFile}`)) === 200)
  check('paid narration is NOT a public file', (await status(`/audio/${paidFile}`)) === 404, paidFile)
  check('paid narration timings are NOT a public file', (await status(`/audio/${paidFile.replace('.mp3', '.json')}`)) === 404)
  check('paid narration needs a signed-in learner', (await status(`/media/audio/${paidFile}`)) === 401)
  check('a made-up token is refused', (await status(`/media/audio/${paidFile}`, { headers: { Authorization: 'Bearer not-a-real-token' } })) === 401)
  check('free narration is not served through the paid route', (await status(`/media/audio/${freeFile}`)) === 404)
  check('odd file names are refused', (await status('/media/audio/..%2F..%2Fpackage.json')) === 404 && (await status('/media/audio/e01-title.mp3%00.json')) === 404)
  check('the all-modules demo player is not on the live site', (await status('/player/')) === 404)
  check('the slide inspection page is not on the live site', (await status('/dev/slides/')) === 404)
  check('the image resizing endpoint is off', (await status('/_next/image/?url=%2Fbrand%2Fdgcl-logo.png&w=64&q=75')) !== 200 && (await status('/_next/image?url=%2Fbrand%2Fdgcl-logo.png&w=64&q=75')) !== 200)

  check('checkout refuses to start without payment keys', (await status('/api/checkout/', { method: 'POST', headers: json, body: JSON.stringify({ kind: 'module', slug: 'm03-ec2' }) })) === 503)
  check('checkout refuses a call from another website', (await status('/api/checkout/', { method: 'POST', headers: { ...json, Origin: 'https://evil.example' }, body: '{}' })) === 403)
  check('confirm refuses a made-up payment id', (await status('/api/checkout/confirm/', { method: 'POST', headers: json, body: JSON.stringify({ sessionId: 'abc' }) })) === 400)
  check('the webhook is closed without its secret', (await status('/api/stripe/webhook/', { method: 'POST', body })) === 503)

  const res = await fetch(BASE + '/')
  const h = (n: string) => res.headers.get(n)
  check(
    'security headers are sent',
    h('x-content-type-options') === 'nosniff' && h('x-frame-options') === 'SAMEORIGIN' && h('referrer-policy') === 'strict-origin-when-cross-origin' && (h('strict-transport-security') ?? '').includes('max-age=') && !h('x-powered-by'),
    `frame=${h('x-frame-options')} powered=${h('x-powered-by')}`,
  )
  const html = await res.text()
  check('the home page says Learn Tech Hub', html.includes('<title>Learn Tech Hub'))
  check('the paid lesson page itself still loads (the lock is inside it)', (await status('/learn/m03-ec2/')) === 200)
}

console.log(failed ? `\n${failed} failed` : '\nAll payment checks passed')
process.exit(failed ? 1 : 0)
