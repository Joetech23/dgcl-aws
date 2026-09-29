import type { Slide } from '@/lib/course/types'

/**
 * Module 3: Amazon Elastic Compute Cloud (EC2).
 *
 * From Elastic-Compute-Cloud-(EC2).pptx, 50 slides, in deck order. The deck's
 * tables and AWS diagrams are rebuilt as cards, and its metadata and user data
 * examples become live listings. Where the deck has dated since it was written
 * (Spot bidding, Scheduled Reserved Instances, gp2 as the default volume) the
 * slide keeps the deck's content and adds a short note on what AWS does today.
 *
 * Scripts follow the house rules: plain spoken English, no em dashes.
 */

const BLUE = '#000099'
const ELECTRIC = '#0000BC'
const GOLD = '#FFC000'
const ORANGE = '#F5871F'
const VIOLET = '#7A5AF8'
const MINT = '#12B981'
const ROSE = '#E5484D'
const TEAL = '#0E9AA7'

const e01: Slide = {
  id: 'e01-title',
  navLabel: 'Welcome to EC2',
  title: 'Amazon Elastic Compute Cloud (EC2)',
  sourceSlides: [1, 2],
  scene: 'module-title',
  data: {
    kind: 'module-title',
    title: 'Amazon Elastic Compute Cloud (EC2)',
    points: ['Instances and AMIs', 'Pricing options', 'Networking and security', 'Lifecycle and metadata', 'Storage for EC2'],
  },
  script: [
    { text: 'Welcome to Module Three of AWS Cloud Training: Amazon Elastic Compute Cloud, known everywhere as EC2.', reveal: 'title', holdMs: 200 },
    { text: 'EC2 is where you rent virtual servers in the cloud, and it is the service most AWS workloads are built on.', reveal: 'sub' },
    { text: 'In this module you will learn what an instance is, how to pay for one, how to reach it and secure it, and the storage that sits behind it.', reveal: 'points', holdMs: 400 },
  ],
}

const e02: Slide = {
  id: 'e02-overview',
  navLabel: 'EC2 overview',
  title: 'Amazon EC2',
  subtitle: 'Overview',
  sourceSlides: [3],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'EC2 provides on-demand, scalable computing capacity in the AWS cloud.',
    columns: 3,
    cards: [
      { id: 'hardware', label: 'No hardware to buy', eyebrow: 'Cost', body: 'You stop paying for servers up front and pay for what you use instead.', tint: BLUE },
      { id: 'up', label: 'Scale up for the peaks', eyebrow: 'Demand', body: 'Month end, year end, or a sudden rush of website traffic.', tint: ORANGE },
      { id: 'down', label: 'Scale down afterwards', eyebrow: 'Savings', body: 'When the busy period ends, you hand the capacity back.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'In short: the right amount of computing power, at the moment you need it.' },
  },
  script: [
    { text: 'Amazon EC2 provides on-demand, scalable computing capacity in the AWS cloud.', reveal: 'intro' },
    { text: 'Using it reduces hardware costs, because you no longer buy servers in advance.', reveal: 'hardware' },
    { text: 'You can scale up when a process runs monthly or yearly, or when your website gets an unexpected spike in traffic.', reveal: 'up' },
    { text: 'And when the busy period is over, you scale back down and stop paying for what you no longer need.', reveal: 'down' },
    { text: 'In short, the right amount of computing power, at the moment you need it.', reveal: 'foot', holdMs: 400 },
  ],
}

const e03: Slide = {
  id: 'e03-server-vs-instance',
  navLabel: 'Server versus instance',
  title: 'Traditional Server vs',
  subtitle: 'EC2 Instance',
  sourceSlides: [4],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Traditional server',
      tint: ORANGE,
      items: [
        { id: 't1', label: 'Physical hardware', body: 'A CPU, memory, a hard disk and a network card in a box you own.' },
        { id: 't2', label: 'An operating system', body: 'Installed on that hardware, then your applications on top.' },
      ],
    },
    right: {
      title: 'EC2 instance',
      tint: BLUE,
      items: [
        { id: 'c1', label: 'An AMI', body: 'A saved image of the operating system and software. It replaces the install.' },
        { id: 'c2', label: 'An instance type', body: 'The virtual hardware: how many CPUs, how much memory, what network speed.' },
      ],
    },
    footnote: { id: 'foot', text: 'AMI plus instance type equals a running server. Everything else in this module builds on that.' },
  },
  script: [
    { text: 'Start with what you already know. A traditional server is physical hardware: a processor, memory, a disk, and a network card.', reveal: 't1' },
    { text: 'You install an operating system on it, and your applications on top.', reveal: 't2' },
    { text: 'An EC2 instance splits that into two choices. First, an Amazon Machine Image, or AMI, which holds the operating system and software.', reveal: 'c1' },
    { text: 'Second, an instance type, which is the virtual hardware: the number of CPUs, the memory, and the network performance.', reveal: 'c2' },
    { text: 'An AMI plus an instance type gives you a running server. Everything else in this module builds on that.', reveal: 'foot', holdMs: 400 },
  ],
}

