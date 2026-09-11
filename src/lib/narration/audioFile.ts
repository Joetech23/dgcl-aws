import type { Narrator, SpeakHandlers } from './types'

/**
 * Narration from pre-rendered audio files.
 *
 * This is the production tier. Generate one MP3 per beat with ElevenLabs or
 * OpenAI, drop them in public/audio/, set NEXT_PUBLIC_NARRATION=audio, and
 * nothing else in the app changes. Word timings, if present, drive the same
 * caption highlighting the browser voice gets from boundary events.
 */

export type BeatTimings = { charIndex: number; charLength: number; timeMs: number }[]

export class AudioFileNarrator implements Narrator {
  readonly voiceLabel = 'Recorded narration'
  private el: HTMLAudioElement | null = null
  private timers: number[] = []
  private resolveSrc: (text: string) => { src: string; timings?: BeatTimings } | null

  constructor(resolveSrc: (text: string) => { src: string; timings?: BeatTimings } | null) {
    this.resolveSrc = resolveSrc
  }

  estimate(text: string): number {
    const words = text.trim().split(/\s+/).length
    return Math.max(1400, (words / 165) * 60_000 + 700)
  }

  speak(text: string, handlers: SpeakHandlers): void {
    this.cancel()
    const found = this.resolveSrc(text)
    if (!found) {
      // No audio for this line yet — don't strand the learner, just move on.
      handlers.onEnd()
      return
    }

    const el = new Audio(found.src)
    this.el = el
    el.onended = () => handlers.onEnd()
    el.onerror = () => handlers.onEnd()

    if (found.timings && handlers.onWord) {
      for (const t of found.timings) {
        this.timers.push(
          window.setTimeout(() => handlers.onWord?.(t.charIndex, t.charLength), t.timeMs),
        )
      }
    }

    void el.play().catch(() => handlers.onEnd())
  }

  cancel(): void {
    this.timers.forEach((t) => window.clearTimeout(t))
    this.timers = []
    if (this.el) {
      this.el.pause()
      this.el.onended = null
      this.el.onerror = null
      this.el = null
    }
  }
}
