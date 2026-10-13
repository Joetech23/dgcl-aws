/**
 * Sends one email through Resend. Server only.
 *
 *   RESEND_API_KEY   required; without it nothing is sent and false comes back
 *   EMAIL_FROM       optional sender
 *   SALES_EMAIL      optional; where DGCL's alerts go
 */
const FROM_DEFAULT = 'DGCL Digital Cloud Academy <no-reply@freelearning.dgclgroup.com>'
const SALES_DEFAULT = 'info@dgclgroup.com'

export const salesInbox = () => process.env.SALES_EMAIL || SALES_DEFAULT

export async function sendEmail(input: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || FROM_DEFAULT,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
      }),
    })
    if (!res.ok) console.error('[email]', res.status, (await res.text()).slice(0, 300))
    return res.ok
  } catch (e) {
    console.error('[email]', e)
    return false
  }
}