const e04: Slide = {
  id: 'e04-instance-types',
  navLabel: 'Instance types',
  title: 'EC2 Instance',
  subtitle: 'Types',
  sourceSlides: [5],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Instances are virtual servers. Their families are tuned for different kinds of work.',
    columns: 3,
    cards: [
      { id: 'general', label: 'General purpose', eyebrow: 't2.micro', body: '1 vCPU, 1 GiB. A balance of everything. Web servers and small apps.', tint: BLUE },
      { id: 'compute', label: 'Compute optimised', eyebrow: 'c5n.large', body: '2 vCPU, 5.25 GiB. Fast processors for batch jobs and number crunching.', tint: ORANGE },
      { id: 'memory', label: 'Memory optimised', eyebrow: 'r5ad.large', body: '2 vCPU, 16 GiB. Large memory for in-memory databases and caches.', tint: VIOLET },
      { id: 'storage', label: 'Storage optimised', eyebrow: 'd2.xlarge', body: '4 vCPU, 30.5 GiB. Fast local disks for data warehouses and big files.', tint: TEAL },
      { id: 'gpu', label: 'GPU instances', eyebrow: 'g2.2xlarge', body: '8 vCPU, 15 GiB. Graphics processors for machine learning and rendering.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'The letter is the family, the number is the generation, and the size comes after the dot.' },
  },
  script: [
    { text: 'Instances are virtual servers, and they come in families tuned for different kinds of work.', reveal: 'intro' },
    { text: 'General purpose instances, such as the t2 micro with one virtual CPU and one gigabyte of memory, give a balance of everything.', reveal: 'general' },
    { text: 'Compute optimised instances have fast processors, for batch processing and heavy calculation.', reveal: 'compute' },
    { text: 'Memory optimised instances carry far more memory per CPU, for in-memory databases and caches.', reveal: 'memory' },
    { text: 'Storage optimised instances have fast local disks, for data warehouses and very large files.', reveal: 'storage' },
    { text: 'And GPU instances add graphics processors, for machine learning and rendering.', reveal: 'gpu' },
    { text: 'Reading a name is simple: the letter is the family, the number is the generation, and the size comes after the dot.', reveal: 'foot', holdMs: 300 },
    { text: 'Now pick the right family for each workload.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which instance family fits each workload?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A small company website with modest, steady traffic.',
        options: [
          { id: 'a', label: 'General purpose', correct: true, feedback: 'Yes. A balanced, low-cost instance is exactly right for a small website.' },
          { id: 'b', label: 'GPU', feedback: 'A website has no use for a graphics processor, and you would pay heavily for one.' },
          { id: 'c', label: 'Memory optimised', feedback: 'Nothing here needs large amounts of memory. A balanced instance will do.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Training a machine learning model on millions of images.',
        options: [
          { id: 'a', label: 'Storage optimised', feedback: 'Fast disks help with reading data, but training is limited by processing power.' },
          { id: 'b', label: 'GPU', correct: true, feedback: 'Correct. Model training is the classic GPU workload.' },
          { id: 'c', label: 'General purpose', feedback: 'It would run, but very slowly. Training needs GPUs.' },
        ],
      },
      {
        id: 'q3',
        scenario: 'An in-memory cache holding a large product catalogue for instant lookups.',
        options: [
          { id: 'a', label: 'Memory optimised', correct: true, feedback: 'Right. A cache lives in memory, so you want the most memory per CPU.' },
          { id: 'b', label: 'Compute optimised', feedback: 'Compute optimised gives you fast CPUs, but a cache needs memory more than processing.' },
          { id: 'c', label: 'GPU', feedback: 'A cache does no graphics or model work, so a GPU would be wasted.' },
        ],
      },
    ],
  },
}

const e05: Slide = {
  id: 'e05-amis',
  navLabel: 'Amazon Machine Images',
  title: 'Amazon Machine',
  subtitle: 'Images (AMIs)',
  sourceSlides: [6],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'An AMI is the starting image for an instance: the operating system and any software already installed. You can then customise it as your own baseline.',
    columns: 4,
    cards: [
      { id: 'amazon', label: 'Amazon', eyebrow: 'Published by AWS', body: 'Amazon Linux, Windows Server and other standard images.', tint: ORANGE },
      { id: 'market', label: 'AWS Marketplace', eyebrow: 'Vendors', body: 'Images from software companies, often with a licence built in.', tint: VIOLET },
      { id: 'own', label: 'Your own', eyebrow: 'Created by you', body: 'An instance you have set up, saved as an image to reuse.', tint: BLUE },
      { id: 'community', label: 'Community', eyebrow: 'Shared publicly', body: 'Free images shared by other AWS users. Check them first.', tint: TEAL },
    ],
    footnote: { id: 'foot', text: 'Examples: a Red Hat Linux AMI, or a Windows Server 2012 AMI with SQL Server already installed.' },
  },
  script: [
    { text: 'An Amazon Machine Image, or AMI, is the starting image for an instance. It holds the operating system and any software already installed, and you can customise it into your own baseline.', reveal: 'intro' },
    { text: 'AMIs come from four places. Amazon publishes standard images, such as Amazon Linux and Windows Server.', reveal: 'amazon' },
    { text: 'The AWS Marketplace offers images from software vendors, often with the licence built in.', reveal: 'market' },
    { text: 'You can create your own, by setting up an instance and saving it as an image to reuse.', reveal: 'own' },
    { text: 'And the community shares free images publicly. Check where one came from before you trust it.', reveal: 'community' },
    { text: 'So you might launch from a Red Hat Linux AMI, or from a Windows Server image with SQL Server already installed.', reveal: 'foot', holdMs: 400 },
  ],
}

const e06: Slide = {
  id: 'e06-ami-contents',
  navLabel: 'What an AMI contains',
  title: 'What an AMI',
  subtitle: 'Contains',
  sourceSlides: [7],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 2,
    cards: [
      { id: 'template', label: 'A template for the root volume', eyebrow: 'Storage', body: 'Either EBS snapshots, or a template for an instance-store-backed AMI.', tint: BLUE },
      { id: 'perms', label: 'Launch permissions', eyebrow: 'Access', body: 'Which AWS accounts are allowed to launch instances from it.', tint: ROSE },
      { id: 'mapping', label: 'A block device mapping', eyebrow: 'Volumes', body: 'Which volumes to attach to the instance when it starts.', tint: ORANGE },
      { id: 'software', label: 'OS, patches and applications', eyebrow: 'Software', body: 'The operating system, its patch level, and the apps you installed.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Save a fully patched, configured image once, and every new server starts identical.' },
  },
  script: [
    { text: 'So what is inside an AMI? First, a template for the root volume: either one or more EBS snapshots, or a template for an instance-store-backed image.', reveal: 'template' },
    { text: 'Second, launch permissions, which control which AWS accounts can launch instances from it.', reveal: 'perms' },
    { text: 'Third, a block device mapping, listing the volumes to attach when the instance starts.', reveal: 'mapping' },
    { text: 'And finally the operating system, its patch level, and any applications you installed.', reveal: 'software' },
    { text: 'Save a fully patched and configured image once, and every new server you launch from it starts out identical.', reveal: 'foot', holdMs: 400 },
  ],
}

const e07: Slide = {
  id: 'e07-features',
  navLabel: 'Key features',
  title: 'Key Features of',
  subtitle: 'Amazon EC2',
  sourceSlides: [8],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 4,
    cards: [
      { id: 'ebs', label: 'EBS volumes', eyebrow: 'Persistent', body: 'Disks that keep their data when the instance stops.', tint: BLUE },
      { id: 'store', label: 'Instance store', eyebrow: 'Temporary', body: 'Fast local disk that is wiped when the instance stops.', tint: ORANGE },
      { id: 'keys', label: 'Key pairs', eyebrow: 'Login', body: 'Secure sign-in: AWS keeps the public key, you keep the private one.', tint: VIOLET },
      { id: 'sg', label: 'Security groups', eyebrow: 'Firewall', body: 'Rules for which traffic may reach the instance.', tint: ROSE },
    ],
    footnote: { id: 'foot', text: 'Each of these gets its own slide later in the module.' },
  },
  script: [
    { text: 'Four features come with every instance. Amazon EBS volumes are persistent disks that keep their data when the instance stops.', reveal: 'ebs' },
    { text: 'Instance store volumes are fast local disks for temporary data, which is lost when the instance stops.', reveal: 'store' },
    { text: 'Key pairs secure your login. AWS stores the public key, and you keep the private key safe.', reveal: 'keys' },
    { text: 'And security groups act as a virtual firewall, deciding which traffic may reach the instance.', reveal: 'sg' },
    { text: 'Each of these gets its own slide later in the module.', reveal: 'foot', holdMs: 300 },
  ],
}

const e08: Slide = {
  id: 'e08-benefits',
  navLabel: 'Benefits of EC2',
  title: 'Benefits of',
  subtitle: 'Amazon EC2',
  sourceSlides: [8],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 2,
    cards: [
      { id: 'servers', label: 'Any kind of server', eyebrow: 'Workloads', body: 'Application servers, web servers, database servers and more.', tint: BLUE },
      { id: 'os', label: 'Windows or Linux', eyebrow: 'Choice', body: 'Pick the operating system and the specification you need.', tint: ORANGE },
      { id: 'regional', label: 'Regional', eyebrow: 'Placement', body: 'Run close to your users, in the Region you choose.', tint: TEAL },
      { id: 'opex', label: 'CAPEX becomes OPEX', eyebrow: 'Finance', body: 'No capital outlay on servers. You pay an operating cost as you go.', tint: MINT },
    ],
  },
  script: [
    { text: 'Why use EC2? You can run almost any kind of server on it: application servers, web servers, and database servers.', reveal: 'servers' },
    { text: 'You choose Windows or Linux, from a wide range of specifications.', reveal: 'os' },
    { text: 'Instances are regional, so you can run them close to the people who use them.', reveal: 'regional' },
    { text: 'And the money works differently. Instead of capital expenditure on servers, you pay an operating expense as you go.', reveal: 'opex', holdMs: 400 },
  ],
}

const e09: Slide = {
  id: 'e09-scaling',
  navLabel: 'Vertical and horizontal scaling',
  title: 'Vertical vs',
  subtitle: 'Horizontal Scaling',
  sourceSlides: [9],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Vertical scaling (scale up)',
      tint: VIOLET,
      items: [
        { id: 'v1', label: 'A bigger instance', body: 'Move from a T2 to a larger M5. Same one server, more power.' },
        { id: 'v2', label: 'Has a ceiling', body: 'Needs a restart, and there is always a largest size.' },
      ],
    },
    right: {
      title: 'Horizontal scaling (scale out)',
      tint: MINT,
      items: [
        { id: 'h1', label: 'More instances', body: 'One M5 becomes several M5s sharing the work.' },
        { id: 'h2', label: 'Built for the cloud', body: 'No downtime, and losing one server does not stop the service.' },
      ],
    },
    footnote: { id: 'foot', text: 'Most cloud applications scale out, adding and removing instances automatically as demand changes.' },
  },
  script: [
    { text: 'There are two ways to add capacity. Vertical scaling, or scaling up, means moving to a bigger instance, for example from a T2 to a larger M5.', reveal: 'v1' },
    { text: 'It usually needs a restart, and there is always a largest size you cannot go beyond.', reveal: 'v2' },
    { text: 'Horizontal scaling, or scaling out, means adding more instances of the same size, so one M5 becomes several.', reveal: 'h1' },
    { text: 'There is no downtime, and if one server fails the others carry on.', reveal: 'h2' },
    { text: 'Most cloud applications scale out, adding and removing instances automatically as demand changes.', reveal: 'foot', holdMs: 400 },
  ],
}

