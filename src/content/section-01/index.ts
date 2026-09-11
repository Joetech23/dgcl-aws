import type { Screen } from '@/lib/lesson/types'
import { screen01, screen02, screen03, screen04, screen05 } from './screens-01-05'
import { screen06, screen07, screen08, screen09, screen10 } from './screens-06-10'
import { screen11, screen12, screen13, screen14, screen15 } from './screens-11-15'

/**
 * Section 1, in order. Source slides 1–16 of
 * Amazon-Web-Services-Fundamentals-01.pptx.
 *
 * Extending the course to slides 17–49 means adding Screen objects to this
 * list. No new components are required unless a slide needs an interaction
 * that does not exist yet.
 */
export const SECTION_01: Screen[] = [
  screen01,
  screen02,
  screen03,
  screen04,
  screen05,
  screen06,
  screen07,
  screen08,
  screen09,
  screen10,
  screen11,
  screen12,
  screen13,
  screen14,
  screen15,
]
