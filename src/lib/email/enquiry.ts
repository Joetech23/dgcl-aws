/**
 * The two emails sent when someone submits the "talk to our team" form:
 * an alert to DGCL's sales inbox, and a confirmation to the enquirer.
 *
 * Plain functions that return subject and HTML, so the API route can send
 * them and a test can render them. Email clients are strict: tables for
 * layout, inline styles only, web-safe fonts.
 */

export type EnquiryEmailInput = {
  name: string
  email: string
  phone: string
  country: string
  track: string
  course: string
  message?: string | null
  referralCode?: string | null
}

const NAVY = '#000066'
const BLUE = '#000099'
const GOLD = '#FFC000'
const INK = '#0B1020'
const MUTED = '#5B6478'
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/** Everything typed into the form is untrusted: escape it before it goes into HTML. */
export function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function layout(siteUrl: string, preheader: string, heading: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F6FB;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#FFFFFF;padding:20px 28px;border-top:6px solid ${NAVY};border-bottom:3px solid ${GOLD};">
            <img src="${esc(siteUrl)}/brand/dgcl-logo.png" width="110" alt="DGCL Digital Cloud Academy" style="display:block;border:0;height:auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 28px;font-family:${FONT};color:${INK};">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${NAVY};">${esc(heading)}</h1>
            ${body}
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

const p = (html: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${MUTED};">${html}</p>`

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px 8px 0;font-family:${FONT};font-size:13px;color:${MUTED};vertical-align:top;white-space:nowrap;">${esc(label)}</td>
    <td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${INK};font-weight:600;">${value}</td>
  </tr>`
}

const trackName = (t: string) => (t === 'instructor-led' ? 'Instructor-led' : t === 'self-paced' ? 'Self-paced' : t)

/** To DGCL's team: who asked, about what, and how to reach them in one tap. */
export function salesAlert(e: EnquiryEmailInput, siteUrl: string) {
  const digits = e.phone.replace(/\D/g, '')
  const body = `
    ${p(`A new enquiry has just come in from the website. Reply to this email to answer ${esc(e.name.split(' ')[0])} directly.`)}
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #DEE4F0;border-bottom:1px solid #DEE4F0;margin:6px 0 18px;">
      ${row('Name', esc(e.name))}
      ${row('Email', `<a href="mailto:${esc(e.email)}" style="color:${BLUE};">${esc(e.email)}</a>`)}
      ${row('Phone', `<a href="tel:${esc(e.phone.replace(/\s/g, ''))}" style="color:${BLUE};">${esc(e.phone)}</a>`)}
      ${row('Country', esc(e.country))}
      ${row('Way to learn', esc(trackName(e.track)))}
      ${row('About', esc(e.course))}
      ${e.referralCode ? row('Partner code', esc(e.referralCode)) : ''}
      ${e.message ? row('Message', esc(e.message)) : ''}
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="background:${BLUE};border-radius:10px;"><a href="${esc(siteUrl)}/admin/#enquiries" style="display:inline-block;padding:12px 18px;font-family:${FONT};font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">Open in the admin panel</a></td>
      ${digits ? `<td style="width:10px;"></td><td style="border:1px solid #DEE4F0;border-radius:10px;"><a href="https://wa.me/${digits}" style="display:inline-block;padding:11px 16px;font-family:${FONT};font-size:14px;font-weight:bold;color:${INK};text-decoration:none;">WhatsApp</a></td>` : ''}
    </tr></table>`
  return {
    subject: `New enquiry: ${e.name} (${trackName(e.track)}, ${e.country})`,
    html: layout(siteUrl, `${e.name} asked about ${e.course}.`, 'New enquiry', body),
  }
}

/** To the enquirer: we have it, here is what happens next, start learning meanwhile. */
export function enquiryReceipt(e: EnquiryEmailInput, siteUrl: string) {
  const first = e.name.split(' ')[0]
  const body = `
    ${p(`Hi ${esc(first)}, thank you for asking about <strong style="color:${INK};">${esc(e.course)}</strong> (${esc(trackName(e.track).toLowerCase())}).`)}
    ${p('A DGCL adviser will call or email you, usually within one working day, with the options and the price for your country.')}
    ${p('While you wait, the Introduction and Modules 1 to 4 of AWS Cloud Training are free to take.')}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;"><tr>
      <td style="background:${BLUE};border-radius:10px;"><a href="${esc(siteUrl)}/dashboard/" style="display:inline-block;padding:12px 18px;font-family:${FONT};font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">Start learning free</a></td>
    </tr></table>
    <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:${MUTED};">Have a question now? Just reply to this email.</p>`
  return {
    subject: 'We have your enquiry: DGCL Digital Cloud Academy',
    html: layout(siteUrl, 'A DGCL adviser will contact you within one working day.', 'Thank you, we have your details', body),
  }
}
