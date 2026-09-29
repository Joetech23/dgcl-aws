/**
 * Checks the player behaves like video, then captures proof.
 *
 * The claim under test: a phone shows exactly the slide a desktop shows, only
 * smaller. So rather than eyeballing, this measures where the slide title sits
 * as a fraction of the slide on both viewports and fails if they differ. It
 * also checks the stage is a true 16:9 on both, the phone view has no
 * persistent rail, and the activity dock can be closed and reopened.
 *
 * Needs the dev server on :3014. Screenshots land in shots/.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = 'http://localhost:3014/player/'
const results = []
const check = (name, pass, detail = '') => {
  results.push(pass)
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

/** Slide title box as fractions of the visible slide, plus the slide's aspect. */
const measure = (page) =>
  page.evaluate(() => {
    const canvas = document.querySelector('.slide-canvas')
    const frame = canvas?.parentElement
    const h1 = canvas?.querySelector('h1')
    if (!frame || !h1) return null
    const f = frame.getBoundingClientRect()
    const t = h1.getBoundingClientRect()
    return {
      aspect: f.width / f.height,
      left: (t.left - f.left) / f.width,
      top: (t.top - f.top) / f.height,
      width: t.width / f.width,
      height: t.height / f.height,
      frameW: Math.round(f.width),
    }
  })

async function openCourse(page) {
  await page.goto(URL, { waitUntil: 'networkidle' })
  // These checks exercise Module 2, which only opens once Module 1 is done.
  await page.evaluate(() =>
    localStorage.setItem(
      'dgcl-aws-section-01',
      JSON.stringify({ completed: ['s00-programme', 's00-contents'], bookmark: 's01-title', score: null, track: null }),
    ),
  )
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(1200)
  await page.evaluate(() => document.querySelectorAll('audio').forEach((a) => (a.muted = true)))
}

async function seekFrac(page, frac) {
  await page.evaluate((f) => {
    const a = document.querySelector('audio')
    if (a && a.duration) a.currentTime = a.duration * f
  }, frac)
  await page.waitForTimeout(1300)
}

async function main() {
  await mkdir('shots', { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome' })

  /* ---------------- desktop ---------------- */
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 })
  await openCourse(desk)
  const gotoDesk = async (n) => {
    await desk.getByRole('navigation', { name: 'Slides' }).getByRole('button').nth(n - 1).click()
    await desk.waitForTimeout(600)
  }

  console.log('\nDesktop')
  await gotoDesk(2)
  await seekFrac(desk, 0.88)
  const d2 = await measure(desk)
  check('stage is 16:9', Math.abs(d2.aspect - 16 / 9) < 0.02, d2.aspect.toFixed(3))
  await desk.screenshot({ path: 'shots/v2-desk-02.png' })

  await gotoDesk(3)
  await seekFrac(desk, 0.999)
  const dock = desk.locator('section[aria-label="Your turn"]')
  check('activity docks below the video', await dock.isVisible())
  if (await dock.isVisible()) {
    const stageBox = await desk.locator('.slide-canvas').evaluate((el) => el.parentElement.getBoundingClientRect().bottom)
    const dockTop = (await dock.boundingBox()).y
    check('activity sits under the stage, not over it', dockTop >= stageBox - 1, `stage bottom ${Math.round(stageBox)}, dock top ${Math.round(dockTop)}`)
  }
  await desk.screenshot({ path: 'shots/v2-desk-03-gate.png' })
  await dock.getByRole('button', { name: 'Close activity' }).click()
  await desk.waitForTimeout(500)
  check('X closes the activity', !(await dock.isVisible()))
  const pill = desk.getByRole('button', { name: /Your turn|Review activity/ })
  check('a closed activity can be reopened', await pill.isVisible())
  await desk.screenshot({ path: 'shots/v2-desk-03-closed.png' })
  await pill.click()
  await desk.waitForTimeout(500)
  check('reopen brings the activity back', await dock.isVisible())

  await gotoDesk(4)
  await seekFrac(desk, 0.88)
  const d4 = await measure(desk)
  await desk.screenshot({ path: 'shots/v2-desk-04.png' })

  /* ---------------- phone ---------------- */
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await openCourse(phone)
  const gotoPhone = async (n) => {
    await phone.getByRole('button', { name: 'Contents' }).click()
    await phone.waitForTimeout(450)
    await phone.getByRole('navigation', { name: 'Slides' }).getByRole('button').nth(n - 1).click()
    await phone.waitForTimeout(700)
  }

  console.log('\nPhone')
  check('no persistent rail under the video', (await phone.getByRole('navigation', { name: 'Slides' }).count()) === 0)
  check('footer hidden on phone', !(await phone.locator('footer').isVisible()))

  await gotoPhone(2)
  check('drawer closes after choosing a slide', (await phone.getByRole('navigation', { name: 'Slides' }).count()) === 0)
  await seekFrac(phone, 0.88)
  const p2 = await measure(phone)
  check('stage is 16:9', Math.abs(p2.aspect - 16 / 9) < 0.02, p2.aspect.toFixed(3))
  await phone.screenshot({ path: 'shots/v2-phone-02.png' })

  await gotoPhone(4)
  await seekFrac(phone, 0.88)
  const p4 = await measure(phone)
  await phone.screenshot({ path: 'shots/v2-phone-04.png' })

  console.log('\nSame slide on both (title position as a fraction of the slide)')
  for (const [label, a, b] of [['slide 2', d2, p2], ['slide 4', d4, p4]]) {
    const diff = Math.max(
      Math.abs(a.left - b.left),
      Math.abs(a.top - b.top),
      Math.abs(a.width - b.width),
      Math.abs(a.height - b.height),
    )
    check(`${label} layout identical`, diff < 0.01, `max diff ${(diff * 100).toFixed(2)}% (desk ${a.frameW}px, phone ${b.frameW}px)`)
  }

  await gotoPhone(3)
  await seekFrac(phone, 0.999)
  check('phone activity docks below the video', await phone.locator('section[aria-label="Your turn"]').isVisible())
  await phone.screenshot({ path: 'shots/v2-phone-03-gate.png' })

  await phone.getByRole('button', { name: 'Contents' }).click()
  await phone.waitForTimeout(500)
  await phone.screenshot({ path: 'shots/v2-phone-drawer.png' })

  await browser.close()
  const failed = results.filter((r) => !r).length
  console.log(`\n${results.length - failed}/${results.length} checks passed`)
  if (failed) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
