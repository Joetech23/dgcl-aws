/**
 * Modules are separate, and Module 2 opens only once Module 1 is finished.
 *
 * Starts from a clean slate, confirms Module 2 is locked and refuses to open,
 * plays Module 1 to the end, then confirms Module 2 unlocks, opens with its own
 * contents and counter, and stays unlocked after a reload.
 *
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'

const URL = 'http://localhost:3014/player/'
const results = []
const check = (name, pass, detail = '') => {
  results.push(pass)
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

const slideCount = (page) =>
  page.getByRole('navigation', { name: 'Slides' }).getByRole('button').count()
// Tabs are numbered by programme position: 1 is the Introduction, 2 is Module 1, and so on.
const TAB_NAME = { 1: 'Introduction', 2: 'Module 1', 3: 'Module 2', 4: 'Module 3' }
const tab = (page, n) => page.getByRole('tab', { name: new RegExp(`^${TAB_NAME[n]}\\b`) })
const counter = (page) =>
  page.locator('span.tabular-nums').filter({ hasText: '/' }).first().innerText()

/** Play the current slide out: jump near the end and let it finish. */
async function finishSlide(page) {
  await page.waitForFunction(() => {
    const a = document.querySelector('audio')
    return a && a.duration > 0
  })
  await page.evaluate(async () => {
    const a = document.querySelector('audio')
    a.muted = true
    a.currentTime = Math.max(0, a.duration - 0.4)
    if (a.paused) await a.play().catch(() => {})
  })
  await page.waitForFunction(() => document.querySelector('audio')?.ended === true, null, {
    timeout: 8000,
  })
  await page.waitForTimeout(500)
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(1200)

  console.log('\nFresh start')
  check('five module tabs', (await page.getByRole('tablist', { name: 'Modules' }).getByRole('tab').count()) === 5)
  check('opens in the Introduction', (await tab(page, 1).getAttribute('aria-selected')) === 'true')
  check('the Introduction has its own contents', (await slideCount(page)) === 2, `${await slideCount(page)} slides`)
  check('Module 1 is locked', (await tab(page, 2).getAttribute('aria-disabled')) === 'true')
  check('Module 2 is locked', (await tab(page, 3).getAttribute('aria-disabled')) === 'true')
  check('Module 3 is locked', (await tab(page, 4).getAttribute('aria-disabled')) === 'true')

  // Playwright will not click an aria-disabled control; a real user can.
  await tab(page, 2).click({ force: true })
  await page.waitForTimeout(400)
  const notice = page.getByRole('status').filter({ hasText: 'unlock Module 1' })
  check('clicking a locked module explains why', await notice.isVisible())
  check('and does not open it', (await slideCount(page)) === 2)
  await page.screenshot({ path: 'shots/modules-locked.png' })

  console.log('\nFinish the Introduction')
  await finishSlide(page)
  check('Module 1 still locked after one slide', (await tab(page, 2).getAttribute('aria-disabled')) === 'true')
  await page.getByRole('button', { name: 'Next slide' }).click()
  await page.waitForTimeout(1200)
  await finishSlide(page)

  check('Module 1 unlocks', (await tab(page, 2).getAttribute('aria-disabled')) === 'false')
  check('Module 2 stays locked until Module 1 is done', (await tab(page, 3).getAttribute('aria-disabled')) === 'true')
  const startNext = page.getByRole('button', { name: /Start Module 1/ })
  check('offers to start Module 1', await startNext.isVisible())
  await page.screenshot({ path: 'shots/modules-unlocked.png' })

  await startNext.click()
  await page.waitForTimeout(1200)
  check('Module 1 opens', (await tab(page, 2).getAttribute('aria-selected')) === 'true')
  check('with its own contents', (await slideCount(page)) === 40, `${await slideCount(page)} slides`)
  check('and its own counter', (await counter(page)).replace(/\s/g, '') === '01/40', await counter(page))
  await page.screenshot({ path: 'shots/modules-module2.png' })

  console.log('\nAcross a reload')
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(1200)
  check('Module 1 stays unlocked', (await tab(page, 2).getAttribute('aria-disabled')) === 'false')
  check('the Introduction shows as complete', (await tab(page, 1).locator('svg.text-mint').count()) === 1)
  await tab(page, 1).click()
  await page.waitForTimeout(600)
  check('can go back to the Introduction', (await slideCount(page)) === 2)

  console.log('\nPhone')
  const phone = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await phone.goto(URL, { waitUntil: 'networkidle' })
  await phone.getByRole('button', { name: 'Start' }).click()
  await phone.waitForTimeout(1200)
  const box = await phone.getByRole('tablist', { name: 'Modules' }).boundingBox()
  check('module tabs visible on a phone', !!box && box.width > 0 && box.x + box.width <= 390, box ? `${Math.round(box.width)}px wide` : 'missing')
  await phone.screenshot({ path: 'shots/modules-phone.png' })

  await browser.close()
  const failed = results.filter((r) => !r).length
  console.log(`\n${results.length - failed}/${results.length} checks passed`)
  if (failed) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
