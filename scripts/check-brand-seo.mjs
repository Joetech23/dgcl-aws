/**
 * Checks the FreeTechPath branding, the SEO files, the app manifest, the
 * live class lists and the long-name layout on a phone.
 *
 *   node scripts/check-brand-seo.mjs        (preview test server on :3016)
 *
 * Runs against the preview backend only; it aborts on any Supabase request.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:3016'
const SHOTS = 'shots/brand'
await mkdir(SHOTS, { recursive: true })
let failed = 0
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  ${extra}` : ''}`)
  if (!ok) failed++
}
const text = async (path) => {
  const r = await fetch(BASE + path)
  return { status: r.status, body: await r.text(), type: r.headers.get('content-type') || '' }
}

// ---------- files search engines and phones read ----------
const robots = await text('/robots.txt')
check('robots.txt exists and names the sitemap', robots.status === 200 && /Sitemap: https:\/\/.+\/sitemap\.xml/.test(robots.body))
check('robots.txt keeps signed-in pages out', robots.body.includes('Disallow: /dashboard/') && robots.body.includes('Disallow: /admin/'))
const sitemap = await text('/sitemap.xml')
check('sitemap lists the public pages', sitemap.status === 200 && ['/course/', '/plans/', '/partners/'].every((p) => sitemap.body.includes(`${p}</loc>`)))
check('sitemap has no signed-in pages', !/dashboard|admin|account/.test(sitemap.body))
const manifest = await text('/manifest.webmanifest')
const m = manifest.status === 200 ? JSON.parse(manifest.body) : {}
check('manifest is installable', m.short_name === 'FreeTechPath' && m.display === 'standalone' && m.icons?.some((i) => i.sizes === '512x512') && m.icons?.some((i) => i.purpose === 'maskable'))
for (const f of ['/pwa/icon-192.png', '/pwa/icon-512.png', '/pwa/maskable-512.png', '/pwa/apple-touch-icon.png', '/og.png', '/sw.js', '/offline.html']) {
  check(`${f} is served`, (await fetch(BASE + f)).status === 200)
}

const browser = await chromium.launch({ channel: 'chrome' })
const guard = async (ctx) =>
  ctx.route(/supabase\.co/, () => {
    console.error('ABORT: this test must not reach Supabase')
    process.exit(2)
  })

// ---------- landing: title, tags, copy, the swapping mark ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await guard(ctx)
  const page = await ctx.newPage()
  await page.goto(BASE + '/')
  check('title says FreeTechPath', (await page.title()).startsWith('FreeTechPath'), await page.title())
  check('canonical link is set', (await page.locator('link[rel="canonical"]').getAttribute('href'))?.endsWith('/'))
  check('share image is set', (await page.locator('meta[property="og:image"]').getAttribute('content'))?.endsWith('/og.png'))
  check('manifest is linked', (await page.locator('link[rel="manifest"]').count()) === 1)
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())
  check('structured data lists four courses', ld['@graph'].filter((x) => x['@type'] === 'Course').length === 4)
  const hero = await page.locator('h1 + p').first().textContent()
  check(
    'hero names the four domains exactly',
    ['AWS Cloud', 'DevOps Tools', 'Cybersecurity and Ethical Hacking', 'Healthcare Data Analysis, AI and Machine'].every((d) => hero.includes(d)),
  )
  check('"next cohort" is gone from the landing page', (await page.getByText(/next cohort/i).count()) === 0)
  check('three domains show numbered live classes', (await page.locator('ol[aria-label$="live classes"]').count()) === 3)
  check('no long dashes on the landing page', !/[–—]/.test(await page.locator('body').innerText()))

  // The mark: both faces exist, and over one loop each is visible at some point.
  const seen = { dgcl: 0, ftp: 0 }
  for (let i = 0; i < 24; i++) {
    const o = await page.evaluate(() => {
      const q = (s) => Number(getComputedStyle(document.querySelector(`header ${s}`)).opacity)
      return { dgcl: q('.brand-dgcl'), ftp: q('.brand-ftp') }
    })
    seen.dgcl = Math.max(seen.dgcl, o.dgcl)
    seen.ftp = Math.max(seen.ftp, o.ftp)
    if (i === 0) await page.locator('header').screenshot({ path: `${SHOTS}/header-dgcl.png` })
    if (o.ftp > 0.99 && !seen.shot) {
      await page.locator('header').screenshot({ path: `${SHOTS}/header-freetechpath.png` })
      seen.shot = true
    }
    await page.waitForTimeout(450)
  }
  check('the mark shows the DGCL logo', seen.dgcl > 0.99)
  check('the mark swaps to FreeTechPath', seen.ftp > 0.99)
  const w1 = await page.locator('header .brand-swap').evaluate((e) => e.getBoundingClientRect().width)
  await page.waitForTimeout(5000)
  const w2 = await page.locator('header .brand-swap').evaluate((e) => e.getBoundingClientRect().width)
  check('the header does not shift when it swaps', w1 === w2, `${w1} vs ${w2}`)
  await page.screenshot({ path: `${SHOTS}/landing-desktop.png` })
  await page.locator('#courses').screenshot({ path: `${SHOTS}/courses-desktop.png` })
  await ctx.close()
}

// ---------- phone: a learner whose only name is a very long email ----------
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 760 }, deviceScaleFactor: 2 })
  await guard(ctx)
  const page = await ctx.newPage()
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)

  await page.goto(BASE + '/')
  check('phone landing has no sideways scroll', (await overflow()) <= 0, `${await overflow()}px`)
  await page.screenshot({ path: `${SHOTS}/landing-phone.png` })

  // Preview backend: an account whose name is the whole email address.
  const email = 'christopher.oluwaseun.adebayo-williams2024@students.exampleuniversity.ac.uk'
  await page.evaluate((email) => {
    for (const k of Object.keys(localStorage)) if (k.startsWith('dgcl-') && k !== 'dgcl-theme') localStorage.removeItem(k)
    localStorage.setItem('dgcl-tour-done', '1')
    return email
  }, email)
  await page.goto(BASE + '/signup/')
  await page.getByLabel('Your name').fill(email)
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill('long-name-test-1')
  await page.getByRole('button', { name: 'Create free account' }).click()
  await page.waitForURL(/dashboard/)
  await page.waitForTimeout(800)
  const skip = page.getByRole('button', { name: /skip/i })
  if (await skip.count()) await skip.first().click()
  check('dashboard greets by a readable name, not the email', !(await page.locator('h1').first().textContent()).includes('@'), await page.locator('h1').first().textContent())
  check('phone dashboard has no sideways scroll', (await overflow()) <= 0, `${await overflow()}px`)
  await page.screenshot({ path: `${SHOTS}/dashboard-phone-long-name.png` })

  await page.getByRole('button', { name: 'Account menu' }).click()
  await page.waitForTimeout(300)
  check('account menu fits the phone', (await overflow()) <= 0, `${await overflow()}px`)
  await page.screenshot({ path: `${SHOTS}/menu-phone-long-name.png` })
  await page.keyboard.press('Escape')

  await page.goto(BASE + '/account/')
  await page.waitForTimeout(500)
  check('phone account page has no sideways scroll', (await overflow()) <= 0, `${await overflow()}px`)
  await page.screenshot({ path: `${SHOTS}/account-phone-long-name.png` })

  await page.goto(BASE + '/classes/')
  await page.waitForTimeout(500)
  check('phone classes page has no sideways scroll', (await overflow()) <= 0, `${await overflow()}px`)
  check('classes page lists live classes 1 to 4 for three domains', (await page.getByText('Live class 4', { exact: true }).count()) === 3)
  check('"next cohort" is gone from the classes page', (await page.getByText(/next cohort/i).count()) === 0)
  await page.screenshot({ path: `${SHOTS}/classes-phone.png`, fullPage: true })
  await ctx.close()
}

// ---------- classes on a laptop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await guard(ctx)
  const page = await ctx.newPage()
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.setItem('dgcl-tour-done', '1'))
  await page.goto(BASE + '/signup/')
  await page.getByLabel('Your name').fill('Ada Obi')
  await page.getByLabel('Email', { exact: true }).fill('ada@example.com')
  await page.getByLabel('Password', { exact: true }).fill('long-name-test-1')
  await page.getByRole('button', { name: 'Create free account' }).click()
  await page.waitForURL(/dashboard/)
  await page.goto(BASE + '/classes/')
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${SHOTS}/classes-desktop.png`, fullPage: true })
  await ctx.close()
}

await browser.close()
console.log(failed ? `\n${failed} failed` : '\nAll brand and SEO checks passed')
process.exit(failed ? 1 : 0)
