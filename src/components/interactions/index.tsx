'use client'

import type { InteractionSpec } from '@/lib/lesson/types'
import { TapReveal } from './TapReveal'
import { Hotspot } from './Hotspot'
import { SortIntoBuckets } from './SortIntoBuckets'
import { ScenarioMatch } from './ScenarioMatch'
import { Iceberg } from './Iceberg'
import { PathChoice } from './PathChoice'
import { StackExplorer } from './StackExplorer'

/** Every screen's activity resolves through here. Adding a screen picks one. */
export function Interaction({
  spec,
  onComplete,
  onChooseTrack,
  onModelChange,
}: {
  spec: InteractionSpec
  onComplete: () => void
  onChooseTrack?: (id: string) => void
  /** Lets the scene mirror the model the learner is currently looking at. */
  onModelChange?: (index: number) => void
}) {
  switch (spec.kind) {
    case 'tap-reveal':
      return <TapReveal spec={spec} onComplete={onComplete} />
    case 'hotspot':
      return <Hotspot spec={spec} onComplete={onComplete} />
    case 'sort':
      return <SortIntoBuckets spec={spec} onComplete={onComplete} />
    case 'scenario-match':
      return <ScenarioMatch spec={spec} onComplete={onComplete} />
    case 'slider-compare':
      return <Iceberg spec={spec} onComplete={onComplete} />
    case 'path-choice':
      return <PathChoice spec={spec} onComplete={onComplete} onChoose={onChooseTrack} />
    case 'stack-explorer':
      return (
        <StackExplorer spec={spec} onComplete={onComplete} onModelChange={onModelChange} />
      )
  }
}
