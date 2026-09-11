import { BrowserNarrator } from './browser'
import { SilentNarrator } from './silent'
import type { Narrator } from './types'

export type { Narrator, SpeakHandlers } from './types'
export { BrowserNarrator } from './browser'
export { AudioFileNarrator } from './audioFile'
export { SilentNarrator } from './silent'

/**
 * One switch decides how the whole course speaks.
 * Swapping to ElevenLabs later is a change to this function and nothing else.
 */
export function createNarrator(muted: boolean): Narrator {
  if (muted) return new SilentNarrator()
  return new BrowserNarrator()
}
