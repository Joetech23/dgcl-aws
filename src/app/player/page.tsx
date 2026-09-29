import { CoursePlayer } from '@/components/player/CoursePlayer'
import { modules } from '@/content/modules'

/**
 * The full four-module player, exactly as it ships in the SCORM package.
 * Kept on the site for the demo and for the player's check scripts.
 */
export default function PlayerPage() {
  return <CoursePlayer modules={modules} assetBase="/" />
}
