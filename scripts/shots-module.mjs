/**
 * Screenshots every slide of one module.
 *
 *   node scripts/shots-module.mjs 3
 *
 * Later modules are locked until earlier ones are finished, so this marks
 * every slide of the earlier modules complete before opening the module. The
 * earlier modules' slide ids are read from public/audio, where each slide has
 * a timing file; module 3 slides are the i-prefixed ones.
 *
 * Needs the dev server on :3014. Writes shots/m<N>-<NN>-<slide id>.png
 */
import { chromium } from 'playwright'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const n = Number(process.argv[2] ?? '3')
/** Which timing files belong to the modules before module n. */
const EARLIER = { 1: null, 2: /^s00-/, 3: /^s\d\d-/, 4: /^[si]\d\d-/ }[n]

const audio = await readdir(path.join(ROOT, 'public', 'audio'))
const done = EARLIER
  ? audio.filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).filter((id) => EARLIER.test(id))
  : []

await mkdir(path.join(ROOT, 'shots'), { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:3014/player/', { waitUntil: 'networkidle' })
await page.evaluate(
  (completed) =>
    localStorage.setItem(
      'dgcl-aws-section-01',
      JSON.stringify({ completed, bookmark: null, score: null, track: null }),
    ),
  done,
)
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).click()
await page.waitForTimeout(1000)
await page.getByRole('tablist', { name: 'Modules' }).getByRole('tab').nth(n - 1).click()
await page.waitForTimeout(900)

const rail = page.getByRole('navigation', { name: 'Slides' }).getByRole('button')
const count = await rail.count()
console.log(`Module ${n}: ${count} slides (${done.length} earlier slides marked complete)`)

for (let i = 0; i < count; i++) {
  await rail.nth(i).click()
  await page.waitForTimeout(500)
  await page.waitForFunction(() => (document.querySelector('audio')?.duration ?? 0) > 0)
  // Near the end, so every reveal on the slide has happened. A gated slide
  // clamps at its gate and shows the activity instead, which is worth seeing.
  await page.evaluate(() => {
    const a = document.querySelector('audio')
    a.muted = true
    a.currentTime = a.duration * 0.985
  })
  await page.waitForTimeout(1300)
  const id = await page.evaluate(() => document.querySelector('audio')?.currentSrc.split('/').pop().replace('.mp3', ''))
  const file = `m${n}-${String(i + 1).padStart(2, '0')}-${id}.png`
  await page.screenshot({ path: path.join(ROOT, 'shots', file) })
  console.log('  ✓', file)
}

await browser.close()
if (errors.length) {
  console.log('\nRuntime errors:\n ', errors.join('\n  '))
  process.exit(1)
}
