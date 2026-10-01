/**
 * Every Module 4 (S3) activity opens at its gate and holds the narration.
 *
 * Marks the Introduction and Modules 1 to 3 complete, opens Module 4 (S3), and for each slide with an
 * activity plays to the end, checking that playback stopped at the gate and
 * the activity is on screen. Completes the storage-type sort on slide 2 to prove a Module 4
 * activity can be finished, not just opened.
 *
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const done = (await readdir(path.join(ROOT, 'public', 'audio')))
  .filter((f) => /^[sie]\d\d-.*\.json$/.test(f))
  .map((f) => f.slice(0, -5))

const results = []
const check = (name, pass, detail = '') => {
  results.push(pass)
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3014/player/', { waitUntil: 'networkidle' })
await page.evaluate(
  (completed) =>
    localStorage.setItem('dgcl-aws-section-01', JSON.stringify({ completed, bookmark: null, score: null, track: null })),
  done,
)
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).click()
await page.waitForTimeout(1000)
await page.getByRole('tablist', { name: 'Modules' }).getByRole('tab').nth(4).click()
await page.waitForTimeout(900)

const rail = page.getByRole('navigation', { name: 'Slides' }).getByRole('button')
const dock = page.locator('section[aria-label="Your turn"]')

for (const [n, label] of [[2, 'storage types sort'], [9, 'storage classes'], [13, 'IAM or bucket policy'], [17, 'replication'], [20, 'encryption'], [30, 'static website']]) {
  await rail.nth(n - 1).click()
  await page.waitForTimeout(500)
  await page.waitForFunction(() => (document.querySelector('audio')?.duration ?? 0) > 0)
  await page.evaluate(() => {
    const a = document.querySelector('audio')
    a.muted = true
    a.currentTime = a.duration - 0.05
  })
  await page.waitForTimeout(1500)
  const clock = await page.evaluate(() => {
    const a = document.querySelector('audio')
    return { t: a.currentTime, d: a.duration, paused: a.paused }
  })
  check(`slide ${n} (${label}): activity opens at the gate`, await dock.isVisible())
  check(`slide ${n}: narration held`, clock.paused, `${clock.t.toFixed(1)}s of ${clock.d.toFixed(1)}s`)
  if (n === 2) {
    await page.screenshot({ path: 'shots/s3-gate-sort.png' })
    const pairs = [
      [/Product photos/, /^Object \(S3\)/],
      [/busy database/, /^Block \(EBS\)/],
      [/shared folder/, /^File \(EFS\)/],
      [/Nightly backups/, /^Object \(S3\)/],
    ]
    for (const [chip, bucket] of pairs) {
      await dock.getByRole('button', { name: chip }).first().click()
      await page.waitForTimeout(200)
      await dock.getByRole('button', { name: bucket }).first().click()
      await page.waitForTimeout(300)
    }
    await dock.getByRole('button', { name: /Check answers/ }).click()
    await page.waitForTimeout(900)
    check('slide 2: sort completes', await dock.getByText('Complete', { exact: true }).isVisible())
    await page.screenshot({ path: 'shots/s3-gate-sort-done.png' })
  }
}

await browser.close()
const failed = results.filter((r) => !r).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
