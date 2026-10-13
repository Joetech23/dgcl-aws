/**
 * Prices. Everything a learner can pay for online is listed here, and the
 * server charges only these amounts: the browser never sends a price.
 *
 * Agreed with DGCL on 9 October 2026:
 * - The Introduction and Modules 1 and 2 are free.
 * - Modules 3 and 4 are $20 each, as a first test. To put a price on another
 *   module, add it below (and set `free: false` for it in catalog.ts).
 * - An instructor-led enquiry is confirmed by a $25 consultation fee, which
 *   comes off the training fee if the learner enrols.
 *
 * This file is read by the server routes and by scripts/build-cpanel.mjs, so
 * it must not import anything.
 */

export const CURRENCY = 'usd'

export type PaidModule = {
  /** Whole US dollars. */
  usd: number
  /** What the learner sees on the Stripe payment page. */
  name: string
  /**
   * First letter of this module's slide ids (e01-..., b01-...). Its narration
   * files are served only to learners who have paid; see src/app/media.
   */
  audioPrefix: string
}

export const PAID_MODULES: Record<string, PaidModule> = {
  'm03-ec2': { usd: 20, name: 'Module 3: Elastic Compute Cloud (EC2)', audioPrefix: 'e' },
  'm04-s3': { usd: 20, name: 'Module 4: Simple Storage Service (S3), Block and File Storage', audioPrefix: 'b' },
}

/** One-to-one consultation before instructor-led training. Whole US dollars. */
export const CONSULTATION_FEE_USD = 25

export const money = (usd: number) => `$${usd}`

/** The paid module a narration file belongs to, or null if it is free. */
export function paidModuleForAudio(file: string): string | null {
  const first = file[0]
  for (const [slug, m] of Object.entries(PAID_MODULES)) if (m.audioPrefix === first) return slug
  return null
}
