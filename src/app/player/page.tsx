import { notFound } from 'next/navigation'
import { CoursePlayer } from '@/components/player/CoursePlayer'
import { modules } from '@/content/modules'

/**
 * The full player with every module, exactly as it ships in the SCORM
 * package. Development only, for the player's check scripts: on the live
 * site it would hand out the paid modules with no account at all.
 */
export default function PlayerPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <CoursePlayer modules={modules} assetBase="/" />
}
