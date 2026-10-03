/**
 * DGCL's four core domains. AWS Cloud Training is the self-paced course on
 * this site today; the other three are taught in live instructor classes,
 * and the recordings of those classes are published here as they are ready.
 *
 * Copy is from DGCL's current course cards. Fuller details are to come from
 * DGCL: add them here and every page that lists courses updates.
 */

/** One live instructor class. Add `video` when its recording is uploaded. */
export type LiveClass = {
  title: string
  /** A link to the recording (YouTube, Vimeo, Drive). Empty until uploaded. */
  video?: string
  /** Optional one-line description of what the class covers. */
  about?: string
}

export type Course = {
  id: string
  title: string
  /** The domain's name, for chips and tight spaces. */
  short: string
  /** Short line under the title. */
  summary: string
  /** Tools or topics, shown as tags. */
  topics: string[]
  /** How it is taught today, in a few words. */
  schedule: string
  /** True when the animated online course is live on this site. */
  online: boolean
  /** Live instructor classes, in order. Listed on the Instructor-led page. */
  liveClasses: LiveClass[]
  /** Card accent, from the DGCL palette. */
  tint: string
  icon: 'cloud' | 'pipeline' | 'shield' | 'brain'
}

// Recordings are being produced. To publish one, add its link:
//   { title: 'Live class 1', video: 'https://...', about: 'Git and version control' }
// To list more classes, add more lines.
const upcoming = (count: number): LiveClass[] => Array.from({ length: count }, (_, i) => ({ title: `Live class ${i + 1}` }))

export const courses: Course[] = [
  {
    id: 'aws',
    short: 'AWS Cloud',
    title: 'AWS Cloud Training CO2/CO3',
    summary: 'Master AWS from first principles to the Cloud Practitioner exam. The Introduction and Modules 1 to 4 are free.',
    topics: ['EC2', 'IAM', 'S3', 'VPC', 'Serverless'],
    schedule: 'Online now, with live instructor classes',
    online: true,
    liveClasses: [],
    tint: '#000099',
    icon: 'cloud',
  },
  {
    id: 'devops',
    short: 'DevOps Tools',
    title: 'DevOps Tools Training',
    summary: 'Master the DevOps toolchain used in real teams, hands-on.',
    topics: ['Jenkins', 'Terraform', 'Kubernetes', 'Git', 'Docker', 'Ansible'],
    schedule: 'Live instructor classes',
    online: false,
    liveClasses: upcoming(4),
    tint: '#F5871F',
    icon: 'pipeline',
  },
  {
    id: 'cyber',
    short: 'Cybersecurity and Ethical Hacking',
    title: 'Cybersecurity and Ethical Hacking',
    summary: 'CEH Pro training in penetration testing, network security and digital forensics.',
    topics: ['Pen testing', 'Network security', 'Forensics', 'CEH'],
    schedule: 'Live instructor classes',
    online: false,
    liveClasses: upcoming(4),
    tint: '#E5484D',
    icon: 'shield',
  },
  {
    id: 'data-ai',
    short: 'Healthcare Data Analysis, AI and ML',
    title: 'Healthcare Data Analysis, AI and Machine Learning',
    summary: 'Become a data professional with an industry-recognised certification course.',
    topics: ['Healthcare data', 'Python', 'AI', 'Machine learning'],
    schedule: 'Live instructor classes',
    online: false,
    liveClasses: upcoming(4),
    tint: '#12B981',
    icon: 'brain',
  },
]
