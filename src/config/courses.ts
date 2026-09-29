/**
 * Every DGCL programme. AWS Cloud Training is the one on this site today;
 * the others run as live cohorts and will get their own online courses.
 *
 * Copy is from DGCL's current course cards. Fuller details are to come from
 * DGCL: add them here and every page that lists courses updates.
 */

export type Course = {
  id: string
  title: string
  /** Two or three words, for chips. */
  short: string
  /** Short line under the title. */
  summary: string
  /** Tools or topics, shown as tags. */
  topics: string[]
  cohort: string
  /** True when the animated online course is live on this site. */
  online: boolean
  /** Card accent, from the DGCL palette. */
  tint: string
  icon: 'cloud' | 'pipeline' | 'shield' | 'brain'
}

export const courses: Course[] = [
  {
    id: 'aws',
    short: 'AWS Cloud',
    title: 'AWS Cloud Training CO2/CO3',
    summary: 'Master AWS from first principles to the Cloud Practitioner exam. The Introduction and Modules 1 to 4 are free.',
    topics: ['EC2', 'IAM', 'S3', 'VPC', 'Serverless'],
    cohort: 'Online now, live cohort every 4 months',
    online: true,
    tint: '#000099',
    icon: 'cloud',
  },
  {
    id: 'devops',
    short: 'DevOps Tools',
    title: 'DevOps Tools Training',
    summary: 'Master the DevOps toolchain used in real teams, hands-on.',
    topics: ['Jenkins', 'Terraform', 'Kubernetes', 'Git', 'Docker', 'Ansible'],
    cohort: 'Live cohort every 4 months',
    online: false,
    tint: '#F5871F',
    icon: 'pipeline',
  },
  {
    id: 'cyber',
    short: 'Cybersecurity',
    title: 'Cybersecurity and Ethical Hacking',
    summary: 'CEH Pro training in penetration testing, network security and digital forensics.',
    topics: ['Pen testing', 'Network security', 'Forensics', 'CEH'],
    cohort: 'Live cohort every 4 months',
    online: false,
    tint: '#E5484D',
    icon: 'shield',
  },
  {
    id: 'data-ai',
    short: 'Data and AI',
    title: 'Healthcare Data Analysis, AI and Machine Learning',
    summary: 'Become a data professional with an industry-recognised certification course.',
    topics: ['Healthcare data', 'Python', 'AI', 'Machine learning'],
    cohort: 'Live cohort every 4 months',
    online: false,
    tint: '#12B981',
    icon: 'brain',
  },
]