const e10: Slide = {
  id: 'e10-pricing',
  navLabel: 'Pricing options',
  title: 'EC2 Pricing',
  subtitle: 'Options',
  sourceSlides: [10],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'ondemand', label: 'On-Demand', eyebrow: 'Pay as you go', body: 'Pay by the second or hour. No commitment at all.', tint: BLUE },
      { id: 'reserved', label: 'Reserved Instances', eyebrow: '1 or 3 years', body: 'A big discount for committing to a term.', tint: ELECTRIC },
      { id: 'scheduled', label: 'Scheduled Instances', eyebrow: 'Recurring', body: 'Reserved capacity on a repeating schedule, for a one-year term.', tint: VIOLET },
      { id: 'spot', label: 'Spot Instances', eyebrow: 'Spare capacity', body: 'Unused AWS capacity at a steep discount, but it can be taken back.', tint: ORANGE },
      { id: 'dinstance', label: 'Dedicated Instances', eyebrow: 'Single tenant', body: 'Your instances run on hardware no other customer uses.', tint: TEAL },
      { id: 'dhost', label: 'Dedicated Hosts', eyebrow: 'Whole server', body: 'A physical server fully dedicated to you, with visibility of its sockets.', tint: ROSE },
    ],
    footnote: { id: 'foot', text: 'Today: Spot has a simple market price with no bidding, and AWS no longer sells new Scheduled Instances.' },
  },
  script: [
    { text: 'EC2 offers six ways to pay. On-Demand is pay as you go, by the second or by the hour, with no commitment.', reveal: 'ondemand' },
    { text: 'Reserved Instances give you a significant discount in return for a one or three year commitment.', reveal: 'reserved' },
    { text: 'Scheduled Instances reserve capacity on a recurring schedule, for a one-year term.', reveal: 'scheduled' },
    { text: 'Spot Instances use AWS capacity that nobody else is using, at a steep discount. The catch is that AWS can take it back at short notice.', reveal: 'spot' },
    { text: 'Dedicated Instances run on hardware that no other customer shares.', reveal: 'dinstance' },
    { text: 'And a Dedicated Host is a whole physical server, fully dedicated to you.', reveal: 'dhost' },
    { text: 'Two updates since the deck was written. Spot now has a simple market price, with no bidding. And AWS no longer sells new Scheduled Instances.', reveal: 'foot', holdMs: 400 },
  ],
}

const e11: Slide = {
  id: 'e11-reserved-types',
  navLabel: 'Standard and Convertible RIs',
  title: 'Standard vs Convertible',
  subtitle: 'Reserved Instances',
  sourceSlides: [11],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Both are one or three year commitments. The difference is how much you can change afterwards.',
    left: {
      title: 'Standard RI',
      tint: BLUE,
      items: [
        { id: 's1', label: 'Some changes allowed', body: 'Availability zone, scope, network platform, or size within the same type.' },
        { id: 's2', label: 'Can be sold', body: 'List unused reservations on the Reserved Instance Marketplace.' },
      ],
    },
    right: {
      title: 'Convertible RI',
      tint: ORANGE,
      items: [
        { id: 'v1', label: 'Exchange for another', body: 'Change family, type, platform, scope or tenancy, for equal or greater value.' },
        { id: 'v2', label: 'Cannot be sold', body: 'Not eligible for the Reserved Instance Marketplace.' },
      ],
    },
    footnote: { id: 'foot', text: 'Standard gives the biggest discount. Convertible trades some of it for flexibility.' },
  },
  script: [
    { text: 'Reserved Instances come in two kinds. Both are one or three year commitments. The difference is how much you can change afterwards.', reveal: 'intro' },
    { text: 'A Standard Reserved Instance lets you modify some attributes: the availability zone, scope, network platform, or size within the same instance type.', reveal: 's1' },
    { text: 'If you no longer need it, you can sell it on the Reserved Instance Marketplace.', reveal: 's2' },
    { text: 'A Convertible Reserved Instance can be exchanged for one with a different family, type, platform, scope, or tenancy, as long as the new one is of equal or greater value.', reveal: 'v1' },
    { text: 'But it cannot be sold on the marketplace.', reveal: 'v2' },
    { text: 'Standard gives the biggest discount. Convertible trades some of that discount for flexibility.', reveal: 'foot', holdMs: 400 },
  ],
}

const e12: Slide = {
  id: 'e12-pricing-use-cases',
  navLabel: 'Choosing a pricing option',
  title: 'Pricing Options',
  subtitle: 'Use Cases',
  sourceSlides: [12, 13, 14],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'ondemand', label: 'On-Demand', body: 'A short development project that must not be interrupted.', tint: BLUE },
      { id: 'spot', label: 'Spot', body: 'Cost-sensitive, distributed work that can survive interruption.', tint: ORANGE },
      { id: 'reserved', label: 'Reserved', body: 'Steady, business-critical systems that run all year.', tint: ELECTRIC },
      { id: 'scheduled', label: 'Scheduled', body: 'A reporting job that runs six hours a day, four days a week.', tint: VIOLET },
      { id: 'dhost', label: 'Dedicated Host', body: 'A database licensed per CPU socket, where you must see the hardware.', tint: ROSE },
      { id: 'dinstance', label: 'Dedicated Instance', body: 'Security rules demand dedicated hardware, billed per instance.', tint: TEAL },
    ],
  },
  script: [
    { text: 'Here is when to use each option. On-Demand suits a short development project that cannot be interrupted.', reveal: 'ondemand' },
    { text: 'Spot suits cost-sensitive, distributed computing that can cope with being interrupted.', reveal: 'spot' },
    { text: 'Reserved suits steady, business-critical systems that run all year round.', reveal: 'reserved' },
    { text: 'Scheduled suited predictable recurring work, such as a report that runs six hours a day, four days a week.', reveal: 'scheduled' },
    { text: 'A Dedicated Host suits software licensed per CPU socket, because you can see the physical hardware.', reveal: 'dhost' },
    { text: 'And Dedicated Instances suit security-sensitive workloads that need dedicated hardware, billed per instance.', reveal: 'dinstance', holdMs: 300 },
    { text: 'Now match each workload to the pricing option that fits it best.', gate: true },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Which pricing option fits each workload?',
    buckets: [
      { id: 'ondemand', label: 'On-Demand' },
      { id: 'spot', label: 'Spot' },
      { id: 'reserved', label: 'Reserved' },
      { id: 'dhost', label: 'Dedicated Host' },
    ],
    chips: [
      { id: 'c1', label: 'A two-week test of a new app that must not be cut off', bucket: 'ondemand', why: 'On-Demand. Short, unpredictable, and it cannot be interrupted, so no commitment and no Spot.' },
      { id: 'c2', label: 'Rendering thousands of video frames overnight, restartable at any point', bucket: 'spot', why: 'Spot. The job can be interrupted and resumed, so it can use cheap spare capacity.' },
      { id: 'c3', label: 'The company payroll system, running every day for years', bucket: 'reserved', why: 'Reserved. Steady and long-lived, so a one or three year commitment saves the most.' },
      { id: 'c4', label: 'Database software licensed per physical CPU socket', bucket: 'dhost', why: 'Dedicated Host. You get a whole server and can see its sockets, so you can use your existing licences.' },
    ],
    successNote: 'Short and uninterruptible: On-Demand. Flexible: Spot. Steady: Reserved. Per-socket licences: Dedicated Host.',
  },
}

const e13: Slide = {
  id: 'e13-billing-tools',
  navLabel: 'Billing and cost tools',
  title: 'Billing and',
  subtitle: 'Cost Tools',
  sourceSlides: [15, 16],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 2,
    cards: [
      { id: 'second', label: 'Per-second billing', eyebrow: '60 second minimum', body: 'Linux instances are billed by the second, after the first minute.', tint: BLUE },
      { id: 'optimizer', label: 'AWS Compute Optimizer', eyebrow: 'Right-size', body: 'Recommends better instance types from your actual usage.', tint: MINT },
      { id: 'explorer', label: 'AWS Cost Explorer', eyebrow: 'Analyse', body: 'Charts what you have spent and forecasts what is coming.', tint: ORANGE },
      { id: 'calculator', label: 'AWS Pricing Calculator', eyebrow: 'Estimate', body: 'Prices an architecture before you build it.', tint: VIOLET },
    ],
  },
  script: [
    { text: 'EC2 bills by the second, with a minimum of sixty seconds, so you only pay for what you actually run.', reveal: 'second' },
    { text: 'Three tools help you control the cost. AWS Compute Optimizer looks at your real usage and recommends better instance types.', reveal: 'optimizer' },
    { text: 'AWS Cost Explorer charts what you have spent, and forecasts what is coming.', reveal: 'explorer' },
    { text: 'And the AWS Pricing Calculator lets you price an architecture before you build it.', reveal: 'calculator', holdMs: 400 },
  ],
}

