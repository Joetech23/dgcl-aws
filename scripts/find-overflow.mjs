/** Lists elements wider than the viewport: node scripts/find-overflow.mjs <path-without-slash> [width] */
import { chromium } from 'playwright'
const [p = '', w = '390'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: +w, height: 844 } })
await page.goto(`http://localhost:3014/${p}`, { waitUntil: 'networkidle' })
const out = await page.evaluate(() => {
  const vw = window.innerWidth
  return [...document.querySelectorAll('body *')]
    .filter((el) => el.getBoundingClientRect().right > vw + 1)
    .slice(0, 8)
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)} right=${Math.round(el.getBoundingClientRect().right)}`)
})
console.log(out.join('\n'))
await browser.close()
