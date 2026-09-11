/**
 * Captures the course at real desktop and mobile sizes.
 *
 * The in-app browser pane is too small to judge layout. Playwright drives the
 * installed Chrome at 1440x900, seeks each slide to a chosen moment, and writes
 * PNGs to shots/. Muted so tests are silent.
 *
 *   node scripts/shots.mjs                # all slides (poster + 10 + gates)
 *   node scripts/shots.mjs 3              # just slide 3
 *   node scripts/shots.mjs --mobile       # 390x844
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'shots')
const URL = 'http://localhost:3014'

const mobile = process.argv.includes('--mobile')
const only = process.argv.find((a) => /^\d+$/.test(a))

const NAMES = [
  '01-title',
  '02-what-aws-is',
  '03-key-features',
  '04-service-families',
  '05-use-cases',
  '06-audience',
  '07-cert-ladder',
  '08-what-is-cloud',
  '09-deployment',
  '10-responsibilities',
  '11-csp',
  '12-iceberg',
  '13-service-models',
  '14-six-advantages',
  '15-global-infra',
  '16-regions-azs',
  '17-edge-locations',
  '18-aws-accounts',
  '19-account-features',
  '20-root-iam',
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  })

  page.on('console', (m) => {
    if (m.type() === 'error') console.log('  err:', m.text().slice(0, 140))
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  if (!only) {
    await page.screenshot({ path: path.join(OUT, `00-poster${mobile ? '-m' : ''}.png`) })
    console.log('✓ 00-poster')
  }

  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(1400)
  await page.evaluate(() => document.querySelectorAll('audio').forEach((a) => (a.muted = true)))

  for (let i = 0; i < NAMES.length; i++) {
    const n = i + 1
    if (only && Number(only) !== n) continue

    await page
      .getByRole('navigation', { name: 'Slides' })
      .getByRole('button')
      .nth(i)
      .click()
    await page.waitForTimeout(600)

    // Seek to 88% of the narration so most reveals are visible without hitting
    // the very end (where a final line might not yet have fired).
    await page.evaluate(() => {
      const a = document.querySelector('audio')
      if (a && a.duration) a.currentTime = a.duration * 0.88
    })
    await page.waitForTimeout(1200)

    const file = path.join(OUT, `${NAMES[i]}${mobile ? '-m' : ''}.png`)
    await page.screenshot({ path: file })
    console.log('✓', NAMES[i])
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
