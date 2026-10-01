/**
 * Builds the Supabase auth email templates into supabase/email-templates/.
 *
 *   node scripts/build-email-templates.mjs
 *
 * One shared layout, four emails. Each carries a 6-digit code ({{ .Token }})
 * rather than a link. Paste each file into Supabase > Authentication >
 * Emails > Templates (subjects are listed in supabase/email-templates/README.md).
 *
 * Email clients are strict: tables for layout, inline styles only, web-safe
 * fonts, and nothing that relies on JavaScript or external CSS.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(import.meta.dirname, '..', 'supabase', 'email-templates')
const NAVY = '#000066'
const BLUE = '#000099'
const GOLD = '#FFC000'
const INK = '#0B1020'
const MUTED = '#5B6478'
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function layout({ preheader, heading, intro, after }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#F4F6FB;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
        <tr>
          <!-- White header: many email apps strip CSS filters, so the logo keeps its own colours. -->
          <td style="background:#FFFFFF;padding:20px 28px;border-top:6px solid ${NAVY};border-bottom:3px solid ${GOLD};">
            <img src="{{ .SiteURL }}/brand/dgcl-logo.png" width="110" alt="DGCL Digital Cloud Academy" style="display:block;border:0;height:auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 8px;font-family:${FONT};color:${INK};">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${NAVY};">${heading}</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${MUTED};">${intro}</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#F4F6FB;border:2px solid ${BLUE};border-radius:12px;padding:16px 28px;font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:bold;letter-spacing:10px;color:${NAVY};">{{ .Token }}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 32px;font-family:${FONT};">
            <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:${MUTED};">${after}</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:${MUTED};">The code expires in one hour. If you did not ask for it, you can ignore this email: nothing will change.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px;background:#F4F6FB;font-family:${FONT};font-size:12px;line-height:1.6;color:#8C99B4;">
            DGCL Digital Cloud Academy · Digital Group Consultancy Services Ltd, London<br>
            UK registered training provider, UKPRN 10101893 · <a href="mailto:info@dgclgroup.com" style="color:#8C99B4;">info@dgclgroup.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`
}

const emails = [
  {
    file: 'confirm-signup.html',
    template: 'Confirm signup',
    subject: 'Your DGCL confirmation code',
    preheader: 'Enter this code to finish creating your account.',
    heading: 'Confirm your email',
    intro: 'Welcome to DGCL Digital Cloud Academy. Enter this code on the sign-up page to finish creating your account:',
    after: 'Then start with the Introduction: it takes two minutes.',
  },
  {
    file: 'login-code.html',
    template: 'Magic Link',
    subject: 'Your DGCL login code',
    preheader: 'Your code to log in to DGCL Digital Cloud Academy.',
    heading: 'Your login code',
    intro: 'Enter this code on the log-in page to sign in to DGCL Digital Cloud Academy:',
    after: 'Your progress is waiting where you left it.',
  },
  {
    file: 'reset-password.html',
    template: 'Reset Password',
    subject: 'Reset your DGCL password',
    preheader: 'Your code to choose a new password.',
    heading: 'Reset your password',
    intro: 'Enter this code on the reset page, then choose a new password:',
    after: 'For your security, never share this code with anyone, including DGCL staff.',
  },
  {
    file: 'change-email.html',
    template: 'Change Email Address',
    subject: 'Confirm your new DGCL email address',
    preheader: 'Your code to confirm your new email address.',
    heading: 'Confirm your new email',
    intro: 'Enter this code to confirm this address for your DGCL account:',
    after: 'Once confirmed, you will use this address to log in.',
  },
]

await mkdir(OUT, { recursive: true })
for (const e of emails) await writeFile(path.join(OUT, e.file), layout(e))

const readme = `# Supabase email templates

Built by \`node scripts/build-email-templates.mjs\`. Every email sends a 6-digit
code (\`{{ .Token }}\`) instead of a link. Edit the script, not these files.

Paste each into **Supabase > Authentication > Emails > Templates**:

| Supabase template | Subject | File |
| --- | --- | --- |
${emails.map((e) => `| ${e.template} | ${e.subject} | ${e.file} |`).join('\n')}

The logo loads from \`{{ .SiteURL }}/brand/dgcl-logo.png\`, so set **Site URL**
(Authentication > URL Configuration) to the live site address.
`
await writeFile(path.join(OUT, 'README.md'), readme)
console.log(`wrote ${emails.length} templates to ${OUT}`)
