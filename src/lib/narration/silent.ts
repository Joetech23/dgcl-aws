import type { Narrator, SpeakHandlers } from './types'

/** Used when the learner mutes, and in tests. Still paces the beat. */
export class SilentNarrator implements Narrator {
  readonly voiceLabel = 'Muted'
  private timer: number | null = null

  estimate(text: string): number {
    const words = text.trim().split(/\s+/).length
    return Math.max(1200, (words / 200) * 60_000)
  }

  speak(text: string, handlers: SpeakHandlers): void {
    this.cancel()
    this.timer = window.setTimeout(() => handlers.onEnd(), this.estimate(text))
  }

  cancel(): void {
    if (this.timer !== null) window.clearTimeout(this.timer)
    this.timer = null
  }
}
