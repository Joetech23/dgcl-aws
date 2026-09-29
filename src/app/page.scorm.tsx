import { CoursePlayer } from '@/components/player/CoursePlayer'
import { modules } from '@/content/modules'

/** SCORM build only: the whole course as one page, with relative asset paths. */
export default function ScormPage() {
  return <CoursePlayer modules={modules} assetBase="./" />
}