const e14: Slide = {
  id: 'e14-savings-plans',
  navLabel: 'Savings Plans',
  title: 'Savings',
  subtitle: 'Plans',
  sourceSlides: [17],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Save up to 72% by committing to a steady amount of spend per hour, for one or three years.',
    steps: [
      { id: 'review', label: 'Review', body: 'See your recommendations in Cost Explorer.', tint: MINT },
      { id: 'choose', label: 'Choose a plan', body: 'Compute Savings Plan, or EC2 Instance Savings Plan.', tint: BLUE },
      { id: 'commit', label: 'Commit', body: 'Set an hourly amount, for example $10 an hour.', tint: ORANGE },
      { id: 'apply', label: 'Save automatically', body: 'Discounts apply across EC2, Fargate and Lambda.', tint: VIOLET },
    ],
    footnote: { id: 'foot', text: 'Unlike a Reserved Instance, the discount follows your usage across family, size, OS, tenancy and Region.' },
  },
  script: [
    { text: 'Savings Plans are a newer, more flexible way to save, up to seventy two percent, by committing to a steady amount of spend per hour for one or three years.', reveal: 'intro' },
    { text: 'You start by reviewing the recommendations in Cost Explorer.', reveal: 'review' },
    { text: 'Then choose a plan: a Compute Savings Plan, or an EC2 Instance Savings Plan.', reveal: 'choose' },
    { text: 'You commit to an hourly amount, for example ten dollars an hour.', reveal: 'commit' },
    { text: 'And the discounts apply automatically to your usage across EC2, Fargate, and Lambda.', reveal: 'apply' },
    { text: 'Unlike a Reserved Instance, the discount follows your usage even as you change family, size, operating system, tenancy, or Region.', reveal: 'foot', holdMs: 400 },
  ],
}

const e15: Slide = {
  id: 'e15-ip-addresses',
  navLabel: 'IP addresses',
  title: 'Public, Private and',
  subtitle: 'Elastic IP Addresses',
  sourceSlides: [18, 19],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'public', label: 'Public IP', eyebrow: 'Internet facing', body: 'Reachable from the internet. Used by web servers. Changes when the instance stops.', tint: ORANGE },
      { id: 'private', label: 'Private IP', eyebrow: 'Inside the VPC', body: 'Only reachable inside your network. Used by app and database tiers.', tint: BLUE },
      { id: 'elastic', label: 'Elastic IP', eyebrow: 'Fixed', body: 'A public address you own. It stays the same through stop and start.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'A typical design: web servers in public subnets behind a load balancer, databases in private subnets such as 10.0.2.0/24.' },
  },
  script: [
    { text: 'Instances can have three kinds of address. A public IP is reachable from the internet, so web servers use one. It changes whenever the instance is stopped and started.', reveal: 'public' },
    { text: 'A private IP is only reachable inside your virtual private cloud, which is right for application and database servers.', reveal: 'private' },
    { text: 'An Elastic IP is a public address you allocate to your account. It stays the same when the instance stops and starts.', reveal: 'elastic' },
    { text: 'A typical design puts web servers in public subnets behind a load balancer, and databases in private subnets that the internet cannot reach.', reveal: 'foot', holdMs: 400 },
  ],
}

const e16: Slide = {
  id: 'e16-security-groups',
  navLabel: 'Security groups',
  title: 'EC2 Security',
  subtitle: 'Groups',
  sourceSlides: [20],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A security group is a virtual firewall around your instance.',
    columns: 3,
    cards: [
      { id: 'rules', label: 'Inbound and outbound rules', eyebrow: 'Traffic', body: 'Each rule names a port, a protocol, and a source or destination.', tint: BLUE },
      { id: 'allow', label: 'Allow only', eyebrow: 'Default deny', body: 'Anything you have not allowed is blocked.', tint: ROSE },
      { id: 'example', label: 'Example', eyebrow: 'SSH', body: 'Allow port 22 only from your office address, a.b.c.d/z. Block everyone else.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Security groups are stateful: if a request is allowed in, the reply is allowed out automatically.' },
  },
  script: [
    { text: 'A security group is a virtual firewall around your instance.', reveal: 'intro' },
    { text: 'It has inbound and outbound rules, and each rule names a port, a protocol, and a source or destination.', reveal: 'rules' },
    { text: 'Rules only ever allow traffic. Anything you have not allowed is blocked.', reveal: 'allow' },
    { text: 'For example, allow port twenty two, for SSH, only from your office IP address, and everyone else is kept out.', reveal: 'example' },
    { text: 'Security groups are stateful, which means if a request is allowed in, the reply is allowed back out automatically.', reveal: 'foot', holdMs: 400 },
  ],
}

const e17: Slide = {
  id: 'e17-ports',
  navLabel: 'Common ports',
  title: 'Ports to',
  subtitle: 'Know',
  sourceSlides: [21],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'ssh', label: 'SSH', eyebrow: 'Port 22', body: 'Log in to a Linux instance.', tint: BLUE },
      { id: 'ftp', label: 'FTP', eyebrow: 'Port 21', body: 'Upload files to a file share.', tint: ORANGE },
      { id: 'sftp', label: 'SFTP', eyebrow: 'Port 22', body: 'Upload files securely, over SSH.', tint: VIOLET },
      { id: 'http', label: 'HTTP', eyebrow: 'Port 80', body: 'Unsecured websites.', tint: ROSE },
      { id: 'https', label: 'HTTPS', eyebrow: 'Port 443', body: 'Secured websites. The norm today.', tint: MINT },
      { id: 'rdp', label: 'RDP', eyebrow: 'Port 3389', body: 'Remote Desktop, to log in to Windows.', tint: TEAL },
    ],
  },
  script: [
    { text: 'These are the ports you will open most often. Port twenty two is SSH, used to log in to a Linux instance.', reveal: 'ssh' },
    { text: 'Port twenty one is FTP, for uploading files to a file share.', reveal: 'ftp' },
    { text: 'SFTP also uses port twenty two, because it sends files securely over SSH.', reveal: 'sftp' },
    { text: 'Port eighty is HTTP, for unsecured websites.', reveal: 'http' },
    { text: 'Port four four three is HTTPS, for secured websites, which is the norm today.', reveal: 'https' },
    { text: 'And port three three eight nine is RDP, Remote Desktop, for logging in to Windows instances.', reveal: 'rdp', holdMs: 300 },
    { text: 'Now decide which rule each situation needs.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which inbound rule does each instance need?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A public shop website that customers reach over a secure connection.',
        options: [
          { id: 'a', label: 'Port 443 from anywhere', correct: true, feedback: 'Yes. HTTPS on port 443, open to everyone, because customers can be anywhere.' },
          { id: 'b', label: 'Port 22 from anywhere', feedback: 'That opens SSH to the whole internet, which is exactly what attackers look for.' },
          { id: 'c', label: 'Port 3389 from your office', feedback: 'That is Remote Desktop for admins. Customers need HTTPS.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'An administrator needs to log in to a Windows server from the office.',
        options: [
          { id: 'a', label: 'Port 80 from anywhere', feedback: 'Port 80 serves unsecured web pages. It gives nobody a login.' },
          { id: 'b', label: 'Port 3389 from the office IP only', correct: true, feedback: 'Correct. RDP is port 3389, and limiting it to the office address keeps everyone else out.' },
          { id: 'c', label: 'Port 3389 from anywhere', feedback: 'Right port, wrong source. Remote Desktop open to the world is a serious risk.' },
        ],
      },
    ],
  },
}

