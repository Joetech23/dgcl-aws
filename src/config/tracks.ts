/**
 * The two ways to learn with DGCL. There are no public prices: a learner
 * picks a track, leaves their details, and DGCL's sales team calls them with
 * a price for their country. When they join, an admin sets their track and
 * Modules 5 to 14 open.
 */

export type TrackId = 'self-paced' | 'instructor-led'

export type Track = {
  id: TrackId
  name: string
  tagline: string
  benefits: string[]
  /** Short lines for tight spaces like the lesson page. */
  short: string[]
  cta: string
  badge?: string
}

export const tracks: Track[] = [
  {
    id: 'self-paced',
    name: 'Self-paced',
    tagline: 'Every narrated lesson, on your schedule.',
    benefits: [
      'All 14 AWS modules as animated, narrated lessons',
      'Activities and quizzes that check you understood',
      'DGCL certificate when you finish',
      'AWS Cloud Practitioner practice exams',
      'Learn on your phone, with captions for sound-off',
      'Keep access, and every update',
    ],
    short: ['All 14 modules, narrated', 'DGCL certificate', 'Practice exams'],
    cta: 'Ask about self-paced',
  },
  {
    id: 'instructor-led',
    name: 'Instructor-led',
    tagline: 'Live classes with a DGCL instructor and your cohort.',
    benefits: [
      'Live online classes with a DGCL instructor',
      'Everything in self-paced, included',
      'Hands-on labs and real projects',
      'Recordings of every class',
      'Mentor Q&A and a career session',
      'Available for AWS Cloud, DevOps, Cybersecurity, and Data and AI',
    ],
    short: ['Live instructor classes', 'Self-paced lessons included', 'Labs and career support'],
    cta: 'Ask about live classes',
    badge: 'Most support',
  },
]

export function findTrack(id: string | null | undefined) {
  return tracks.find((t) => t.id === id) ?? null
}
