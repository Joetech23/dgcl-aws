/**
 * Loads the packaged SCO the way an LMS would — from a subdirectory, inside an
 * iframe, with a SCORM 1.2 API defined on the parent before the frame loads —
 * and checks that it renders, plays and reports.
 */
import { chromium } from 'playwright'

const URL = 'http://localhost:4180/lms.html'

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const failed = []
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`)
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  const frame = page.frameLocator('#frame')
  const rendered = await frame.getByRole('button', { name: 'Start the course' }).isVisible()
  console.log(`  ${rendered ? 'PASS' : 'FAIL'}  SCO renders from a subdirectory`)

  await frame.getByRole('button', { name: 'Start the course' }).click()
  await page.waitForTimeout(3000)

  const audioOk = await page.evaluate(() => {
    const f = document.getElementById('frame')
    const a = f.contentDocument.querySelector('audio')
    return a ? { src: a.currentSrc.split('/').pop(), t: a.currentTime, dur: a.duration || 0 } : null
  })
  console.log(
    `  ${audioOk && audioOk.dur > 1 ? 'PASS' : 'FAIL'}  narration loads and plays — ${JSON.stringify(audioOk)}`,
  )

  const data = await page.evaluate(() => window.__lmsData)
  console.log(
    `  ${data['cmi.core.lesson_status'] === 'incomplete' ? 'PASS' : 'FAIL'}  reports lesson_status — ${data['cmi.core.lesson_status']}`,
  )

  const broken = failed.filter((f) => !/favicon/.test(f))
  console.log(`  ${broken.length === 0 ? 'PASS' : 'FAIL'}  no missing assets${broken.length ? ` — ${broken.slice(0, 3).join(', ')}` : ''}`)

  await page.screenshot({ path: 'shots/scorm-in-lms.png' })
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
