/** Signed-in screenshot: node scripts/shot-app.mjs <path> <w> <h> <out> [dark] */
import { chromium } from 'playwright'
const [p = 'dashboard/', w = '1440', h = '900', out = 'shots/lms/app.png', dark = ''] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +w < 600 ? 2 : 1 })
await page.goto('http://localhost:3014/', { waitUntil: 'networkidle' })
await page.evaluate((dark) => {
  localStorage.setItem('dgcl-user', JSON.stringify({ id: 'u_test', name: 'Ada Okafor', email: 'ada@example.com', createdAt: new Date().toISOString(), role: 'student' }))
  localStorage.setItem('dgcl-aws-section-01', JSON.stringify({ completed: ['s00-programme', 's00-contents', 's01-title', 's02-what-aws-is'], bookmark: 's03-key-features', score: null, track: null }))
  localStorage.setItem('dgcl-streak', JSON.stringify({ days: 3, lastDay: new Date().toISOString().slice(0, 10) }))
  localStorage.setItem('dgcl-tour-done', '1')
  localStorage.setItem('dgcl-theme', dark ? 'dark' : 'light')
}, dark)
await page.goto(`http://localhost:3014/${p.replace(/^\/+/, '')}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.screenshot({ path: out })
await browser.close()
