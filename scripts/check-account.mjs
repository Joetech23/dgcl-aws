/**
 * Checks the partner list, changing a password, and the admin's "Send
 * password reset" action, on the preview test server (no Supabase).
 *
 *   node scripts/check-account.mjs        (preview test server on :3016)
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:3016'
const SHOTS = 'shots/account'
await mkdir(SHOTS, { recursive: true })
let failed = 0
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  ${extra}` : ''}`)
  if (!ok) failed++
}

const browser = await chromium.launch({ channel: 'chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await ctx.route(/supabase\.co/, () => {
  console.error('ABORT: this test must not reach Supabase')
  process.exit(2)
})
const page = await ctx.newPage()
page.on('dialog', (d) => d.accept())

await page.goto(BASE + '/')
await page.evaluate(() => {
  for (const k of Object.keys(localStorage)) if (k.startsWith('dgcl-') && k !== 'dgcl-theme') localStorage.removeItem(k)
  localStorage.setItem('dgcl-tour-done', '1')
})

// Sign-up: no partner link, so "No partner" is chosen and the list is there.
await page.goto(BASE + '/signup/')
check('sign-up suggests the name John Smith', (await page.getByLabel('Your name').getAttribute('placeholder')) === 'John Smith')
const partner = page.locator('#signup-partner')
await partner.waitFor()
check('partner is a list, starting at "No partner"', (await partner.inputValue()) === '' && (await partner.locator('option').count()) >= 2)
check('no code box to type into', (await page.getByPlaceholder('e.g. TECHHUB10').count()) === 0)
await partner.selectOption({ label: 'TechHub Lagos (sample)' })
await page.screenshot({ path: `${SHOTS}/signup-partner-list.png`, fullPage: true })

// The admin signs up (preview admin address) and is credited to the partner.
await page.getByLabel('Your name').fill('John Smith')
await page.getByLabel('Email', { exact: true }).fill('admin@dgclgroup.com')
await page.getByLabel('Password', { exact: true }).fill('first-password-1')
await page.getByRole('button', { name: 'Create free account' }).click()
await page.waitForURL(/dashboard/)

// Change password.
await page.goto(BASE + '/account/')
await page.getByLabel('New password', { exact: true }).fill('second-password-2')
await page.getByLabel('Repeat new password').fill('something-else-3')
await page.getByRole('button', { name: 'Change password' }).click()
check('mismatched passwords are caught', await page.getByText('The two passwords do not match.').isVisible())
await page.getByLabel('Repeat new password').fill('second-password-2')
await page.getByRole('button', { name: 'Change password' }).click()
await page.getByText('Password changed').waitFor()
check('password can be changed', await page.getByText('Password changed').isVisible())
check('account page fits the phone', (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0)
await page.getByRole('heading', { name: 'Password' }).scrollIntoViewIfNeeded()
await page.screenshot({ path: `${SHOTS}/account-password.png` })

// Admin: send a learner a reset code.
await page.goto(BASE + '/admin/#learners')
const reset = page.getByRole('button', { name: 'Send password reset' }).first()
await reset.waitFor()
check('admin sees "Send password reset" for real learners', await reset.isVisible())
check('the partner chosen at sign-up is recorded', await page.getByText('TECHHUB10').first().isVisible())
await reset.click()
await page.getByText('Reset code sent').waitFor()
check('admin can send a reset code', await page.getByText('Reset code sent').isVisible())

// Enquiry form: the same list.
await page.goto(BASE + '/')
await page.locator('#plans').scrollIntoViewIfNeeded()
await page.getByRole('button', { name: 'Ask about live classes' }).click()
const ep = page.getByRole('dialog').locator('#enquiry-partner')
await ep.waitFor()
check('enquiry form has the partner list', (await ep.locator('option').count()) >= 2)
await page.getByRole('dialog').screenshot({ path: `${SHOTS}/enquiry-partner-list.png` })

await browser.close()
console.log(failed ? `\n${failed} failed` : '\nAll account checks passed')
process.exit(failed ? 1 : 0)
