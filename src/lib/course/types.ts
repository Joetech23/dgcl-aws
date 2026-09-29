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
 *
 * Scenes come in two sorts. The early slides have bespoke scenes because their
 * diagrams are one of a kind. The later slides use the four generic layouts
 * below, driven by `data`, which keeps twenty slides consistent and cheap to
 * author rather than twenty hand-built components that slowly drift apart.
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
  // generic, data-driven
  | 'cards'
  | 'steps'
  | 'split'
  | 'photo'
  | 'outro'
  | 'programme-title'
  | 'contents'
  | 'module-title'
  | 'module-outro'
  | 'code'

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

/* ---------- generic scene data ---------- */

export type CardSpec = {
  /** Also the reveal id for this card. */
  id: string
  label: string
  body?: string
  /** Small mono line above the label. */
  eyebrow?: string
  tint?: string
}

export type SceneData =
  | {
      kind: 'cards'
      intro?: string
      columns?: 2 | 3 | 4
      cards: CardSpec[]
      /** Closing line, revealed by its own id. */
      footnote?: { id: string; text: string }
    }
  | {
      kind: 'steps'
      intro?: string
      steps: CardSpec[]
      footnote?: { id: string; text: string }
    }
  | {
      kind: 'split'
      intro?: string
      left: { title: string; tint: string; items: CardSpec[] }
      right: { title: string; tint: string; items: CardSpec[] }
      footnote?: { id: string; text: string }
    }
  | {
      kind: 'photo'
      /** Path under /public. */
      image: string
      /** Points that reveal over the image. */
      points: CardSpec[]
      footnote?: { id: string; text: string }
    }
  | {
      /** Opening card of a module. Reveals 'title', 'sub', then 'points'. */
      kind: 'module-title'
      title: string
      points: string[]
    }
  | {
      /** Closing card of a module. Reveals 'done', 'covered', then 'next'. */
      kind: 'module-outro'
      heading: string
      covered: string[]
      next: string
    }
  | {
      /**
       * A code listing with lines that light up as the narrator explains them.
       * The most recently revealed highlight is the active one, so scrubbing
       * backwards moves the highlight back too.
       */
      kind: 'code'
      intro?: string
      /** Name on the editor tab. Defaults to policy.json. */
      filename?: string
      /** Plain text; one entry per line. */
      code: string[]
      highlights: {
        id: string
        /** 1-based, inclusive. */
        lines: [number, number]
        label: string
        body: string
      }[]
      footnote?: { id: string; text: string }
    }

export type Slide = {
  id: string
  navLabel: string
  title: string
  subtitle?: string
  sourceSlides: number[]
  scene: SceneId
  /** Required by the generic scenes, ignored by the bespoke ones. */
  data?: SceneData
  script: ScriptLine[]
  interaction?: InteractionSpec
}

/**
 * One module of the CO2/CO3 programme.
 *
 * Modules are separate courses that share a player. Each has its own slide
 * list, contents and counter, and each one stays locked until every slide of
 * the module before it is complete.
 */
export type CourseModule = {
  id: string
  /** Position in the fifteen-module CO2/CO3 programme, 1-based. */
  number: number
  title: string
  /** Short label for the module tabs. */
  short: string
  slides: Slide[]
}

export type WordTiming = { ms: number; d: number; t: string }

export type SlideTiming = {
  durationMs: number
  lines: { startMs: number; endMs: number }[]
  words: WordTiming[]
}