const e18: Slide = {
  id: 'e18-lifecycle',
  navLabel: 'Instance lifecycle',
  title: 'The Instance',
  subtitle: 'Lifecycle',
  sourceSlides: [22],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Every instance moves through a small set of states, starting from an AMI.',
    steps: [
      { id: 'pending', label: 'Pending', body: 'Launched from an AMI. Being prepared.', tint: GOLD },
      { id: 'running', label: 'Running', body: 'Ready to use. Billing starts. A reboot keeps it here.', tint: MINT },
      { id: 'stopped', label: 'Stopped', body: 'Stop or hibernate. Start again later. EBS-backed only.', tint: ORANGE },
      { id: 'terminated', label: 'Terminated', body: 'Shut down and deleted for good.', tint: ROSE },
    ],
    footnote: { id: 'foot', text: 'Stopped and started, an instance goes back through Pending. Terminated, it cannot come back.' },
  },
  script: [
    { text: 'Every instance moves through a small set of states, starting from an AMI.', reveal: 'intro' },
    { text: 'When you launch it, it is pending while AWS prepares it.', reveal: 'pending' },
    { text: 'Then it is running, ready to use, and billing begins. Rebooting it briefly passes through rebooting and returns it to running.', reveal: 'running' },
    { text: 'You can stop it, or stop and hibernate it, and start it again later. Only instances backed by EBS can do this.', reveal: 'stopped' },
    { text: 'Terminating it shuts it down and deletes it for good, whether it was running or stopped.', reveal: 'terminated' },
    { text: 'When a stopped instance is started, it goes back through pending. Once terminated, it cannot come back.', reveal: 'foot', holdMs: 400 },
  ],
}

const e19: Slide = {
  id: 'e19-protection-resize',
  navLabel: 'Protection and resizing',
  title: 'Termination Protection',
  subtitle: 'and Resizing',
  sourceSlides: [23],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Termination protection',
      tint: ROSE,
      items: [
        { id: 'p1', label: 'Stops accidental deletes', body: 'Nobody can terminate the instance until the setting is turned off.' },
        { id: 'p2', label: 'Does not cover', body: 'An OS shutdown on instance-store-backed instances, Auto Scaling, or Spot reclaims.' },
      ],
    },
    right: {
      title: 'Changing the instance type',
      tint: BLUE,
      items: [
        { id: 'r1', label: 'Stop the instance', body: 'An EBS-backed instance keeps its data while stopped.' },
        { id: 'r2', label: 'Change type, then start', body: 'Pick the new type, apply it, and start the instance again.' },
      ],
    },
  },
  script: [
    { text: 'Termination protection stops anyone deleting an instance by accident. It cannot be terminated until the setting is switched off.', reveal: 'p1' },
    { text: 'It has limits. It does not stop an operating system shutdown on an instance-store-backed instance, a termination by Auto Scaling, or Spot capacity being reclaimed.', reveal: 'p2' },
    { text: 'To change an instance type, first stop the instance. An EBS-backed instance keeps its data while it is stopped.', reveal: 'r1' },
    { text: 'Then choose the new type, apply it, and start the instance again.', reveal: 'r2', holdMs: 300 },
    { text: 'Check your understanding of the lifecycle.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'What happens to the instance?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'You stop an EBS-backed instance overnight and start it in the morning. What about the data on its EBS root volume?',
        options: [
          { id: 'a', label: 'It is still there', correct: true, feedback: 'Correct. EBS volumes persist through a stop, which is why only EBS-backed instances can be stopped.' },
          { id: 'b', label: 'It is wiped', feedback: 'That is what happens to instance store data. EBS keeps its data.' },
          { id: 'c', label: 'It moves to S3', feedback: 'Nothing moves. The volume simply stays attached and waits.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'An instance with termination protection is part of an Auto Scaling group that scales in. Is it safe?',
        options: [
          { id: 'a', label: 'Yes, protection always wins', feedback: 'Termination protection does not apply to Auto Scaling terminations.' },
          { id: 'b', label: 'No, Auto Scaling can still terminate it', correct: true, feedback: 'Right. Auto Scaling ignores termination protection. Use scale-in protection for that.' },
          { id: 'c', label: 'Only if it is stopped first', feedback: 'Stopping makes no difference to Auto Scaling here.' },
        ],
      },
    ],
  },
}

const e20: Slide = {
  id: 'e20-nitro-enclaves',
  navLabel: 'Nitro Enclaves',
  title: 'AWS Nitro',
  subtitle: 'Enclaves',
  sourceSlides: [24, 25],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'An enclave is an isolated compute environment carved out of a parent EC2 instance, for your most sensitive data.',
    columns: 4,
    cards: [
      { id: 'isolated', label: 'Isolated', eyebrow: 'CPU and memory', body: 'Its own CPU and memory. Even the parent cannot look inside.', tint: VIOLET },
      { id: 'channel', label: 'Secure channel', eyebrow: 'Local only', body: 'No network and no storage. It talks only to its parent.', tint: BLUE },
      { id: 'uses', label: 'Use cases', eyebrow: 'Examples', body: 'Card data, health records, key management, multi-party computation.', tint: MINT },
      { id: 'attest', label: 'Attestation', eyebrow: 'Proof', body: 'It can prove what code it runs before receiving secrets.', tint: ORANGE },
    ],
  },
  script: [
    { text: 'AWS Nitro Enclaves create an isolated compute environment inside a parent EC2 instance, for your most sensitive data.', reveal: 'intro' },
    { text: 'The enclave gets its own CPU and memory, and even the parent instance cannot look inside.', reveal: 'isolated' },
    { text: 'It has no network access and no persistent storage. It talks only to its parent, through a secure local channel.', reveal: 'channel' },
    { text: 'Typical uses are processing card or health data, managing encryption keys, and multi-party computation.', reveal: 'uses' },
    { text: 'And it can prove exactly what code it is running before anyone trusts it with a secret.', reveal: 'attest', holdMs: 400 },
  ],
}

const e21: Slide = {
  id: 'e21-metadata',
  navLabel: 'Instance metadata',
  title: 'Instance',
  subtitle: 'Metadata',
  sourceSlides: [26],
  scene: 'code',
  data: {
    kind: 'code',
    filename: 'terminal',
    intro: 'Every instance can ask a special local address about itself.',
    code: [
      '# Run this from inside the instance',
      'curl http://169.254.169.254/latest/meta-data/',
      '',
      'ami-id',
      'hostname',
      'instance-id',
      'instance-type',
      'local-ipv4',
      'public-ipv4',
      'security-groups',
    ],
    highlights: [
      { id: 'address', lines: [2, 2], label: 'The metadata address', body: '169.254.169.254 only answers from inside the instance.' },
      { id: 'identity', lines: [4, 7], label: 'Who am I?', body: 'The AMI it came from, its name, ID and instance type.' },
      { id: 'network', lines: [8, 10], label: 'Where am I?', body: 'Its private and public addresses, and its security groups.' },
    ],
    footnote: { id: 'foot', text: 'Scripts use this to configure themselves without hard-coding anything.' },
  },
  script: [
    { text: 'Every instance can ask a special local address about itself. This is called instance metadata.', reveal: 'intro' },
    { text: 'From inside the instance, you request one six nine dot two five four dot one six nine dot two five four. That address only answers from inside the instance.', reveal: 'address' },
    { text: 'It tells the instance who it is: the AMI it was launched from, its hostname, its ID, and its instance type.', reveal: 'identity' },
    { text: 'And where it is: its private and public IP addresses, and its security groups.', reveal: 'network' },
    { text: 'Scripts use this to configure themselves without hard-coding anything.', reveal: 'foot', holdMs: 400 },
  ],
}

const e22: Slide = {
  id: 'e22-user-data',
  navLabel: 'User data',
  title: 'User Data',
  subtitle: 'Bootstrapping',
  sourceSlides: [27],
  scene: 'code',
  data: {
    kind: 'code',
    filename: 'user-data.sh',
    intro: 'User data is a script you hand to an instance at launch. It runs automatically the first time it boots.',
    code: [
      '#!/bin/bash',
      '# Runs once, as root, on first boot',
      'yum update -y',
      'yum install -y httpd',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "Hello from $(hostname -f)" > /var/www/html/index.html',
    ],
    highlights: [
      { id: 'shebang', lines: [1, 2], label: 'A shell script', body: 'Runs as root on the first boot only.' },
      { id: 'install', lines: [3, 4], label: 'Patch and install', body: 'Updates the OS, then installs a web server.' },
      { id: 'start', lines: [5, 6], label: 'Start the service', body: 'Now, and on every future reboot.' },
      { id: 'page', lines: [7, 7], label: 'Publish a page', body: 'The server is live as soon as the instance is.' },
    ],
    footnote: { id: 'foot', text: 'Metadata is what the instance can read about itself. User data is what you tell it to do.' },
  },
  script: [
    { text: 'User data is a script you hand to an instance when you launch it. It runs automatically the first time the instance boots. This is called bootstrapping.', reveal: 'intro' },
    { text: 'Here it is a shell script, and it runs as the root user, once, on first boot.', reveal: 'shebang' },
    { text: 'It updates the operating system, then installs the Apache web server.', reveal: 'install' },
    { text: 'It starts the web server, and sets it to start again after every reboot.', reveal: 'start' },
    { text: 'And it writes a simple home page, so the website is live as soon as the instance is.', reveal: 'page' },
    { text: 'Remember the difference. Metadata is what the instance can read about itself. User data is what you tell it to do.', reveal: 'foot', holdMs: 400 },
  ],
}

