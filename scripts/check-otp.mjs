/**
 * The one-time-code screens, on the preview backend (port 3016, no Supabase):
 * log in with a code, reset a password with a code, paste a whole code.
 */
import { chromium } from 'playwright'
const BASE = process.env.BASE ?? 'http://localhost:3016'
const results = []
const check = (n, p, d = '') => { results.push(p); console.log(`${p ? '  PASS' : '  FAIL'}  ${n}${d ? `  (${d})` : ''}`) }
const browser = await chromium.launch({ channel: 'chrome' })
for (const [label, w, h] of [['desktop', 1280, 860], ['phone', 390, 844]]) {
  console.log(`\n${label}`)
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  await ctx.route(/supabase\.co/, (r) => { console.error('ABORT: reached Supabase'); r.abort(); process.exit(2) })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Email me a code instead' }).click()
  await page.getByLabel('Email').fill(`otp.${label}@example.com`)
  await page.getByRole('button', { name: 'Send me a code' }).click()
  await page.getByRole('group', { name: '6-digit code' }).waitFor()
  check('code screen appears', await page.getByText('Check your email').isVisible())
  check('resend waits 60 seconds', await page.getByRole('button', { name: /send a new code in \d+s/ }).isVisible())
  await page.screenshot({ path: `shots/lms/otp-${label}.png` })
  // Typing one digit at a time moves along the boxes and submits on the sixth.
  await page.getByLabel('Digit 1').click()
  await page.keyboard.type('482913')
  await page.waitForURL(/\/dashboard\//, { timeout: 8000 }).catch(() => {})
  check('typing the code logs in', page.url().includes('/dashboard/'))

  // Reset password, pasting the whole code at once.
  await ctx.clearCookies()
  await page.evaluate(() => localStorage.clear())
  await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await page.getByLabel('Email').fill(`reset.${label}@example.com`)
  await page.getByRole('button', { name: 'Send me a code' }).click()
  await page.getByRole('group', { name: '6-digit code' }).waitFor()
  await page.getByLabel('Digit 1').fill('736205')
  const filled = await page.evaluate(() => [...document.querySelectorAll('[aria-label^="Digit"]')].map((i) => i.value).join(''))
  check('pasting fills every box', filled === '736205', filled)
  await page.getByLabel('New password').fill('newpassword1')
  await page.getByRole('button', { name: 'Save new password' }).click()
  await page.waitForURL(/\/dashboard\//, { timeout: 8000 }).catch(() => {})
  check('reset with a code signs in', page.url().includes('/dashboard/'))
  await ctx.close()
}
await browser.close()
const failed = results.filter((r) => !r).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
