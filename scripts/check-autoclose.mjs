/**
 * The activity closes itself after the learner answers.
 * Completes slide 2's tap activity, then confirms the dock is still visible
 * straight after (so the result can be read) and gone once the countdown ends.
 */
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
// Fresh progress, so slide 2 is not already marked complete from earlier runs.
await page.goto('http://localhost:3014', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).click()
await page.waitForTimeout(1000)
await page.evaluate(() => document.querySelectorAll('audio').forEach((a) => (a.muted = true)))
await page.getByRole('navigation', { name: 'Slides' }).getByRole('button').nth(1).click()
await page.waitForTimeout(600)
await page.evaluate(() => { const a = document.querySelector('audio'); if (a && a.duration) a.currentTime = a.duration - 0.05 })
await page.waitForTimeout(1500)

const dock = page.locator('section[aria-label="Your turn"]')
const openBefore = await dock.isVisible()
for (const name of ['Flexibility', 'Scale', 'Cost']) {
  await dock.getByRole('button', { name: new RegExp(name) }).first().click()
  await page.waitForTimeout(250)
}
await page.waitForTimeout(800)
const completeLabel = await dock.getByText('Complete', { exact: true }).isVisible().catch(() => false)
const stillOpenAt1s = await dock.isVisible()
await page.screenshot({ path: 'shots/v2-desk-02-complete.png' })
await page.waitForTimeout(6500)
const openAfter = await dock.isVisible()
const pill = await page.getByRole('button', { name: 'Review activity' }).isVisible()

const rows = [
  ['activity was open at the gate', openBefore],
  ['header flips to Complete when answered', completeLabel],
  ['result stays readable right after answering', stillOpenAt1s],
  ['activity closes itself after the countdown', !openAfter],
  ['can be reviewed again from the pill', pill],
]
for (const [n, ok] of rows) console.log(`${ok ? '  PASS' : '  FAIL'}  ${n}`)
await browser.close()
process.exit(rows.every((r) => r[1]) ? 0 : 1)
