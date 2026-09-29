/**
 * Full-page screenshots of the site at phone and desktop widths.
 *
 *   node scripts/shots-site.mjs [path ...]     default: /
 *
 * Also reports horizontal overflow, the most common phone layout bug.
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

// Git Bash rewrites a leading slash into a Windows path, so paths are given without one.
const paths = (process.argv.slice(2).length ? process.argv.slice(2) : ['']).map((p) => '/' + p.replace(/^\/+/, ''))
const sizes = [
  ['phone', 390, 844],
  ['desktop', 1440, 900],
]

await mkdir('shots/site', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
for (const [label, w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: label === 'phone' ? 2 : 1 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log(`  page error (${label}): ${e.message}`))
  for (const p of paths) {
    await page.goto(`http://localhost:3014${p}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(900)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    const name = p.replace(/[/?=&]+/g, '-').replace(/^-|-$/g, '') || 'home'
    await page.screenshot({ path: `shots/site/${name}-${label}.png`, fullPage: true })
    console.log(`  ${overflow > 0 ? 'OVERFLOW ' + overflow + 'px' : 'ok'}  ${p} @ ${label}`)
  }
  await ctx.close()
}
await browser.close()
