/** Lesson page as a signed-in learner: node scripts/shot-learn.mjs <slug> <width> <height> <out> */
import { chromium } from 'playwright'
const [slug = 'm02-aws-fundamentals', w = '1920', h = '720', out = 'shots/lms/learn-wide.png'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
await page.goto('http://localhost:3014/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  localStorage.setItem('dgcl-user', JSON.stringify({ id: 'u_test', name: 'Ada Okafor', email: 'ada@example.com', createdAt: new Date().toISOString() }))
  localStorage.setItem('dgcl-aws-section-01', JSON.stringify({ completed: ['s00-programme', 's00-contents'], bookmark: 's09-deployment-models', score: null, track: null }))
})
await page.goto(`http://localhost:3014/learn/${slug}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.screenshot({ path: out })
await browser.close()