const e23: Slide = {
  id: 'e23-imds-versions',
  navLabel: 'IMDSv1 and IMDSv2',
  title: 'IMDSv1 vs',
  subtitle: 'IMDSv2',
  sourceSlides: [28],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'IMDSv1',
      tint: ROSE,
      items: [
        { id: 'v1a', label: 'Request and response', body: 'Any request to the address gets an answer. Simple, and easy to abuse.' },
        { id: 'v1b', label: 'Open to SSRF', body: 'A tricked web app can fetch the instance credentials for an attacker.' },
      ],
    },
    right: {
      title: 'IMDSv2',
      tint: MINT,
      items: [
        { id: 'v2a', label: 'Session token first', body: 'A PUT request gets a token, valid for up to six hours.' },
        { id: 'v2b', label: 'Blocks SSRF', body: 'Every request must carry the token, which a forged request cannot get.' },
      ],
    },
    footnote: { id: 'foot', text: 'In 2019, an attack on IMDSv1 exposed data on over 100 million Capital One customers. Require IMDSv2.' },
  },
  script: [
    { text: 'There are two versions of the metadata service. Version one is simple request and response: anything that asks, gets an answer.', reveal: 'v1a' },
    { text: 'That makes it open to server side request forgery, where a vulnerable web app is tricked into fetching the instance credentials for an attacker.', reveal: 'v1b' },
    { text: 'Version two adds a session. You first make a PUT request to get a token, valid for up to six hours.', reveal: 'v2a' },
    { text: 'Every metadata request must then carry that token, and a forged request cannot obtain one.', reveal: 'v2b' },
    { text: 'This matters. In twenty nineteen, an attack through version one exposed data on more than a hundred million Capital One customers. Require version two on every instance.', reveal: 'foot', holdMs: 500 },
  ],
}

const e24: Slide = {
  id: 'e24-connecting',
  navLabel: 'Connecting with SSH',
  title: 'Connecting with',
  subtitle: 'EC2 Instance Connect',
  sourceSlides: [29],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'keypair', label: 'Key pair at launch', eyebrow: 'Required', body: 'Choose a key pair when you launch, so you can log in with its private key.', tint: BLUE },
      { id: 'reuse', label: 'Same or different keys', eyebrow: 'Your policy', body: 'One key for every instance, or a separate key for each. It depends on your security needs.', tint: ORANGE },
      { id: 'connect', label: 'EC2 Instance Connect', eyebrow: 'SSH', body: 'Pushes a short-lived key for you, and every connection is logged.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Keep private keys out of email and code. Lose the private key and you lose that way in.' },
  },
  script: [
    { text: 'To log in to an instance, you choose a key pair when you launch it, and connect using its private key.', reveal: 'keypair' },
    { text: 'You can use the same key pair for all your instances, or a different one for each, depending on how you manage security.', reveal: 'reuse' },
    { text: 'EC2 Instance Connect makes SSH simpler. It pushes a short-lived key to the instance for you, and records every connection.', reveal: 'connect' },
    { text: 'Keep private keys out of email and out of code. If you lose one, you lose that way in.', reveal: 'foot', holdMs: 400 },
  ],
}

const e25: Slide = {
  id: 'e25-placement-groups',
  navLabel: 'Placement groups',
  title: 'Placement',
  subtitle: 'Groups',
  sourceSlides: [30, 31],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A placement group controls where your instances sit on the physical hardware.',
    columns: 3,
    cards: [
      { id: 'cluster', label: 'Cluster', eyebrow: 'Close together', body: 'Packed into one AZ for the lowest latency. HPC and machine learning.', tint: BLUE },
      { id: 'partition', label: 'Partition', eyebrow: 'Separate racks', body: 'Each partition has its own racks. Hadoop, Cassandra, Kafka. Up to 7 per AZ.', tint: ORANGE },
      { id: 'spread', label: 'Spread', eyebrow: 'Apart', body: 'Every instance on distinct hardware. Up to 7 running per AZ per group.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Cluster for speed, partition for large distributed systems, spread for a few critical servers.' },
  },
  script: [
    { text: 'A placement group controls where your instances sit on AWS hardware.', reveal: 'intro' },
    { text: 'A cluster placement group packs instances close together in one availability zone, for the lowest latency. It suits high performance computing and machine learning.', reveal: 'cluster' },
    { text: 'A partition placement group gives each partition its own racks, so one hardware failure only affects one partition. It suits Hadoop, Cassandra, and Kafka, with up to seven partitions per zone.', reveal: 'partition' },
    { text: 'A spread placement group puts every instance on distinct hardware, for high availability, with up to seven running instances per zone in each group.', reveal: 'spread' },
    { text: 'So, cluster for speed, partition for large distributed systems, and spread for a few critical servers.', reveal: 'foot', holdMs: 300 },
    { text: 'Choose the right placement group for each case.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which placement group fits?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A weather simulation where instances exchange data constantly and every microsecond counts.',
        options: [
          { id: 'a', label: 'Cluster', correct: true, feedback: 'Yes. Packing them together in one AZ gives the lowest latency between instances.' },
          { id: 'b', label: 'Spread', feedback: 'Spread puts instances far apart, which adds latency.' },
          { id: 'c', label: 'Partition', feedback: 'Partition is about fault isolation for big data systems, not the lowest latency.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Three critical servers that must never all fail from one hardware fault.',
        options: [
          { id: 'a', label: 'Cluster', feedback: 'Cluster puts them close together, so one fault could take out all three.' },
          { id: 'b', label: 'Spread', correct: true, feedback: 'Correct. Each instance sits on distinct hardware, so a single failure only affects one.' },
          { id: 'c', label: 'No placement group', feedback: 'Without one, AWS does not guarantee the three are on separate hardware.' },
        ],
      },
    ],
  },
}

const e26: Slide = {
  id: 'e26-placement-practice',
  navLabel: 'Placement best practice',
  title: 'Placement Group',
  subtitle: 'Best Practices',
  sourceSlides: [32],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'capacity', label: 'Reserve capacity', body: 'Use capacity reservations so the instances you need are available.', tint: BLUE },
      { id: 'network', label: 'Enhanced networking', body: 'Turn it on for the best throughput between instances.', tint: ELECTRIC },
      { id: 'fault', label: 'Plan for failure', body: 'Design the application to survive losing an instance.', tint: ROSE },
      { id: 'monitor', label: 'Monitor', body: 'Watch performance with Amazon CloudWatch.', tint: ORANGE },
      { id: 'combine', label: 'Combine services', body: 'Pair with Elastic Load Balancing and Auto Scaling.', tint: MINT },
    ],
  },
  script: [
    { text: 'A few best practices. Use capacity reservations, so the instances you need are there when you launch.', reveal: 'capacity' },
    { text: 'Turn on enhanced networking, for the best throughput between instances.', reveal: 'network' },
    { text: 'Design the application to survive losing an instance.', reveal: 'fault' },
    { text: 'Monitor performance with Amazon CloudWatch.', reveal: 'monitor' },
    { text: 'And combine placement groups with Elastic Load Balancing and Auto Scaling.', reveal: 'combine', holdMs: 400 },
  ],
}

const e27: Slide = {
  id: 'e27-network-interfaces',
  navLabel: 'ENI, ENA and EFA',
  title: 'EC2 Network',
  subtitle: 'Interfaces',
  sourceSlides: [33],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'eni', label: 'ENI', eyebrow: 'Elastic Network Interface', body: 'A virtual network card. Add more to separate networks, such as management traffic.', tint: BLUE },
      { id: 'ena', label: 'ENA', eyebrow: 'Elastic Network Adapter', body: 'Enhanced networking: higher bandwidth and lower latency.', tint: ORANGE },
      { id: 'efa', label: 'EFA', eyebrow: 'Elastic Fabric Adapter', body: 'Very low latency between instances, for HPC and machine learning.', tint: VIOLET },
    ],
  },
  script: [
    { text: 'Instances connect to the network through three kinds of interface. An Elastic Network Interface, or ENI, is a virtual network card. Add extra ones to keep networks separate, for example management traffic.', reveal: 'eni' },
    { text: 'The Elastic Network Adapter, or ENA, provides enhanced networking, with higher bandwidth and lower latency.', reveal: 'ena' },
    { text: 'And the Elastic Fabric Adapter, or EFA, gives very low latency between instances, for high performance computing and machine learning.', reveal: 'efa', holdMs: 400 },
  ],
}

