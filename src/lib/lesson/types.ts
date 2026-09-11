/**
 * The authoring format for the whole course.
 *
 * A screen is a sequence of beats. A beat is one spoken sentence plus,
 * optionally, the element it uncovers. Interactions gate progress: while one
 * is unfinished the learner cannot continue, which is the whole point — the
 * course waits for them rather than pacing them on a timeline.
 *
 * Adding a screen means adding one of these objects. No new components.
 */

export type Beat = {
  /** Narration text. Doubles as the caption in the mentor rail. */
  say: string
  /** id of the canvas element this beat uncovers, if any. */
  reveal?: string
  /** Extra silence after the line, in ms. Use for a deliberate pause. */
  pauseAfter?: number
}

/* ---------- interaction specs ---------- */

export type TapRevealSpec = {
  kind: 'tap-reveal'
  prompt: string
  /** Every card must be opened before the learner can continue. */
  cards: {
    id: string
    label: string
    /** Short line shown on the face of the card, before it is opened. */
    teaser?: string
    body: string
    icon?: string
  }[]
  columns?: 2 | 3 | 4 | 5
}

export type HotspotSpec = {
  kind: 'hotspot'
  prompt: string
  /** Which diagram component renders underneath the hotspots. */
  diagram: 'cert-ladder' | 'csp' | 'service-stack'
  hotspots: {
    id: string
    label: string
    body: string
    /** Percentage coordinates on the diagram box. */
    x: number
    y: number
  }[]
  /** How many must be opened to continue. Defaults to all. */
  requireAll?: boolean
}

export type SortSpec = {
  kind: 'sort'
  prompt: string
  buckets: { id: string; label: string; hint?: string }[]
  chips: { id: string; label: string; bucket: string; why: string }[]
  /** Shown once the learner gets everything right. */
  successNote?: string
}

export type ScenarioMatchSpec = {
  kind: 'scenario-match'
  prompt: string
  scenarios: {
    id: string
    scenario: string
    options: { id: string; label: string; correct?: boolean; feedback: string }[]
  }[]
}

export type SliderCompareSpec = {
  kind: 'slider-compare'
  prompt: string
  /** The iceberg is the only user of this today; the spec stays general. */
  diagram: 'iceberg'
  /** The learner has to push the control past this point to "see" the answer. */
  revealAt: number
  successNote: string
}

export type PathChoiceSpec = {
  kind: 'path-choice'
  prompt: string
  choices: { id: string; label: string; body: string }[]
}

export type StackExplorerSpec = {
  kind: 'stack-explorer'
  prompt: string
  /** Models the learner can switch between; the boundary moves as they do. */
  models: {
    id: string
    label: string
    /** Number of layers, counted from the top, that the customer manages. */
    youManage: number
    note: string
  }[]
  layers: string[]
}

export type InteractionSpec =
  | TapRevealSpec
  | HotspotSpec
  | SortSpec
  | ScenarioMatchSpec
  | SliderCompareSpec
  | PathChoiceSpec
  | StackExplorerSpec

/* ---------- checks ---------- */

export type KnowledgeCheck = {
  prompt: string
  multi?: boolean
  options: { id: string; label: string; correct: boolean; explain: string }[]
}

/* ---------- screens ---------- */

export type Screen = {
  id: string
  /** Short label for the contents menu. */
  navLabel: string
  title: string
  /** Small mono eyebrow above the title. */
  eyebrow?: string
  /** Provenance back into Amazon-Web-Services-Fundamentals-01.pptx. */
  sourceSlides: number[]
  /** Learner-facing: what they'll be able to do after this screen. */
  objective: string
  /**
   * Key statements that assemble on the canvas as the narration reaches them,
   * each matched to a beat's `reveal` id. They give the spoken content a
   * visible spine — useful for skimmers, and essential with the sound off.
   */
  points?: { id: string; text: string; emphasis?: boolean }[]
  beats: Beat[]
  interaction?: InteractionSpec
  check?: KnowledgeCheck
  /** Set on the final checkpoint screen. */
  quiz?: KnowledgeCheck[]
}
