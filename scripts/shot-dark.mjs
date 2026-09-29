/** Dark-mode viewport screenshot: node scripts/shot-dark.mjs <path> <w> <h> <out> [scrollY] */
import { chromium } from 'playwright'
const [p = '', w = '1440', h = '900', out = 'shots/site/dark.png', y = '0'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +w < 600 ? 2 : 1 })
await page.goto('http://localhost:3014/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.setItem('dgcl-theme', 'dark'))
await page.goto(`http://localhost:3014/${p.replace(/^\/+/, '')}`, { waitUntil: 'networkidle' })
await page.evaluate((y) => window.scrollTo(0, y), +y)
await page.waitForTimeout(1800)
await page.screenshot({ path: out })
await browser.close()
