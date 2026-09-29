/**
 * Confirms the site is talking to Supabase, without writing anything:
 * a login with an unknown account must be refused by Supabase (the preview
 * backend would have let it in), and the dashboard must still require login.
 */
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
const calls = []
page.on('request', (r) => { if (r.url().includes('supabase.co')) calls.push(new URL(r.url()).pathname) })
await page.goto('http://localhost:3014/login/', { waitUntil: 'networkidle' })
await page.getByLabel('Email').fill('nobody-here@example.com')
await page.getByLabel('Password').fill('not-a-real-password')
await page.getByRole('button', { name: 'Log in' }).click()
await page.waitForTimeout(3500)
const alert = (await page.getByRole('alert').allTextContents()).find((t) => t.trim()) ?? null
console.log(`  ${alert?.includes('do not match') ? 'PASS' : 'FAIL'}  Supabase refuses an unknown login  (${alert ?? page.url()})`)
console.log(`  ${calls.some((c) => c.includes('/auth/v1/token')) ? 'PASS' : 'FAIL'}  requests go to your Supabase project  (${[...new Set(calls)].join(', ')})`)
await page.goto('http://localhost:3014/dashboard/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
console.log(`  ${page.url().includes('/login/') ? 'PASS' : 'FAIL'}  dashboard still needs a login`)
await browser.close()