const e28: Slide = {
  id: 'e28-nat',
  navLabel: 'NAT gateway and NAT instance',
  title: 'NAT Gateway vs',
  subtitle: 'NAT Instance',
  sourceSlides: [34, 35, 36, 37, 38],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Both let instances in a private subnet reach the internet, while nothing on the internet can reach them.',
    left: {
      title: 'NAT gateway',
      tint: MINT,
      items: [
        { id: 'g1', label: 'Managed by AWS', body: 'Highly available within an AZ, and scales automatically.' },
        { id: 'g2', label: 'One per AZ', body: 'Needs an Elastic IP. Charged per hour plus data processed.' },
      ],
    },
    right: {
      title: 'NAT instance',
      tint: ORANGE,
      items: [
        { id: 'n1', label: 'An EC2 you manage', body: 'You handle patching, failover and scaling yourself.' },
        { id: 'n2', label: 'Full control', body: 'Can use security groups, and can double as a bastion host.' },
      ],
    },
    footnote: { id: 'foot', text: 'Choose the NAT gateway unless you have a specific reason not to.' },
  },
  script: [
    { text: 'NAT lets instances in a private subnet reach the internet, for updates for example, while nothing on the internet can start a connection to them.', reveal: 'intro' },
    { text: 'A NAT gateway is managed by AWS. It is highly available within an availability zone, and scales automatically.', reveal: 'g1' },
    { text: 'For resilience you create one in each zone. Each needs an Elastic IP, and you pay per hour plus the data processed.', reveal: 'g2' },
    { text: 'A NAT instance is an EC2 instance you run yourself, so patching, failover, and scaling are your job.', reveal: 'n1' },
    { text: 'In return you get full control. It can use security groups, and can double as a bastion host.', reveal: 'n2' },
    { text: 'Choose the NAT gateway unless you have a specific reason not to.', reveal: 'foot', holdMs: 400 },
  ],
}

const e29: Slide = {
  id: 'e29-ebs',
  navLabel: 'Elastic Block Store',
  title: 'Amazon Elastic',
  subtitle: 'Block Store (EBS)',
  sourceSlides: [39, 40],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'EBS is durable block storage for EC2: a network disk you attach to an instance.',
    columns: 4,
    cards: [
      { id: 'durable', label: 'Durable', eyebrow: 'Replicated', body: 'Copied within its AZ to protect against failure.', tint: BLUE },
      { id: 'az', label: 'Tied to one AZ', eyebrow: 'Location', body: 'It can only attach to instances in the same zone.', tint: ROSE },
      { id: 'encrypted', label: 'Encrypted', eyebrow: 'AES-256', body: 'Data at rest and in transit, with keys in KMS.', tint: VIOLET },
      { id: 'independent', label: 'Independent', eyebrow: 'Lifespan', body: 'Detach it from one instance and attach it to another.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'A volume in zone A cannot attach to an instance in zone B. Use a snapshot to move it.' },
  },
  script: [
    { text: 'Amazon Elastic Block Store, or EBS, is durable block storage for EC2. Think of it as a network disk you attach to an instance, ideal for databases.', reveal: 'intro' },
    { text: 'It is durable, because each volume is replicated within its availability zone.', reveal: 'durable' },
    { text: 'It is tied to that one zone, and can only attach to instances in the same zone.', reveal: 'az' },
    { text: 'It is encrypted with AES two five six, both at rest and in transit.', reveal: 'encrypted' },
    { text: 'And its life is independent of the instance, so you can detach it and attach it to another.', reveal: 'independent' },
    { text: 'Remember: a volume in zone A cannot attach to an instance in zone B. To move it, take a snapshot.', reveal: 'foot', holdMs: 400 },
  ],
}

const e30: Slide = {
  id: 'e30-ebs-types',
  navLabel: 'EBS volume types',
  title: 'EBS Volume',
  subtitle: 'Types',
  sourceSlides: [43],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'SSD volumes are measured in IOPS, operations per second. HDD volumes are measured in throughput, MB per second.',
    columns: 4,
    cards: [
      { id: 'io1', label: 'io1 Provisioned IOPS SSD', eyebrow: 'Up to 64,000 IOPS', body: 'Critical, busy databases. 4 GB to 16 TB.', tint: VIOLET },
      { id: 'gp2', label: 'gp2 General Purpose SSD', eyebrow: 'Up to 16,000 IOPS', body: 'Boot volumes, dev and test. 1 GB to 16 TB.', tint: BLUE },
      { id: 'st1', label: 'st1 Throughput Optimised HDD', eyebrow: 'Up to 500 MB/s', body: 'Big data, data warehouses, logs.', tint: ORANGE },
      { id: 'sc1', label: 'sc1 Cold HDD', eyebrow: 'Up to 250 MB/s', body: 'Rarely read data, at the lowest cost.', tint: TEAL },
    ],
    footnote: { id: 'foot', text: 'Today gp3 is the default general purpose volume: cheaper than gp2, with performance you set separately.' },
  },
  script: [
    { text: 'EBS has two families. SSD volumes are measured in IOPS, operations per second. Hard disk volumes are measured in throughput, megabytes per second.', reveal: 'intro' },
    { text: 'io1, Provisioned IOPS SSD, delivers up to sixty four thousand IOPS, for critical, busy databases.', reveal: 'io1' },
    { text: 'gp2, General Purpose SSD, gives up to sixteen thousand IOPS, and suits boot volumes, development, and test.', reveal: 'gp2' },
    { text: 'st1, Throughput Optimised hard disk, reaches five hundred megabytes a second, for big data and logs.', reveal: 'st1' },
    { text: 'And sc1, Cold hard disk, is the cheapest, for data you rarely read.', reveal: 'sc1' },
    { text: 'One update: today gp3 is the default general purpose volume. It costs less than gp2, and you set its performance separately.', reveal: 'foot', holdMs: 400 },
  ],
}

const e31: Slide = {
  id: 'e31-root-volumes',
  navLabel: 'Root volumes',
  title: 'EC2 Root',
  subtitle: 'Volumes',
  sourceSlides: [41],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'EBS-backed',
      tint: BLUE,
      items: [
        { id: 'b1', label: 'Boots in under a minute', body: 'Root volume up to 16 TiB.' },
        { id: 'b2', label: 'Can be stopped', body: 'The root volume waits in EBS. Change type while stopped.' },
        { id: 'b3', label: 'Deleted on termination', body: 'By default, unless you change it. Other EBS volumes stay.' },
      ],
    },
    right: {
      title: 'Instance store-backed',
      tint: ORANGE,
      items: [
        { id: 's1', label: 'Boots in under five minutes', body: 'Root volume up to 10 GiB, loaded from S3.' },
        { id: 's2', label: 'Cannot be stopped', body: 'It is either running or terminated.' },
        { id: 's3', label: 'Fixed for life', body: 'Its attributes cannot change after launch.' },
      ],
    },
  },
  script: [
    { text: 'The root volume is the disk an instance boots from, and it comes in two kinds. An EBS-backed instance usually boots in under a minute, with a root volume of up to sixteen tebibytes.', reveal: 'b1' },
    { text: 'It can be stopped, with the root volume kept safe in EBS, and you can change the instance type while it is stopped.', reveal: 'b2' },
    { text: 'By default the root volume is deleted when the instance terminates, though other EBS volumes remain.', reveal: 'b3' },
    { text: 'An instance store-backed instance takes up to five minutes to boot, because its image is fetched from S3, and its root volume is limited to ten gibibytes.', reveal: 's1' },
    { text: 'It cannot be stopped. It is either running or terminated.', reveal: 's2' },
    { text: 'And its attributes are fixed for the life of the instance.', reveal: 's3', holdMs: 400 },
  ],
}

