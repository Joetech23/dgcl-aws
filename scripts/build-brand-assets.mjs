/**
 * Draws the FreeTechPath app icons and the social share card.
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Output: public/pwa/{icon-192,icon-512,maskable-512,apple-touch-icon}.png
 * and public/og.png (1200x630). Re-run after changing the mark or the wording.
 */
import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'pwa')
await mkdir(OUT, { recursive: true })

// The path mark: three steps up to a gold point.
const mark = (pad) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="position:absolute;inset:${pad}%;width:${100 - pad * 2}%;height:${100 - pad * 2}%">
    <path d="M22 72 L42 54 L58 62 L78 32" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="22" cy="72" r="7" fill="#1B8AFF"/>
    <circle cx="78" cy="32" r="10" fill="#FFC000"/>
  </svg>`
const icon = (radius, pad) =>
  `<html><body style="margin:0;background:transparent"><div style="position:relative;width:100vw;height:100vh;background:#000066;border-radius:${radius}%">${mark(pad)}</div></body></html>`

const font = pathToFileURL(path.join(ROOT, 'src', 'app', 'fonts', 'montserrat-var.woff2')).href
const logo = `data:image/png;base64,${(await readFile(path.join(ROOT, 'public', 'brand', 'dgcl-logo.png'))).toString('base64')}`
const domains = ['AWS Cloud', 'DevOps Tools', 'Cybersecurity and Ethical Hacking', 'Healthcare Data Analysis, AI and Machine Learning']
const og = `<html><head><style>
  @font-face { font-family: M; src: url('${font}'); font-weight: 600 800; }
  body { margin: 0; width: 1200px; height: 630px; background: #000066; color: #fff; font-family: M, system-ui; position: relative; overflow: hidden; }
  .ring { position: absolute; border-radius: 50%; }
  .chip { display: inline-block; margin: 0 10px 10px 0; padding: 10px 18px; border-radius: 999px; background: rgba(255,255,255,.1); font-size: 22px; font-weight: 600; }
</style></head><body>
  <div class="ring" style="right:-150px;top:-170px;width:520px;height:520px;border:64px solid rgba(255,255,255,.05)"></div>
  <div class="ring" style="right:120px;bottom:-230px;width:420px;height:420px;border:52px solid rgba(255,192,0,.18)"></div>
  <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:20px">
    <div style="position:relative;width:84px;height:84px;border-radius:20px;background:#0000BC">${mark(0)}</div>
    <div style="font-size:46px;font-weight:800;letter-spacing:-0.02em">FreeTechPath</div>
  </div>
  <div style="position:absolute;left:72px;top:206px;width:900px">
    <div style="font-size:74px;font-weight:800;line-height:1.04;letter-spacing:-0.035em">Launch your tech career. <span style="color:#FFC000">Start free.</span></div>
    <div style="margin-top:22px;font-size:27px;font-weight:600;color:rgba(255,255,255,.75)">Free narrated lessons and live classes from DGCL Digital Cloud Academy</div>
  </div>
  <div style="position:absolute;left:72px;bottom:44px;width:1060px">${domains.map((d) => `<span class="chip">${d}</span>`).join('')}</div>
  <img src="${logo}" style="position:absolute;right:64px;top:56px;height:92px;filter:brightness(0) invert(1)">
</body></html>`

const browser = await chromium.launch({ channel: 'chrome' })
const shot = async (html, w, h, file, transparent = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: file, omitBackground: transparent })
  await page.close()
  console.log('wrote', path.relative(ROOT, file))
}
await shot(icon(22, 0), 192, 192, path.join(OUT, 'icon-192.png'), true)
await shot(icon(22, 0), 512, 512, path.join(OUT, 'icon-512.png'), true)
// Maskable: full bleed, with the mark inside the safe middle 80%.
await shot(icon(0, 14), 512, 512, path.join(OUT, 'maskable-512.png'))
await shot(icon(0, 8), 180, 180, path.join(OUT, 'apple-touch-icon.png'))
await shot(og, 1200, 630, path.join(ROOT, 'public', 'og.png'))
await browser.close()
