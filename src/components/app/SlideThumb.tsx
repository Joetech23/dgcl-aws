'use client'

import type { Slide } from '@/lib/course/types'
import { Scene } from '@/components/scenes'
import { ScaledStage } from '@/components/player/ScaledStage'
import { moduleBadge, moduleName, sectionLabel } from '@/lib/course/names'

/** A real slide, fully built, as a still thumbnail. */
export function SlideThumb({ slide, module, className = '' }: { slide: Slide; module: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <ScaledStage className="w-full" fit="width">
        <Scene slide={slide} shown={() => true} currentMs={600000} moduleLabel={sectionLabel(module)} />
      </ScaledStage>
    </div>
  )
}