const e32: Slide = {
  id: 'e32-instance-store',
  navLabel: 'Instance store volumes',
  title: 'Instance Store',
  subtitle: 'Volumes',
  sourceSlides: [42],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Also called ephemeral storage: temporary block storage physically attached to the host computer, and included in the instance price.',
    left: {
      title: 'Good for',
      tint: MINT,
      items: [
        { id: 'g1', label: 'Frequently changing data', body: 'Buffers, caches, scratch space.' },
        { id: 'g2', label: 'Replicated data', body: 'Data copied across a farm of instances.' },
      ],
    },
    right: {
      title: 'Data is lost if',
      tint: ROSE,
      items: [
        { id: 'l1', label: 'The disk fails', body: 'The underlying drive stops working.' },
        { id: 'l2', label: 'The instance stops or terminates', body: 'A reboot is fine. A stop is not.' },
      ],
    },
  },
  script: [
    { text: 'Instance store, also called ephemeral storage, is temporary block storage physically attached to the host computer. It is included in the price of the instance, which makes it cost effective.', reveal: 'intro' },
    { text: 'It is ideal for information that changes frequently, such as buffers, caches, and scratch data.', reveal: 'g1' },
    { text: 'And for data that is replicated across a farm of instances, so losing one copy does not matter.', reveal: 'g2' },
    { text: 'But the data is lost if the underlying disk fails.', reveal: 'l1' },
    { text: 'Or if the instance stops or terminates. A reboot keeps the data. A stop does not.', reveal: 'l2', holdMs: 400 },
  ],
}

const e33: Slide = {
  id: 'e33-snapshots',
  navLabel: 'EBS snapshots',
  title: 'Amazon EBS',
  subtitle: 'Snapshots',
  sourceSlides: [44, 45],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'A snapshot is a point-in-time copy of a volume, kept in S3.',
    steps: [
      { id: 'create', label: 'Create', body: 'From the console, CLI or SDK.', tint: BLUE },
      { id: 'automate', label: 'Automate', body: 'Schedule and expire them with Data Lifecycle Manager.', tint: VIOLET },
      { id: 'copy', label: 'Copy or share', body: 'To another Region, or another AWS account.', tint: ORANGE },
      { id: 'restore', label: 'Restore', body: 'Create new volumes and launch instances.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Snapshots give you backup, disaster recovery, and a way to move data between zones, Regions and accounts.' },
  },
  script: [
    { text: 'An EBS snapshot is a point-in-time copy of a volume, stored in S3.', reveal: 'intro' },
    { text: 'You create one from the console, the command line, or an SDK.', reveal: 'create' },
    { text: 'The recommended approach is to automate them, with Amazon Data Lifecycle Manager creating and expiring snapshots on a schedule.', reveal: 'automate' },
    { text: 'You can copy a snapshot to another Region, or share it with another AWS account, such as a branch office.', reveal: 'copy' },
    { text: 'And you restore from it by creating new volumes and launching instances.', reveal: 'restore' },
    { text: 'So snapshots give you backup, disaster recovery, and a way to move data between zones, Regions, and accounts.', reveal: 'foot', holdMs: 400 },
  ],
}

const e34: Slide = {
  id: 'e34-file-storage',
  navLabel: 'EFS and FSx',
  title: 'Shared File',
  subtitle: 'Storage',
  sourceSlides: [46, 47, 48],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'When many instances need the same files at once, a single EBS volume will not do.',
    columns: 3,
    cards: [
      { id: 'efs', label: 'Amazon EFS', eyebrow: 'Linux · NFS', body: 'Shared file system across many AZs, used by many instances at once.', tint: BLUE },
      { id: 'lustre', label: 'FSx for Lustre', eyebrow: 'High performance', body: 'Millions of IOPS, sub-millisecond latency, for HPC and ML.', tint: VIOLET },
      { id: 'windows', label: 'FSx for Windows File Server', eyebrow: 'Windows · SMB', body: 'Fully managed Windows shares, with backups and encryption.', tint: ORANGE },
    ],
  },
  script: [
    { text: 'When many instances need the same files at the same time, a single EBS volume will not do. You need shared file storage.', reveal: 'intro' },
    { text: 'Amazon EFS is a shared file system for Linux, using the NFS protocol. It spans multiple availability zones, and many instances can use it at once.', reveal: 'efs' },
    { text: 'Amazon FSx for Lustre is built for speed: millions of IOPS and sub-millisecond latency, for high performance computing and machine learning.', reveal: 'lustre' },
    { text: 'And Amazon FSx for Windows File Server provides fully managed Windows file shares over SMB, with backups and encryption built in.', reveal: 'windows', holdMs: 300 },
    { text: 'Now sort each need to the storage that fits it.', gate: true },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Which storage fits each need?',
    buckets: [
      { id: 'ebs', label: 'EBS' },
      { id: 'store', label: 'Instance store' },
      { id: 'efs', label: 'EFS' },
      { id: 'fsxw', label: 'FSx for Windows' },
    ],
    chips: [
      { id: 'c1', label: 'The database disk for one production server', bucket: 'ebs', why: 'EBS. Durable block storage that survives stops, attached to one instance.' },
      { id: 'c2', label: 'A scratch cache that can be rebuilt at any time', bucket: 'store', why: 'Instance store. Fast, free with the instance, and losing it does not matter.' },
      { id: 'c3', label: 'Uploaded images shared by ten Linux web servers', bucket: 'efs', why: 'EFS. A shared NFS file system that many Linux instances can use at once.' },
      { id: 'c4', label: 'Team folders for staff on Windows desktops', bucket: 'fsxw', why: 'FSx for Windows File Server. Managed SMB shares, the way Windows expects.' },
    ],
    successNote: 'One server, durable: EBS. Temporary: instance store. Shared Linux: EFS. Shared Windows: FSx.',
  },
}

const e35: Slide = {
  id: 'e35-lightsail',
  navLabel: 'Amazon Lightsail',
  title: 'Amazon',
  subtitle: 'Lightsail',
  sourceSlides: [49],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Lightsail is the simple way to launch a virtual private server, for a low, predictable monthly price.',
    columns: 3,
    cards: [
      { id: 'preconfigured', label: 'Preconfigured', eyebrow: 'Ready to go', body: 'A virtual machine with SSD storage, set up for you.', tint: ORANGE },
      { id: 'included', label: 'Everything included', eyebrow: 'One price', body: 'Data transfer, DNS management and a static IP.', tint: BLUE },
      { id: 'manage', label: 'Easy to manage', eyebrow: 'Tools', body: 'From the Lightsail console, API or command line.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Start on Lightsail for a simple website. Move to EC2 when you need its full range of options.' },
  },
  script: [
    { text: 'Finally, Amazon Lightsail. It is the simplest way to launch a virtual private server, for a low, predictable price.', reveal: 'intro' },
    { text: 'A Lightsail server is a preconfigured virtual machine with SSD storage, set up for you.', reveal: 'preconfigured' },
    { text: 'Data transfer, DNS management, and a static IP address are all included.', reveal: 'included' },
    { text: 'And you manage it from the Lightsail console, its API, or its command line.', reveal: 'manage' },
    { text: 'Start on Lightsail for a simple website, and move to EC2 when you need its full range of options.', reveal: 'foot', holdMs: 400 },
  ],
}

const e36: Slide = {
  id: 'e36-complete',
  navLabel: 'Module complete',
  title: 'Module 3 Complete',
  sourceSlides: [50],
  scene: 'module-outro',
  data: {
    kind: 'module-outro',
    heading: 'Module 3 complete',
    covered: [
      'Instances, instance types and AMIs',
      'Six pricing options and Savings Plans',
      'IP addresses, security groups and ports',
      'Lifecycle, metadata, user data and IMDSv2',
      'EBS, instance store, snapshots, EFS and FSx',
    ],
    next: 'Next: Module 4, Amazon S3, block and file storage.',
  },
  script: [
    { text: 'That is the end of Module Three, Amazon Elastic Compute Cloud.', reveal: 'done', holdMs: 300 },
    { text: 'You have covered instances and AMIs, the pricing options, IP addresses and security groups, the instance lifecycle and metadata, and the storage that sits behind EC2.', reveal: 'covered' },
    { text: 'You can now choose, pay for, secure, and store data for a server on AWS. Next comes Module Four, storage with Amazon S3. Well done.', reveal: 'next', holdMs: 500 },
  ],
}

export const slidesEc2: Slide[] = [
  e01, e02, e03, e04, e05, e06, e07, e08, e09, e10,
  e11, e12, e13, e14, e15, e16, e17, e18, e19, e20,
  e21, e22, e23, e24, e25, e26, e27, e28, e29, e30,
  e31, e32, e33, e34, e35, e36,
]
