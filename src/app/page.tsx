import { CoursePlayer } from '@/components/player/CoursePlayer'
import { slides } from '@/content/slides'

export default function Page() {
  return <CoursePlayer slides={slides} />
}
