/**
 * The site end to end, on the preview (browser-only) backend.
 *
 * Learner: partner link -> sign-up -> guided tour -> the Introduction plays ->
 * modules open in any order -> Module 5 asks how to continue -> enquiry sent.
 * Admin: sees the enquiry and the learner, opens a programme, issues a
 * certificate, and the certificate verifies. Plus dark mode and the outline.
 * Screenshots land in shots/lms/.
 *
 * Needs the dev server on :3014.
 */
import { chromium } from 'playwright'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
// Runs against the preview backend only: it signs up test learners and sends
// enquiries, which must never reach the real Supabase project. Point it at a
// server started with the Supabase variables blank (see .claude/launch.json).
const BASE = process.env.BASE ?? 'http://localhost:3016'
const allLessons = (await readdir(path.join(ROOT, 'public', 'audio')))
  .filter((f) => /^[sieb]\d\d-.*\.json$/.test(f))
  .map((f) => f.slice(0, -5))

const results = []
const check = (name, pass, detail = '') => {
  results.push(pass)
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

await mkdir(path.join(ROOT, 'shots', 'lms'), { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })

for (const [label, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
  console.log(`\n${label}`)
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: label === 'phone' ? 2 : 1 })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Safety: this test writes fake data. Abort it if it ever reaches Supabase.
  await ctx.route(/supabase\.co/, (route) => {
    console.error('ABORT: the test server is talking to the real Supabase project. Start it with NEXT_PUBLIC_BACKEND=preview.')
    route.abort()
    process.exit(2)
  })
  const shot = (name) => page.screenshot({ path: `shots/lms/${label}-${name}.png` })

  // Landing, arriving from a partner link.
  await page.goto(BASE + '/?ref=techhub10', { waitUntil: 'networkidle' })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check('landing has no sideways scroll', overflow <= 0, `${overflow}px`)
  check('landing shows the UKRLP registration', await page.getByText('UKPRN 10101893').first().isVisible())
  check('no prices anywhere on the landing page', !(await page.getByText(/£\d/).count()))

  // Dark mode toggles and survives a reload.
  await page.getByRole('button', { name: 'Switch to dark mode' }).first().click()
  await page.reload({ waitUntil: 'networkidle' })
  check('dark mode is remembered', await page.evaluate(() => document.documentElement.classList.contains('dark')))
  await shot('00-landing-dark')
  await page.getByRole('button', { name: 'Switch to light mode' }).first().click()

  // The enquiry form from the landing page.
  await page.locator('#plans').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Ask about live classes' }).click()
  const dialog = page.getByRole('dialog')
  check('enquiry form opens with the partner code filled in', (await dialog.getByPlaceholder('e.g. TECHHUB10').inputValue()) === 'TECHHUB10')
  await shot('01-enquiry-form')
  await dialog.getByLabel('Full name').fill('Tobi Adewale')
  await dialog.getByLabel('Email').fill(`tobi.${label}@example.com`)
  await dialog.getByLabel('Phone (with country code)').fill('+234 803 000 0000')
  await dialog.locator('select[name="country"]').selectOption('Nigeria')
  await dialog.getByRole('button', { name: 'Send my details' }).click()
  check('enquiry is sent', await dialog.getByText('Thank you, Tobi.').isVisible())
  await dialog.getByRole('button', { name: 'Done' }).click()

  // A signed-out visitor cannot reach the dashboard.
  await page.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' })
  await page.waitForURL(/\/login\//, { timeout: 5000 }).catch(() => {})
  check('dashboard asks signed-out visitors to log in', page.url().includes('/login/'))

  // Sign up: the partner code rides along.
  await page.goto(BASE + '/signup/', { waitUntil: 'networkidle' })
  check('sign-up keeps the partner code', (await page.getByLabel('Partner code (optional)').inputValue()) === 'TECHHUB10')
  await page.getByLabel('Your name').fill('Ada Okafor')
  await page.getByLabel('Email').fill(`ada.${label}@example.com`)
  await page.getByLabel('Password').fill('cloudskills1')
  await page.getByRole('button', { name: 'Create free account' }).click()
  await page.waitForURL(/\/dashboard\//)

  // The guided tour runs on the first visit.
  const tour = page.getByRole('dialog', { name: 'Dashboard tour' })
  await tour.waitFor({ timeout: 5000 }).catch(() => {})
  check('guided tour starts on the first visit', await tour.isVisible())
  await shot('02-tour-welcome')
  await tour.getByRole('button', { name: 'Show me' }).click()
  await page.waitForTimeout(700)
  check('tour highlights the next lesson', await tour.getByText('1. Start here').isVisible())
  await shot('03-tour-step')
  for (let i = 0; i < 10 && (await tour.isVisible()); i++) {
    const done = tour.getByRole('button', { name: 'Start learning' })
    if (await done.isVisible()) await done.click()
    else await tour.getByRole('button', { name: 'Next' }).click()
    await page.waitForTimeout(450)
  }
  check('tour can be finished', !(await tour.isVisible()))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  check('tour does not repeat', !(await tour.isVisible()))
  await shot('04-dashboard')

  // The Introduction plays.
  await page.goto(BASE + '/learn/intro/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Play lesson 1/ }).click()
  await page.waitForFunction(() => (document.querySelector('audio')?.currentTime ?? 0) > 0.5, null, { timeout: 12000 }).catch(() => {})
  const t = await page.evaluate(() => document.querySelector('audio')?.currentTime ?? 0)
  check('the Introduction plays', t > 0.5, `${t.toFixed(1)}s`)
  await shot('05-learn-intro')

  // Modules open in any order.
  await page.goto(BASE + '/learn/m02-iam/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check('Module 2 opens straight away', await page.getByRole('button', { name: /Play lesson 1/ }).isVisible())

  // Module 5 asks how to continue, with no prices.
  await page.goto(BASE + '/learn/m05-vpc/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check('Module 5 offers the two ways to learn', await page.getByText('Choose how to continue').isVisible())
  await shot('06-module5-gate')

  // Finish every produced lesson (seeded): Module 3's end points to Module 4.
  await page.evaluate((completed) => {
    localStorage.setItem('dgcl-aws-section-01', JSON.stringify({ completed, bookmark: null, score: null, track: null }))
  }, allLessons)
  await page.goto(BASE + '/learn/m03-ec2/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  check('end of Module 3 leads on to Module 4', await page.getByRole('link', { name: /Start Module 4/ }).isVisible())
  await page.goto(BASE + '/learn/m04-s3/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check('Module 4 (S3) is free and ready to play', await page.getByRole('button', { name: /Play lesson|Watch again|Continue/ }).first().isVisible())

  await page.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  check('dashboard offers Modules 5 to 14', await page.getByText('Ready for Modules 5 to 14?').isVisible())
  await shot('07-dashboard-free-done')

  // Instructor-led lists all four courses.
  await page.goto(BASE + '/classes/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check('instructor-led page lists four courses', (await page.getByRole('button', { name: /live (AWS )?classes$/ }).count()) === 4)
  check('three domains list their live classes', (await page.getByText('Live class 1', { exact: true }).count()) === 3)
  await shot('08-instructor-led')

  if (label === 'phone') {
    await page.goto(BASE + '/learn/m01-aws-fundamentals/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: 'Course content' }).click()
    await page.waitForTimeout(500)
    check('phone outline opens as a sheet', await page.getByText('Course outline').isVisible())
    await shot('09-outline-sheet')
  } else {
    // Admin: sign in as DGCL staff (preview admin email).
    await page.goto(BASE + '/account/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Log out' }).last().click()
    await page.waitForURL(BASE + '/')
    await page.goto(BASE + '/login/', { waitUntil: 'networkidle' })
    await page.getByLabel('Email').fill('admin@dgclgroup.com')
    await page.getByLabel('Password').fill('adminpass1')
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.waitForURL(/\/dashboard\//)
    const tour2 = page.getByRole('dialog', { name: 'Dashboard tour' })
    if (await tour2.isVisible().catch(() => false)) await tour2.getByRole('button', { name: 'Close tour' }).click()

    await page.goto(BASE + '/admin/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    check('admin panel opens for staff', await page.getByRole('heading', { name: 'Admin panel' }).isVisible())
    await shot('10-admin-overview')

    await page.getByRole('button', { name: /^Enquiries/ }).click()
    await page.waitForTimeout(400)
    check('the enquiry reached the admin panel', await page.getByText('Tobi Adewale').first().isVisible())
    check('it is credited to the partner', await page.getByText('TECHHUB10').first().isVisible())
    await shot('11-admin-enquiries')

    await page.getByRole('button', { name: /^Learners/ }).click()
    await page.waitForTimeout(400)
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'CSV' }).click()])
    check('learners export to CSV', (await download.suggestedFilename()).endsWith('.csv'))
    const [pdf] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByRole('button', { name: 'PDF' }).click()])
    check('learners export to PDF', (await pdf.suggestedFilename()).endsWith('.pdf'))
    await shot('12-admin-learners')

    // Open the admin's own account to the self-paced programme and issue a certificate.
    await page.getByLabel('Programme for admin').selectOption('self-paced')
    await page.waitForTimeout(600)
    page.once('dialog', (d) => d.accept())
    await page.getByRole('row', { name: /admin@dgclgroup.com/ }).getByRole('button', { name: 'Issue' }).click()
    await page.waitForTimeout(800)
    const code = await page.getByRole('row', { name: /admin@dgclgroup.com/ }).getByRole('link', { name: /DGCL-AWS-/ }).innerText()
    check('certificate issued', /DGCL-AWS-[A-Z0-9]{6}/.test(code.trim()), code.trim())

    await page.goto(BASE + '/learn/m05-vpc/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    check('a programme opens Module 5', !(await page.getByText('Choose how to continue').count()))

    await page.goto(`${BASE}/c/${code.trim()}/`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    check('certificate verifies', await page.getByText('Verified.').isVisible())
    await shot('13-certificate')

    await page.getByRole('button', { name: /^Partners/ }).count()
    await page.goto(BASE + '/admin/#partners', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot('14-admin-partners')
  }

  check('no page errors', errors.length === 0, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
