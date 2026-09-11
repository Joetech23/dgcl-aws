export type SpeakHandlers = {
  /** Fired as the voice crosses each word, for live caption highlighting. */
  onWord?: (charIndex: number, charLength: number) => void
  onEnd: () => void
}

export interface Narrator {
  /** Human-readable name of the voice actually in use, for the UI. */
  readonly voiceLabel: string
  speak(text: string, handlers: SpeakHandlers): void
  cancel(): void
  /** Rough ms this line will take. The lesson machine uses it as a deadline. */
  estimate(text: string): number
}
