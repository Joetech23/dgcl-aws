import type { CatalogModule } from '@/config/catalog'
import { catalog } from '@/config/catalog'
import type { Enrollment } from '@/lib/backend'

/**
 * Who can open which module. One function, used by the lesson page (to refuse)
 * and by every list of modules (to draw the lock), so the two cannot disagree.
 *
 * The Introduction and Modules 1 to 4 are free and open in any order. Modules
 * 5 to 14 open once DGCL puts the learner on a programme (self-paced or
 * instructor-led) from the admin panel, after the sales conversation.
 */
export type ModuleState =
  /** Finished every lesson. */
  | 'done'
  /** Ready to learn. */
  | 'open'
  /** Needs a programme: self-paced or instructor-led. */
  | 'needs-programme'
  /** Open to this learner, but the animated lesson is still being made. */
  | 'in-production'

export function moduleFraction(m: CatalogModule, completed: Set<string>) {
  if (!m.lesson) return 0
  const n = m.lesson.slides.filter((s) => completed.has(s.id)).length
  return n / m.lesson.slides.length
}

export function moduleState(m: CatalogModule, completed: Set<string>, enrollment: Enrollment | null): ModuleState {
  if (!m.free && !enrollment) return 'needs-programme'
  if (!m.lesson) return 'in-production'
  if (moduleFraction(m, completed) === 1) return 'done'
  return 'open'
}

export const canLearn = (s: ModuleState) => s === 'open' || s === 'done'

/** Where a learner should go next: the first open module not yet done. */
export function nextModule(completed: Set<string>, enrollment: Enrollment | null) {
  return (
    catalog.find((m) => moduleState(m, completed, enrollment) === 'open') ??
    catalog.find((m) => moduleState(m, completed, enrollment) === 'needs-programme') ??
    null
  )
}

/** Every free lesson that exists today is finished. */
export function freeTrackDone(completed: Set<string>) {
  return catalog.filter((m) => m.free && m.lesson).every((m) => moduleFraction(m, completed) === 1)
}
