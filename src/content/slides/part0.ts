import type { Slide } from '@/lib/course/types'

/**
 * The programme opener, from CO2-CO3-Table-Of-Content.pptx.
 *
 * The Introduction: the programme title card, and the programme
 * contents list for the whole CO2/CO3 programme with this module marked.
 */

const p01: Slide = {
  id: 's00-programme',
  navLabel: 'AWS Cloud Training',
  title: 'AWS Cloud Training CO2/CO3',
  sourceSlides: [1],
  scene: 'programme-title',
  script: [
    {
      text: 'Welcome to AWS Cloud Training, course CO2 and CO3, from the Digital Cloud Academy.',
      reveal: 'title',
      holdMs: 200,
    },
    {
      text: 'The Academy is an AWS Advanced Partner, and this programme follows the path AWS itself recommends for people moving into cloud roles.',
      reveal: 'badge',
    },
    {
      text: 'After this introduction, fourteen modules take you from what the cloud is, to deploying and securing real workloads on it.',
      reveal: 'academy',
      holdMs: 400,
    },
  ],
}

const p02: Slide = {
  id: 's00-contents',
  navLabel: 'Programme contents',
  title: 'Table of Contents',
  sourceSlides: [2],
  scene: 'contents',
  script: [
    {
      text: 'Here is the whole programme, so you can see where this course sits in it.',
      reveal: 'g1',
    },
    {
      text: 'It opens with an introduction to cloud computing, then Amazon Web Services fundamentals, which comes straight after this introduction. After that, identity and access management, EC2 for compute, and S3 for storage.',
      holdMs: 200,
    },
    {
      text: 'The middle of the programme covers networking with VPC, load balancing and auto scaling, databases and analytics, monitoring and auditing, and then DNS, caching, and performance.',
      reveal: 'g2',
    },
    {
      text: 'The final modules move into serverless applications, Docker containers and ECS, deployment and management, security in the cloud, and finally migration, machine learning, and cost management.',
      reveal: 'g3',
      holdMs: 300,
    },
    {
      text: 'That is the introduction. Next comes Module One, Amazon Web Services Fundamentals. Press next to carry straight on.',
      holdMs: 500,
    },
  ],
}

export const slidesPart0: Slide[] = [p01, p02]
