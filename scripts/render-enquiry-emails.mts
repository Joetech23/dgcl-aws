/**
 * Writes the two enquiry emails to HTML files so they can be looked at.
 *   npx tsx scripts/render-enquiry-emails.mts <out-dir> <site-url>
 * A hostile name and message are used on purpose: nothing typed into the
 * form may come out as live HTML.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { enquiryReceipt, salesAlert } from '../src/lib/email/enquiry'

const out = process.argv[2] || 'dist/email-preview'
const site = process.argv[3] || 'https://freelearning.dgclgroup.com'
const e = {
  name: 'Ada <b>Obi</b>',
  email: 'ada@example.com',
  phone: '+234 803 000 0000',
  country: 'Nigeria',
  track: 'instructor-led',
  course: 'Cybersecurity and Ethical Hacking',
  message: 'Evenings are best. <script>alert(1)</script>',
  referralCode: 'TECHHUB10',
}
await mkdir(out, { recursive: true })
const a = salesAlert(e, site)
const r = enquiryReceipt(e, site)
await writeFile(path.join(out, 'sales-alert.html'), a.html)
await writeFile(path.join(out, 'receipt.html'), r.html)
const all = a.html + r.html
console.log('subjects:', JSON.stringify([a.subject, r.subject]))
console.log('escaped:', !all.includes('<script>') && !all.includes('<b>Obi'))
console.log('no long dashes:', !/[–—]/.test(all))
