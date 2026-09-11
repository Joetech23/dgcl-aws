import type { Narrator, SpeakHandlers } from './types'

/**
 * Narration via the browser's built-in speech synthesis.
 *
 * The default voice is the robotic one everybody associates with browser TTS,
 * and it is exactly the coldness this course is trying to beat. Windows 11 and
 * Edge/Chrome ship Microsoft's *Natural* neural voices alongside the legacy
 * ones, so we hunt for those first and only fall back to the default when
 * there is genuinely nothing better. Slowing the rate slightly and inserting
 * real pauses between sentences does the rest.
 *
 * This is a placeholder tier. AudioFileNarrator is the drop-in replacement for
 * ElevenLabs/OpenAI audio and needs no changes anywhere else.
 */

const PREFERRED = [
  // Microsoft neural voices, best first. Sonia/Ryan are en-GB, Aria/Guy en-US.
  /microsoft.*(sonia|libby).*natural/i,
  /microsoft.*(aria|jenny|michelle).*natural/i,
  /microsoft.*(ryan|guy|christopher).*natural/i,
  /natural/i,
  /google uk english female/i,
  /google us english/i,
  /online/i,
  // Last resort: the legacy SAPI voices that ship with every Windows install.
  // Zira is noticeably less flat than David, which is otherwise the default.
  /zira/i,
]

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => /^en/i.test(v.lang))
  const pool = english.length ? english : voices
  for (const pattern of PREFERRED) {
    const hit = pool.find((v) => pattern.test(v.name))
    if (hit) return hit
  }
  return pool[0] ?? null
}

export class BrowserNarrator implements Narrator {
  private voice: SpeechSynthesisVoice | null = null
  private current: SpeechSynthesisUtterance | null = null
  private cancelled = false

  constructor() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const load = () => {
      this.voice = pickVoice(window.speechSynthesis.getVoices())
    }
    load()
    // Voices populate asynchronously in Chrome; the first call usually returns [].
    window.speechSynthesis.addEventListener('voiceschanged', load)
  }

  get voiceLabel(): string {
    return this.voice?.name ?? 'System voice'
  }

  estimate(text: string): number {
    // ~165 wpm at rate 0.95, with a floor so very short lines still breathe.
    const words = text.trim().split(/\s+/).length
    return Math.max(1400, (words / 165) * 60_000 + 700)
  }

  speak(text: string, handlers: SpeakHandlers): void {
    this.cancel()
    this.cancelled = false

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      handlers.onEnd()
      return
    }

    const u = new SpeechSynthesisUtterance(text)
    if (this.voice) u.voice = this.voice
    u.rate = 0.95
    u.pitch = 1
    u.volume = 1

    u.onboundary = (e) => {
      if (e.name === 'word' || e.name === undefined) {
        handlers.onWord?.(e.charIndex, e.charLength ?? 0)
      }
    }
    const finish = () => {
      if (this.cancelled) return
      this.current = null
      handlers.onEnd()
    }
    u.onend = finish
    u.onerror = finish

    this.current = u
    window.speechSynthesis.speak(u)
  }

  cancel(): void {
    this.cancelled = true
    this.current = null
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}
