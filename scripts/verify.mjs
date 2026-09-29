/**
 * Behavioural checks for the things this course claims to do.
 *
 * These are the claims the pitch rests on, so they get tested rather than
 * eyeballed: the gate really holds, scrubbing backwards really un-reveals,
 * activity state really does not leak between slides, and the drag-and-drop
 * really is completable without a mouse.
 *
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'

const URL = 'http://localhost:3014/player/'
const results = []

function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const clock = (page) =>
  page.evaluate(() => {
    const a = document.querySelector('audio')
    return a ? { t: a.currentTime, dur: a.duration || 0, paused: a.paused } : null
  })

async function gotoSlide(page, n) {
  await page.getByRole('navigation', { name: 'Slides' }).getByRole('button').nth(n - 1).click()
  await page.waitForTimeout(650)
}

async function seekTo(page, seconds) {
  await page.evaluate((s) => {
    const a = document.querySelector('audio')
    if (a) a.currentTime = s
  }, seconds)
  await page.waitForTimeout(750)
}

/** Drive the timeline to the end; a gate clamps it on its own. */
async function runToGate(page) {
  const { dur } = await clock(page)
  await seekTo(page, dur - 0.05)
  await page.waitForTimeout(900)
  return clock(page)
}

async function status(page) {
  return (
    await page.locator('section[aria-label="Activity"] [role="status"]').innerText()
  ).trim()
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start the course' }).click()
  await page.waitForTimeout(1000)
  await page.evaluate(() => document.querySelectorAll('audio').forEach((a) => (a.muted = true)))

  // Slide 2's gate sits on the second of five lines, so there is a lot of
  // narration after it. Slide 3's gate is its final line, where clamping at the
  // very end is correct behaviour and would prove nothing.
  console.log('\nGate holds mid-slide (slide 2)')
  await gotoSlide(page, 2)
  const gated = await runToGate(page)
  check(
    'playback stops at the gate',
    gated.t < gated.dur - 1,
    `held at ${gated.t.toFixed(1)}s of ${gated.dur.toFixed(1)}s`,
  )
  check('activity is shown', await page.locator('section[aria-label="Activity"]').isVisible())
  check(
    'transport is locked while gated',
    await page.locator('button[aria-label="Play"], button[aria-label="Pause"]').isDisabled(),
  )
  await seekTo(page, gated.dur - 0.05)
  const again = await clock(page)
  check('scrubber cannot skip the gate', again.t < gated.dur - 1)
  check(
    'the answer is withheld until the learner commits',
    (await page.locator('text=Your software').count()) === 0,
  )

  console.log('\nNarration resumes once the activity is done')
  await page.getByRole('button', { name: /Onto a hard drive/ }).click()
  await page.waitForTimeout(2200)
  const resumed = await clock(page)
  check(
    'narration continues past the gate',
    resumed.t > gated.t + 0.3,
    `${gated.t.toFixed(1)}s → ${resumed.t.toFixed(1)}s`,
  )

  console.log('\nDrag and drop, keyboard only (slide 3)')
  await gotoSlide(page, 3)
  await runToGate(page)
  const chip = page.getByRole('button', { name: /Defence contractor/ })
  await chip.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  check(
    'chip selects with Enter',
    (await chip.getAttribute('aria-pressed')) === 'true',
  )
  await page.getByRole('button', { name: /^Private/ }).first().focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(450)
  check(
    'chip drops into the bucket with Enter',
    (await page.getByRole('button', { name: /Defence contractor/ }).count()) > 0,
  )

  console.log('\nSort completes')
  // Same select-then-place path as above, one pair at a time so each placement
  // is actually observed rather than fired blind.
  const pairs = [
    [/Two-person startup/, /^Public/],
    [/High-street bank/, /^Hybrid/],
    [/Streaming service/, /^Multi/],
  ]
  for (const [chipRe, bucketRe] of pairs) {
    await page.getByRole('button', { name: chipRe }).first().click()
    await page.waitForTimeout(200)
    await page.getByRole('button', { name: bucketRe }).first().click()
    await page.waitForTimeout(350)
  }
  await page.getByRole('button', { name: /Check answers/ }).click()
  await page.waitForTimeout(1600)
  // Finishing the activity dismisses it and marks the slide complete — slide 3's
  // gate is its last line, so there is no narration left to resume into.
  check(
    'activity closes when finished',
    (await page.locator('section[aria-label="Activity"]').count()) === 0,
  )
  check(
    'slide is ticked complete in the contents',
    (await page.locator('nav[aria-label="Slides"] svg[aria-label="Completed"]').count()) > 0,
  )

  console.log('\nScrubbing backwards un-reveals (slide 4)')
  await gotoSlide(page, 4)
  const { dur: d4 } = await clock(page)
  await seekTo(page, d4 * 0.5)
  const mid = await page.locator('text=Virtualisation').count()
  await seekTo(page, 0.2)
  const start = await page.locator('text=Virtualisation').count()
  check(
    'a later reveal hides again when you scrub back',
    mid > 0 && start === 0,
    `mid=${mid}, start=${start}`,
  )

  console.log('\nActivity state does not leak between slides (the v1 bug)')
  await gotoSlide(page, 3)
  await runToGate(page)
  await gotoSlide(page, 4)
  await runToGate(page)
  const s4 = await status(page)
  check('no negative counter after switching slides', !s4.includes('-'), s4)
  check('activity does not arrive already complete', !/Done/.test(s4), s4)

  console.log('\nConsole')
  check('no runtime errors', errors.length === 0, errors.slice(0, 2).join(' | '))

  await browser.close()

  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
