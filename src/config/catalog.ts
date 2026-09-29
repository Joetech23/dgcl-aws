import { modules as builtModules } from '@/content/modules'
import type { CourseModule } from '@/lib/course/types'

/**
 * The whole AWS programme, as DGCL sells it.
 *
 * Titles follow DGCL's own programme table of contents (Introduction, slide 2):
 * an Introduction, then Modules 1 to 14. The Introduction and Modules 1 to 4
 * are free. Modules 5 to 14 open when a learner joins the self-paced or
 * instructor-led programme (see tracks.ts); DGCL's sales team sets that.
 *
 * Edit copy here. Nothing else needs to change when a module is added: when
 * its slides exist in src/content/modules.ts, `lesson` fills in by id.
 */

export type CatalogModule = {
  number: number
  /** URL segment, /learn/<slug>. Matches the CourseModule id when built. */
  slug: string
  title: string
  short: string
  /** One plain sentence for cards. */
  blurb: string
  /** What the learner can do afterwards. Three, short. */
  outcomes: string[]
  /** Rough learning time including activities. */
  minutes: number
  free: boolean
  /** The animated lesson, when it has been produced. */
  lesson: CourseModule | null
}

type Entry = Omit<CatalogModule, 'lesson'>

const entries: Entry[] = [
  {
    number: 0,
    slug: 'intro',
    title: 'Introduction to Cloud Computing',
    short: 'Introduction',
    blurb: 'Where this programme starts, and where it takes you.',
    outcomes: ['See the whole programme', 'Know what each stage covers', 'Plan your study time'],
    minutes: 3,
    free: true,
  },
  {
    number: 1,
    slug: 'm01-aws-fundamentals',
    title: 'Amazon Web Services Fundamentals',
    short: 'AWS Fundamentals',
    blurb: 'What the cloud is, how AWS is built, and who does what.',
    outcomes: ['Explain IaaS, PaaS and SaaS', 'Read the AWS global map', 'Use the shared responsibility model'],
    minutes: 35,
    free: true,
  },
  {
    number: 2,
    slug: 'm02-iam',
    title: 'Identity and Access Management (IAM)',
    short: 'IAM',
    blurb: 'Who can get into your account, and what they can do there.',
    outcomes: ['Set up users, groups and roles', 'Read an IAM policy line by line', 'Apply least privilege'],
    minutes: 25,
    free: true,
  },
  {
    number: 3,
    slug: 'm03-ec2',
    title: 'Elastic Compute Cloud (EC2)',
    short: 'EC2',
    blurb: 'Virtual servers: choosing, paying for, securing and storing.',
    outcomes: ['Pick the right instance and price', 'Lock one down with security groups', 'Choose the right storage'],
    minutes: 30,
    free: true,
  },
  {
    number: 4,
    slug: 'm04-s3',
    title: 'Simple Storage Service (S3), Block and File Storage',
    short: 'S3 and Storage',
    blurb: 'Store anything, at any scale, for the right price.',
    outcomes: ['Create and secure S3 buckets', 'Pick a storage class', 'Host a static website'],
    minutes: 35,
    free: true,
  },
  {
    number: 5,
    slug: 'm05-vpc',
    title: 'Virtual Private Cloud (VPC) Networking',
    short: 'VPC',
    blurb: 'Your own private network inside AWS.',
    outcomes: ['Design subnets and routes', 'Connect to the internet safely', 'Secure traffic with NACLs'],
    minutes: 40,
    free: false,
  },
  {
    number: 6,
    slug: 'm06-elb-autoscaling',
    title: 'Elastic Load Balancing and Auto Scaling',
    short: 'Load Balancing',
    blurb: 'Stay online when traffic spikes, and pay less when it drops.',
    outcomes: ['Choose a load balancer', 'Build an Auto Scaling group', 'Design for high availability'],
    minutes: 35,
    free: false,
  },
  {
    number: 7,
    slug: 'm07-databases',
    title: 'Databases and Analytics',
    short: 'Databases',
    blurb: 'RDS, DynamoDB and the analytics services around them.',
    outcomes: ['Choose SQL or NoSQL', 'Plan backups and replicas', 'Know the analytics services'],
    minutes: 40,
    free: false,
  },
  {
    number: 8,
    slug: 'm08-monitoring',
    title: 'Monitoring, Logging, Auditing and AWS Control Tower',
    short: 'Monitoring',
    blurb: 'See what is happening in your account, and prove it.',
    outcomes: ['Set CloudWatch alarms', 'Audit with CloudTrail', 'Govern accounts with Control Tower'],
    minutes: 35,
    free: false,
  },
  {
    number: 9,
    slug: 'm09-dns-performance',
    title: 'DNS, Caching, and Performance Optimisation',
    short: 'DNS and Caching',
    blurb: 'Route 53, CloudFront and making everything faster.',
    outcomes: ['Route traffic with Route 53', 'Cache content with CloudFront', 'Tune for speed'],
    minutes: 30,
    free: false,
  },
  {
    number: 10,
    slug: 'm10-serverless',
    title: 'Serverless Applications Integration',
    short: 'Serverless',
    blurb: 'Run code without servers, and connect services together.',
    outcomes: ['Write a Lambda function', 'Connect with SQS, SNS and EventBridge', 'Build an API'],
    minutes: 40,
    free: false,
  },
  {
    number: 11,
    slug: 'm11-containers',
    title: 'Docker Containers and ECS',
    short: 'Containers',
    blurb: 'Package an app once, run it anywhere.',
    outcomes: ['Build a Docker image', 'Run it on ECS and Fargate', 'Store images in ECR'],
    minutes: 35,
    free: false,
  },
  {
    number: 12,
    slug: 'm12-deployment',
    title: 'Deployment and Management',
    short: 'Deployment',
    blurb: 'Infrastructure as code and automated releases.',
    outcomes: ['Write CloudFormation', 'Automate with CodePipeline', 'Manage fleets with Systems Manager'],
    minutes: 35,
    free: false,
  },
  {
    number: 13,
    slug: 'm13-security',
    title: 'Security in the Cloud',
    short: 'Security',
    blurb: 'Encryption, threat detection and compliance.',
    outcomes: ['Encrypt with KMS', 'Detect threats with GuardDuty', 'Protect apps with WAF'],
    minutes: 35,
    free: false,
  },
  {
    number: 14,
    slug: 'm14-migration-ml-cost',
    title: 'Migration, Machine Learning, and Cost Management',
    short: 'Migration and Cost',
    blurb: 'Move to AWS, use its AI services, and keep the bill down.',
    outcomes: ['Plan a migration', 'Use AWS AI services', 'Control costs with budgets'],
    minutes: 40,
    free: false,
  },
]

const bySlug = new Map(builtModules.map((m) => [m.id, m]))

export const catalog: CatalogModule[] = entries.map((e) => ({ ...e, lesson: bySlug.get(e.slug) ?? null }))

/** Numbered modules that are free (the Introduction is extra). */
export const FREE_COUNT = catalog.filter((m) => m.free && m.number > 0).length
/** Numbered modules, not counting the Introduction. */
export const TOTAL_MODULES = catalog.filter((m) => m.number > 0).length
export const LAST_FREE = Math.max(...catalog.filter((m) => m.free).map((m) => m.number))

export function findModule(slug: string) {
  return catalog.find((m) => m.slug === slug) ?? null
}
