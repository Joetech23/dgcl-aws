import type { Slide } from '@/lib/course/types'

export type SceneProps = {
  slide: Slide
  /** True once the line that reveals this element has begun. Derived from the
   *  audio clock so scrubbing backwards correctly hides things again. */
  shown: (id: string) => boolean
  currentMs: number
  /** Compact mode for the reduced stage height when the gate panel is up. */
  compact?: boolean
  /** Which stack-explorer model is currently selected. */
  activeModel?: number
}
