/**
 * DGCL's four core products. AWS Cloud Training is also the self-paced course
 * on this site; all four are taught as instructor-led training, which a
 * learner joins by booking a one-to-one consultation (see pricing.ts for the
 * fee). There are no recorded classes on the site.
 *
 * Summaries are from DGCL's course cards. Outlines are DGCL's tables of
 * contents, received 12 October 2026.
 */

/** One block of a table of contents: a heading (optional) and its lines. */
export type OutlineSection = {
  heading?: string
  items: string[]
  /** Number the lines 1, 2, 3... Use for modules; leave off for weeks or bullet points. */
  numbered?: boolean
}

export type Course = {
  id: string
  title: string
  /** The product's name, for chips and tight spaces. */
  short: string
  /** Short line under the title. */
  summary: string
  /** Tools or topics, shown as tags. */
  topics: string[]
  /**
   * What a learner will be taught, in order. While it is empty the page lists
   * the topics above instead. (AWS takes its modules from catalog.ts, so the
   * self-paced course and this list can never disagree.)
   */
  outline: OutlineSection[]
  /** A few words beside "What you will learn", e.g. "7 modules". */
  outlineLabel?: string
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
    summary: 'Master AWS from first principles to the Cloud Practitioner exam.',
    topics: ['EC2', 'IAM', 'S3', 'VPC', 'Serverless'],
    outline: [],
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
    outlineLabel: '7 modules',
    outline: [
      {
        numbered: true,
        items: [
          'DevOps Foundations and Linux Essentials: Installing Ubuntu on AWS EC2',
          'Source Code Management with Git',
          'Infrastructure as Code with Terraform',
          'Containerisation with Docker',
          'Continuous Integration with Jenkins',
          'Container Orchestration with Kubernetes',
          'DevOps Monitoring Tools: ELK Stack, Prometheus, Grafana and Dynatrace',
        ],
      },
    ],
    online: false,
    tint: '#F5871F',
    icon: 'pipeline',
  },
  {
    id: 'cyber',
    short: 'Cybersecurity and Ethical Hacking',
    title: 'Cybersecurity and Ethical Hacking',
    summary: 'CEH Pro training in penetration testing, network security and digital forensics.',
    topics: ['Pen testing', 'Network security', 'Forensics', 'CEH'],
    // Table of contents still to come from DGCL: paste it here like the others.
    outline: [],
    online: false,
    tint: '#E5484D',
    icon: 'shield',
  },
  {
    id: 'data-ai',
    short: 'Healthcare Data Analysis, AI and ML',
    title: 'Healthcare Data Analysis, AI and Machine Learning',
    summary: 'Become a data professional with an industry-recognised certification course.',
    topics: ['Healthcare data', 'Python', 'AI', 'Machine learning'],
    outlineLabel: '4 months and a capstone project',
    outline: [
      {
        heading: 'Month one',
        items: [
          'Week 1A: Introduction to Data Analysis',
          'Week 1B: Basic Linux, Folders and Files (optional)',
          'Week 2: Data Cleaning with Microsoft Excel',
          'Week 3: Dashboarding with Microsoft Excel',
          'Week 4: Forecasting and Time Series Analysis with Excel',
        ],
      },
      {
        heading: 'Month two',
        items: [
          'Week 5A: Data Visualisation with Tableau (Part I)',
          'Week 5B: Version Control System: Git and GitHub (optional)',
          'Week 6: Dashboarding with Tableau (Part II)',
          'Week 7: Data Visualisation with Microsoft Power BI (Part I)',
          'Week 8: Dashboarding with Microsoft Power BI (Part II)',
        ],
      },
      {
        heading: 'Month three',
        items: [
          'Introduction to Artificial Intelligence (AI)',
          'Amazon Bedrock and GenAI',
          'Prompt Engineering',
          'Amazon Q',
          'AI and Machine Learning (ML)',
          'AWS Managed AI Services',
          'Amazon SageMaker',
          'Responsible AI, Security, Compliance and Governance',
        ],
      },
      {
        heading: 'Month four',
        items: ['Python for Healthcare Data Analysis', 'SQL for Healthcare Data Analysis'],
      },
      {
        heading: 'Capstone project and portfolio building',
        items: [
          'Using a healthcare dataset and defining a problem statement',
          'End-to-end workflow: cleaning, analysis, then visualisation',
          'Combining tools (Excel, Power BI, Tableau)',
          'Writing a short report with insights and recommendations',
          'Presenting findings (5-minute presentation)',
          'Assignment: share your portfolio link',
        ],
      },
    ],
    online: false,
    tint: '#12B981',
    icon: 'brain',
  },
]
