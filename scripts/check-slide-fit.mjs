/**
 * Finds text that does not fit on a slide.
 *
 * Opens /dev/slides (every slide, fully built, at the real 960px canvas size)
 * and, for each element that directly holds text, checks it stays inside the
 * slide and inside any clipping box around it. Prints each problem with the
 * slide id and the start of the text, and saves an image of each failing
 * slide to shots/fit/.
 *
 *   node scripts/check-slide-fit.mjs [idPrefix]
 *
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const prefix = process.argv[2] ?? ''
await mkdir('shots/fit', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1980, height: 1100 } })
await page.goto('http://localhost:3014/dev/slides/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(2500)

const problems = await page.evaluate((prefix) => {
  const out = []
  for (const card of document.querySelectorAll('[data-slide]')) {
    const id = card.getAttribute('data-slide')
    if (!id.startsWith(prefix)) continue
    const canvas = card.querySelector('.slide-canvas')
    if (!canvas) continue
    const cr = canvas.getBoundingClientRect()
    const scale = cr.width / 960
    const tol = 2 * scale
    const seen = new Set()
    for (const el of canvas.querySelectorAll('*')) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!own) continue
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) continue
      let why = null
      if (r.bottom > cr.bottom + tol || r.right > cr.right + tol || r.left < cr.left - tol || r.top < cr.top - tol) why = 'off the slide'
      // Inside a clipping box? It must fit that box too, or the text is cut off.
      for (let p = el.parentElement; !why && p && p !== canvas; p = p.parentElement) {
        const cs = getComputedStyle(p)
        if (/(hidden|clip|auto|scroll)/.test(cs.overflow + cs.overflowY + cs.overflowX)) {
          const pr = p.getBoundingClientRect()
          if (r.bottom > pr.bottom + tol || r.right > pr.right + tol) why = 'cut off by its box'
        }
      }
      // A text box shorter than its content (text wrapping past a fixed height).
      if (!why && el.scrollHeight > el.clientHeight + 3 && /(hidden|clip)/.test(getComputedStyle(el).overflow)) why = 'taller than its box'
      if (why) {
        const text = el.textContent.trim().slice(0, 60)
        if (!seen.has(text)) {
          seen.add(text)
          out.push({ id, why, text })
        }
      }
    }
  }
  return out
}, prefix)

const bySlide = new Map()
for (const p of problems) bySlide.set(p.id, [...(bySlide.get(p.id) ?? []), p])
for (const [id, list] of bySlide) {
  console.log(`\n${id}`)
  for (const p of list) console.log(`  ${p.why}: ${p.text}`)
  await page.locator(`[data-slide="${id}"] .slide-canvas`).screenshot({ path: `shots/fit/${id}.png` })
}
const total = await page.locator('[data-slide]').count()
console.log(`\n${bySlide.size} of ${total} slides have text that does not fit`)
await browser.close()
