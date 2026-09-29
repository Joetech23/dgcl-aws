'use client'

/**
 * Partner referrals.
 *
 * A partner shares a link like https://…/?ref=ACME10, or gives out the code.
 * The link is remembered for 60 days in this browser, then attached to the
 * learner's account at sign-up and to any enquiry they send, so the partner
 * is credited even if the learner comes back later.
 */

const KEY = 'dgcl-ref'
const DAYS = 60

export function normaliseCode(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24)
}

/** Call once per page load: stores ?ref=CODE if present. */
export function captureReferral() {
  try {
    const code = new URLSearchParams(window.location.search).get('ref')
    if (!code) return
    const clean = normaliseCode(code)
    if (clean) window.localStorage.setItem(KEY, JSON.stringify({ code: clean, at: Date.now() }))
  } catch {
    /* storage blocked: the learner can still type the code */
  }
}

export function getReferral(): string {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return ''
    const { code, at } = JSON.parse(raw) as { code: string; at: number }
    if (Date.now() - at > DAYS * 864e5) return ''
    return code
  } catch {
    return ''
  }
}

export function referralLink(code: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dgcl.academy'
  return `${origin}/?ref=${encodeURIComponent(code)}`
}
