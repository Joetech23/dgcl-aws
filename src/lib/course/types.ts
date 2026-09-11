import type { InteractionSpec } from '@/lib/lesson/types'

/**
 * Slide authoring format.
 *
 * A slide is a script plus a scene that animates against it. Every visible
 * state is DERIVED from the audio clock, never accumulated on a tick, so
 * scrubbing backwards un-reveals correctly.
 *
 * A line marked `gate` stops playback and hands control to the learner. That
 * one behaviour is the whole difference between this and a video.
 */

export type SceneId =
  | 'title'
  | 'what-aws-is'
  | 'key-features'
  | 'service-families'
  | 'use-cases'
  | 'audience'
  | 'cert-ladder'
  | 'what-is-cloud'
  | 'deployment-models'
  | 'responsibilities'
  | 'cloud-service-provider'
  | 'iceberg'
  | 'service-models'
  | 'six-advantages'
  | 'global-infrastructure'
  | 'regions-azs'
  | 'edge-locations'
  | 'aws-accounts'
  | 'account-features'
  | 'root-and-iam'

export type ScriptLine = {
  /** Spoken text. Also the transcript line. Plain, no em dashes. */
  text: string
  /** Scene element this line brings on screen. */
  reveal?: string
  /** Stop here until the activity is finished. */
  gate?: boolean
  /** Extra silence after the line, in ms. */
  holdMs?: number
}

export type Slide = {
  id: string
  navLabel: string
  title: string
  subtitle?: string
  sourceSlides: number[]
  scene: SceneId
  script: ScriptLine[]
  interaction?: InteractionSpec
}

export type WordTiming = { ms: number; d: number; t: string }

export type SlideTiming = {
  durationMs: number
  lines: { startMs: number; endMs: number }[]
  words: WordTiming[]
}
