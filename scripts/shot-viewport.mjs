/** One viewport screenshot: node scripts/shot-viewport.mjs <path-without-slash> <width> <height> <out> [scrollY] */
import { chromium } from 'playwright'
const [p = '', w = '1440', h = '900', out = 'shots/site/view.png', y = '0'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +w < 600 ? 2 : 1 })
await page.goto(`http://localhost:3014/${p.replace(/^\/+/, '')}`, { waitUntil: 'networkidle' })
await page.evaluate((y) => window.scrollTo(0, y), +y)
await page.waitForTimeout(1000)
await page.screenshot({ path: out })
await browser.close()
