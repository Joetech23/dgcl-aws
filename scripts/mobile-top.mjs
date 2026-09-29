import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3014/player/', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).click()
await page.waitForTimeout(1400)
await page.evaluate(() => document.querySelectorAll('audio').forEach((a) => (a.muted = true)))
for (const [i, name] of [[3, '04'], [14, '15']]) {
  await page.getByRole('navigation', { name: 'Slides' }).getByRole('button').nth(i).click()
  await page.waitForTimeout(500)
  await page.evaluate(() => { const a=document.querySelector('audio'); if(a&&a.duration) a.currentTime = a.duration*0.88 })
  await page.waitForTimeout(1400)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `shots/${name}-mobile-top.png`, fullPage: false })
}
await browser.close()
console.log('ok')
