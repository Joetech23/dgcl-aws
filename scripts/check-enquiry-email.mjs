/**
 * Checks the enquiry email route without sending anything.
 *
 *   node scripts/check-enquiry-email.mjs            (server on :3016, no RESEND_API_KEY)
 *
 * With no key the route validates and answers, but never calls Resend.
 */
const BASE = process.env.BASE || 'http://localhost:3016'
let failed = 0
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  ${extra}` : ''}`)
  if (!ok) failed++
}

const post = (body, headers = {}) =>
  fetch(`${BASE}/api/enquiry/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

const good = { name: 'Ada Obi', email: 'ada@example.com', phone: '+44 7700 900000', country: 'Nigeria', track: 'self-paced', course: 'AWS Cloud Training' }

let r = await post(good, { 'x-forwarded-for': '10.0.0.1' })
let j = await r.json()
check('valid enquiry is accepted', r.status === 200 && j.ok === true, JSON.stringify(j))
check('nothing is sent without a key', j.sent === false)

r = await post({ ...good, email: 'not-an-email' }, { 'x-forwarded-for': '10.0.0.2' })
check('bad email is rejected', r.status === 400)

r = await post({ ...good, name: '' }, { 'x-forwarded-for': '10.0.0.3' })
check('missing name is rejected', r.status === 400)

r = await post('{not json', { 'x-forwarded-for': '10.0.0.4' })
check('broken body is rejected', r.status === 400)

r = await post(good, { 'x-forwarded-for': '10.0.0.5', origin: 'https://evil.example' })
check('another site cannot call it', r.status === 403)

let last = 0
for (let i = 0; i < 6; i++) last = (await post(good, { 'x-forwarded-for': '10.0.0.9' })).status
check('repeat calls are slowed down', last === 429, `status ${last}`)

console.log(failed ? `\n${failed} failed` : '\nAll enquiry email checks passed')
process.exit(failed ? 1 : 0)
