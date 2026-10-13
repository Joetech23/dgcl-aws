import type { CatalogModule } from '@/config/catalog'
import { catalog } from '@/config/catalog'
import type { Enrollment } from '@/lib/backend'

/**
 * Who can open which module. One function, used by the lesson page (to refuse)
 * and by every list of modules (to draw the lock), so the two cannot disagree.
 *
 * - Free modules are open to every account, in any order.
 * - A priced module opens when the learner has bought it.
 * - Every module opens once DGCL puts the learner on a programme (self-paced
 *   or instructor-led) from the admin panel.
 *
 * This is what the learner sees. The server makes the same decision again
 * before it hands over a paid module's narration (src/app/media).
 */
export type ModuleState =
  /** Finished every lesson. */
  | 'done'
  /** Ready to learn. */
  | 'open'
  /** Can be bought on its own. */
  | 'needs-purchase'
  /** Needs a programme: self-paced or instructor-led. */
  | 'needs-programme'
  /** Open to this learner, but the animated lesson is still being made. */
  | 'in-production'

const NONE: ReadonlySet<string> = new Set()

export function moduleFraction(m: CatalogModule, completed: Set<string>) {
  if (!m.lesson) return 0
  const n = m.lesson.slides.filter((s) => completed.has(s.id)).length
  return n / m.lesson.slides.length
}

export function moduleState(m: CatalogModule, completed: Set<string>, enrollment: Enrollment | null, purchased: ReadonlySet<string> = NONE): ModuleState {
  if (!m.free && !enrollment && !purchased.has(m.slug)) return m.price !== null ? 'needs-purchase' : 'needs-programme'
  if (!m.lesson) return 'in-production'
  if (moduleFraction(m, completed) === 1) return 'done'
  return 'open'
}

export const canLearn = (s: ModuleState) => s === 'open' || s === 'done'
export const isLocked = (s: ModuleState) => s === 'needs-purchase' || s === 'needs-programme'

/** Where a learner should go next: the first open module not yet done, else the first they could unlock. */
export function nextModule(completed: Set<string>, enrollment: Enrollment | null, purchased: ReadonlySet<string> = NONE) {
  const state = (m: CatalogModule) => moduleState(m, completed, enrollment, purchased)
  return catalog.find((m) => state(m) === 'open') ?? catalog.find((m) => state(m) === 'needs-purchase') ?? catalog.find((m) => state(m) === 'needs-programme') ?? null
}

/** Every free lesson that exists today is finished. */
export function freeTrackDone(completed: Set<string>) {
  return catalog.filter((m) => m.free && m.lesson).every((m) => moduleFraction(m, completed) === 1)
}
