import type { CourseModule } from '@/lib/course/types'
import { slidesPart0 } from './slides/part0'
import { slides } from './slides'
import { slidesIam } from './slides/iam'
import { slidesEc2 } from './slides/ec2'
import { slidesS3 } from './slides/s3'

/**
 * The produced lessons, in programme order.
 *
 * The programme opens with an Introduction (number 0, from
 * CO2-CO3-Table-Of-Content.pptx), then numbered modules: 1 Amazon Web Services
 * Fundamentals, 2 IAM, 3 EC2, 4 S3. Adding the next module means adding an entry
 * here; the catalogue (src/config/catalog.ts) picks it up by id.
 */
export const modules: CourseModule[] = [
  {
    id: 'intro',
    number: 0,
    title: 'Introduction to Cloud Computing',
    short: 'Introduction',
    slides: slidesPart0,
  },
  {
    id: 'm01-aws-fundamentals',
    number: 1,
    title: 'Amazon Web Services Fundamentals',
    short: 'AWS Fundamentals',
    slides,
  },
  {
    id: 'm02-iam',
    number: 2,
    title: 'Identity and Access Management (IAM)',
    short: 'IAM',
    slides: slidesIam,
  },
  {
    id: 'm03-ec2',
    number: 3,
    title: 'Elastic Compute Cloud (EC2)',
    short: 'EC2',
    slides: slidesEc2,
  },
  {
    id: 'm04-s3',
    number: 4,
    title: 'Simple Storage Service (S3), Block and File Storage',
    short: 'S3 and Storage',
    slides: slidesS3,
  },
]
