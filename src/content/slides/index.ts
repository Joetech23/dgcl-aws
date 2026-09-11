import type { Slide } from '@/lib/course/types'

/**
 * Slides one through ten, mapped directly to deck slides 1-10.
 *
 * Scripts are written in the voice of a training instructor who takes the
 * time to explain, not a marketing brochure. No em dashes anywhere in the
 * scripts, and every gate hands the learner something concrete to do before
 * playback continues.
 */

const s01: Slide = {
  id: 's01-title',
  navLabel: 'Welcome',
  title: 'AWS Cloud Training',
  subtitle: 'Section 1 · Amazon Web Services Fundamentals',
  sourceSlides: [1],
  scene: 'title',
  script: [
    {
      text: 'Welcome to the AWS Cloud Training programme from the Digital Cloud Academy.',
      reveal: 'title',
      holdMs: 200,
    },
    {
      text: 'This is Section One, Amazon Web Services Fundamentals.',
      reveal: 'subtitle',
    },
    {
      text: 'Across the next ten lessons you will learn what AWS is, what it gives you, who it is for, and where the cloud fits into all of it. Nothing here assumes you have used it before.',
      reveal: 'promise',
    },
    {
      text: 'Before we begin, tell me who you are, so I can pitch the examples correctly.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'path-choice',
    prompt: 'Which is closer to you?',
    choices: [
      {
        id: 'it',
        label: 'I work in or around IT',
        body: 'Great. You will already recognise the machines under the abstraction, so I will lean on what changes rather than what a server is.',
      },
      {
        id: 'non-it',
        label: 'I am coming to this fresh',
        body: 'Perfect. Every term gets defined the first time it appears, and the examples will stay in plain English.',
      },
    ],
  },
}

const s02: Slide = {
  id: 's02-what-aws-is',
  navLabel: 'What AWS is',
  title: 'Amazon Web Services Fundamentals',
  sourceSlides: [2],
  scene: 'what-aws-is',
  script: [
    {
      text: 'AWS, short for Amazon Web Services, is a cloud platform run by Amazon.',
      reveal: 'name',
    },
    {
      text: 'It gives you computing power, storage, databases, and machine learning tools, all delivered over the internet, and all rented by the minute.',
      reveal: 'what',
    },
    {
      text: 'That means you can run applications, hold data, and grow or shrink your resources without buying a single piece of hardware.',
      reveal: 'why',
    },
    {
      text: 'Flexibility, scale, and cost. That is the whole promise.',
      reveal: 'promise',
      holdMs: 400,
    },
    {
      text: 'Tap each promise to see how AWS actually delivers it.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Tap each promise to see how it works in practice.',
    columns: 3,
    cards: [
      {
        id: 'flex',
        label: 'Flexibility',
        teaser: 'Right size, any time',
        body: 'Add servers in the morning, remove them at night. You never buy for a peak you might not hit.',
      },
      {
        id: 'scale',
        label: 'Scale',
        teaser: 'One user or one million',
        body: 'The same account holds a demo for two people and a launch for two million. AWS handles the machines behind it.',
      },
      {
        id: 'cost',
        label: 'Cost',
        teaser: 'Pay for what you use',
        body: 'No servers sitting idle at 3am. You pay for the seconds you actually consumed, and nothing else.',
      },
    ],
  },
}

const s03: Slide = {
  id: 's03-key-features',
  navLabel: 'Key features',
  title: 'Key Features of AWS Cloud Computing',
  sourceSlides: [3],
  scene: 'key-features',
  script: [
    {
      text: 'AWS has four features that come up in almost every conversation. It is worth knowing what each of them actually means.',
      reveal: 'intro',
    },
    {
      text: 'Scalability. You can add capacity when demand rises, and remove it when demand falls, without changing your architecture.',
      reveal: 'scalability',
    },
    {
      text: 'Cost efficiency. You pay as you go. No long term contracts, and no charges for resources you are not using.',
      reveal: 'cost',
    },
    {
      text: 'Global reach. AWS has data centres in dozens of regions around the world, so your application can sit close to your users wherever they are.',
      reveal: 'global',
    },
    {
      text: 'Security and compliance. AWS provides the tools for identity, encryption, and network protection. It is on you to configure them, but the ceiling is very high.',
      reveal: 'security',
      holdMs: 400,
    },
    {
      text: 'Match each feature to the business decision it supports.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Match each business need to the feature that solves it.',
    buckets: [
      { id: 'scalability', label: 'Scalability' },
      { id: 'cost', label: 'Cost efficiency' },
      { id: 'global', label: 'Global reach' },
      { id: 'security', label: 'Security & compliance' },
    ],
    chips: [
      {
        id: 'c1',
        label: 'A retailer bracing for Black Friday traffic',
        bucket: 'scalability',
        why: 'Scalability. You grow the fleet for the spike, and shrink it when the sale is over.',
      },
      {
        id: 'c2',
        label: 'A startup that cannot afford idle servers',
        bucket: 'cost',
        why: 'Cost efficiency. Pay-as-you-go means you never pay for capacity you did not use.',
      },
      {
        id: 'c3',
        label: 'A streaming service with viewers in five continents',
        bucket: 'global',
        why: 'Global reach. Servers close to the viewer mean less buffering and a lower bill for bandwidth.',
      },
      {
        id: 'c4',
        label: 'A hospital protecting patient records',
        bucket: 'security',
        why: 'Security and compliance. The controls exist; the responsibility for configuring them is yours.',
      },
    ],
    successNote: 'The four features are not a marketing list. Each of them answers a real business question.',
  },
}

const s04: Slide = {
  id: 's04-service-families',
  navLabel: 'Range of services',
  title: 'Over 200 Fully Featured Services',
  subtitle: 'Grouped into four families',
  sourceSlides: [4],
  scene: 'service-families',
  script: [
    {
      text: 'AWS offers more than two hundred services. That number sounds intimidating, but almost every one of them falls into one of four families.',
      reveal: 'intro',
    },
    {
      text: 'Compute. Services like Amazon EC2 and AWS Lambda that run your code.',
      reveal: 'compute',
    },
    {
      text: 'Storage. Amazon S3 and EBS for keeping files, backups, and disks.',
      reveal: 'storage',
    },
    {
      text: 'Databases. RDS, DynamoDB, and Aurora for structured data, whether relational or not.',
      reveal: 'database',
    },
    {
      text: 'Machine learning. SageMaker and the rest of the AI stack for building, training, and running models.',
      reveal: 'ml',
      holdMs: 300,
    },
    {
      text: 'Open each family to see the workhorse service inside it.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Open each family to see the service you will hear named most often.',
    columns: 4,
    cards: [
      { id: 'compute', label: 'Compute', teaser: 'Runs your code', body: 'EC2 gives you virtual servers. Lambda runs a function on demand without a server at all.' },
      { id: 'storage', label: 'Storage', teaser: 'Holds your files', body: 'S3 for objects like images, videos, and backups. EBS for the disk attached to a virtual server.' },
      { id: 'database', label: 'Databases', teaser: 'Holds your records', body: 'RDS for standard SQL databases. DynamoDB when you need key-value speed at any scale.' },
      { id: 'ml', label: 'Machine learning', teaser: 'Trains your models', body: 'SageMaker for the full training and deployment loop. Bedrock for calling foundation models directly.' },
    ],
  },
}

const s05: Slide = {
  id: 's05-use-cases',
  navLabel: 'Common use cases',
  title: 'Common Use Cases',
  sourceSlides: [5],
  scene: 'use-cases',
  script: [
    {
      text: 'What do people actually build on AWS. Four use cases account for most of the traffic.',
      reveal: 'intro',
    },
    {
      text: 'Web and mobile applications. Everything from a landing page to a global social network.',
      reveal: 'web',
    },
    {
      text: 'Data analytics. Companies collect data, put it in a warehouse, and ask questions of it. AWS provides every step of that pipeline.',
      reveal: 'analytics',
    },
    {
      text: 'Disaster recovery and backup. If your primary systems fail, a copy on AWS keeps the business running.',
      reveal: 'backup',
    },
    {
      text: 'Machine learning and AI. Training models on data that would drown a laptop, and serving them to millions of users.',
      reveal: 'ml',
      holdMs: 300,
    },
    {
      text: 'Which use case fits which business? Match them below.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'For each business, choose the workload AWS is doing for them.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A newspaper wants readers in Sydney to load pages as fast as readers in London.',
        options: [
          { id: 'a', label: 'Web and mobile applications', correct: true, feedback: 'Yes. Static content served close to the reader is the classic web workload.' },
          { id: 'b', label: 'Machine learning', feedback: 'ML might personalise the front page, but the load speed comes from the web infrastructure.' },
          { id: 'c', label: 'Disaster recovery', feedback: 'Disaster recovery is about surviving failure, not everyday performance.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'A bank needs to prove that if the main data centre burns down, customers can still log in.',
        options: [
          { id: 'a', label: 'Data analytics', feedback: 'Analytics reports on what happened. That does not keep the doors open when things go wrong.' },
          { id: 'b', label: 'Disaster recovery and backup', correct: true, feedback: 'Exactly. A warm copy on AWS is why regulated businesses can promise continuity.' },
          { id: 'c', label: 'Web applications', feedback: 'The login page is a web app, but the answer to the regulator is a DR plan.' },
        ],
      },
    ],
  },
}

const s06: Slide = {
  id: 's06-audience',
  navLabel: 'Who this is for',
  title: 'Designed for IT and Non-IT Professionals',
  sourceSlides: [6],
  scene: 'audience',
  script: [
    {
      text: 'One question people ask before starting is whether they need a technical background. The honest answer is no.',
      reveal: 'intro',
      holdMs: 300,
    },
    {
      text: 'If you already work in IT, this course fills in the vocabulary you will hear on every project, and the reasons behind it.',
      reveal: 'it',
    },
    {
      text: 'If you are coming from another field, business, finance, operations, or a career pivot, this course gives you the foundations without demanding code.',
      reveal: 'nonit',
      holdMs: 400,
    },
    {
      text: 'The pass rate for the Cloud Practitioner certification is high, and most people who prepare properly get through on the first attempt.',
      reveal: 'confidence',
    },
  ],
}

const s07: Slide = {
  id: 's07-cert-ladder',
  navLabel: 'Certification path',
  title: 'AWS Certification Path',
  sourceSlides: [7],
  scene: 'cert-ladder',
  script: [
    {
      text: 'AWS has an official certification ladder. Understanding it early helps you set a realistic goal.',
      reveal: 'intro',
    },
    {
      text: 'Foundational. Six months of AWS knowledge. Cloud Practitioner sits here, and this is where the course you are on now leads.',
      reveal: 'foundational',
    },
    {
      text: 'Associate. One year of hands-on experience. Solutions Architect, Developer, and SysOps Administrator all live at this level.',
      reveal: 'associate',
    },
    {
      text: 'Professional. Two years of comprehensive experience. Solutions Architect Professional and DevOps Engineer are the flagship exams.',
      reveal: 'professional',
    },
    {
      text: 'Specialty. Narrow, deep expertise in one area, such as Security, Machine Learning, or Networking.',
      reveal: 'specialty',
      holdMs: 400,
    },
    {
      text: 'Tap any level to see who it is for.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Tap each level to see who takes it and why.',
    columns: 4,
    cards: [
      { id: 'foundational', label: 'Foundational', teaser: 'Cloud Practitioner', body: 'For anyone starting out. Focuses on concepts, pricing, and where AWS fits. No hands-on required.' },
      { id: 'associate', label: 'Associate', teaser: 'Architect · Developer · SysOps', body: 'For people building on AWS every week. About a year of real project time is the usual starting point.' },
      { id: 'professional', label: 'Professional', teaser: 'Architect Pro · DevOps', body: 'For senior engineers. Case-study heavy, and the exams are known for their length.' },
      { id: 'specialty', label: 'Specialty', teaser: 'Security · ML · Networking', body: 'For deep expertise in one domain. Usually taken after a role has narrowed to one area.' },
    ],
  },
}

const s08: Slide = {
  id: 's08-what-is-cloud',
  navLabel: 'What is the cloud?',
  title: 'What is the Cloud?',
  sourceSlides: [8],
  scene: 'what-is-cloud',
  script: [
    {
      text: 'Now the question at the heart of the section. What is the cloud actually?',
      reveal: 'question',
      holdMs: 400,
    },
    {
      text: 'Have a go below. Get it wrong if you need to. The explanations are written for every answer.',
      gate: true,
    },
    {
      text: 'Here is the honest picture. Your software does not live in the sky. It lives on a machine, in a building, with an address and an electricity bill.',
      reveal: 'diagram',
    },
    {
      text: 'What the cloud changes is who owns that building, and how you pay for the machine inside it. Nothing more mystical than that.',
      reveal: 'punchline',
    },
    {
      text: 'The word comes from the drawing, not the technology. On old network diagrams, the part you did not control was always sketched as a cloud.',
      reveal: 'origin',
      holdMs: 400,
    },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Answer first, then read the explanation.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'You save a photo to your phone and it appears on your laptop. Where did the photo physically go?',
        options: [
          { id: 'a', label: 'Onto a hard drive in a building somewhere', correct: true, feedback: 'Yes. Someone else’s computer, in someone else’s building, rented over the internet.' },
          { id: 'b', label: 'Nowhere physical, it is distributed as data', feedback: 'A common instinct. But every byte sits on a specific drive with a specific electricity bill. The cloud hides that from you, it does not remove it.' },
          { id: 'c', label: 'Onto the internet itself', feedback: 'The internet is how the photo travelled, not where it stopped. It is the road, not the warehouse.' },
        ],
      },
    ],
  },
}

const s09: Slide = {
  id: 's09-deployment-models',
  navLabel: 'Types of cloud',
  title: 'The Different Types of Cloud Computing',
  subtitle: 'Private · Public · Hybrid · Multi',
  sourceSlides: [11, 12],
  scene: 'deployment-models',
  script: [
    {
      text: 'Not everyone buys the cloud the same way. There are four models, and the choice is driven by two things: what the law requires of you, and what you can afford to hand over.',
      reveal: 'intro',
    },
    {
      text: 'A private cloud is a company running its own data centre. Their systems, their servers, their building. Total control and the total bill that comes with it.',
      reveal: 'private',
    },
    {
      text: 'A public cloud is Amazon, Microsoft, or Google running it for you. Public does not mean your data is visible to anyone. It means anyone is allowed to rent the service.',
      reveal: 'public',
    },
    {
      text: 'A hybrid keeps the sensitive part in-house and rents the rest. A multi-cloud spreads the work across more than one provider, usually to avoid depending on a single one.',
      reveal: 'hybrid-multi',
      holdMs: 400,
    },
    {
      text: 'Now place these four real businesses. Drag each one to the model it needs, and think about why before you drop it.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Match each business to the deployment model it needs.',
    buckets: [
      { id: 'private', label: 'Private' },
      { id: 'public', label: 'Public' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'multi', label: 'Multi' },
    ],
    chips: [
      { id: 'c1', label: 'Defence contractor, classified work that may never leave the site', bucket: 'private', why: 'Private. When the rules say the data cannot leave your building, no amount of cost saving changes the answer.' },
      { id: 'c2', label: 'Two-person startup launching an app this month', bucket: 'public', why: 'Public. They have no building, no staff to run one, and no idea yet how many users they will have.' },
      { id: 'c3', label: 'High-street bank: records in-house, mobile app on rented servers', bucket: 'hybrid', why: 'Hybrid. The regulated data stays where the regulator expects it. The part that needs to scale is rented.' },
      { id: 'c4', label: 'Streaming service running on both AWS and Google to survive an outage', bucket: 'multi', why: 'Multi-cloud. The point is not cost. It is refusing to let one provider’s bad day become your bad day.' },
    ],
    successNote: 'That is the real decision. Not which is best, but what the law demands, what you can afford to run, and how much you are willing to depend on one company.',
  },
}

const s10: Slide = {
  id: 's10-responsibilities',
  navLabel: 'Separation of responsibilities',
  title: 'Who is Responsible for What',
  subtitle: 'On-premises · IaaS · PaaS · SaaS',
  sourceSlides: [14],
  scene: 'responsibilities',
  script: [
    {
      text: 'This is the most important idea in the section, and it is almost always drawn badly.',
      reveal: 'intro',
      holdMs: 300,
    },
    {
      text: 'Between bare networking at the bottom and the application a person actually uses at the top, there are nine layers.',
      reveal: 'stack',
    },
    {
      text: 'The textbook prints four separate columns and asks you to compare nine rows across them by eye. But it is not four stacks. It is one stack, and one moving line.',
      reveal: 'boundary',
      holdMs: 400,
    },
    {
      text: 'Choosing a service model does exactly one thing: it decides how far up that stack your responsibility begins. Switch between the models and watch the line move.',
      gate: true,
    },
    {
      text: 'And notice the part everyone misses. Even at the very top, where the provider manages all nine layers, your data and your access controls are still yours. Misconfigured access is the most common cloud breach there is.',
      reveal: 'caveat',
    },
  ],
  interaction: {
    kind: 'stack-explorer',
    prompt: 'Switch between the four models and watch the boundary move.',
    layers: [
      'Applications',
      'Data',
      'Runtime',
      'Middleware',
      'Operating system',
      'Virtualisation',
      'Servers',
      'Storage',
      'Networking',
    ],
    models: [
      { id: 'onprem', label: 'On-premises', youManage: 9, note: 'You manage all nine layers. You also buy, house, power, and replace every machine.' },
      { id: 'iaas', label: 'IaaS', youManage: 5, note: 'The provider handles the physical layers. You still own the operating system upwards, including patching it.' },
      { id: 'paas', label: 'PaaS', youManage: 2, note: 'You bring the application and the data. Everything underneath is someone else’s problem.' },
      { id: 'saas', label: 'SaaS', youManage: 0, note: 'You manage none of the stack. But note what is still yours: who you grant access to, and what you put in.' },
    ],
  },
}

/* ============================================================
   Slides 11–20 — the next block, mapped to deck slides 9-20.
   ============================================================ */

const s11: Slide = {
  id: 's11-cloud-service-provider',
  navLabel: 'Cloud service providers',
  title: 'What is a Cloud Service Provider',
  sourceSlides: [9],
  scene: 'cloud-service-provider',
  script: [
    {
      text: 'A cloud service provider is a company that lets you rent computing, storage, and networking, instead of buying it yourself.',
      reveal: 'defn',
    },
    {
      text: 'They own the buildings. They own the machines. They employ the engineers who keep the power and the cooling running.',
      reveal: 'they-own',
    },
    {
      text: 'You pay for what you use, and you stop paying when you stop using it. That is the whole trade.',
      reveal: 'pay',
    },
    {
      text: 'Three providers dominate the market. Amazon Web Services, Microsoft Azure, and Google Cloud.',
      reveal: 'three',
    },
    {
      text: 'AWS is the largest, and it is the one this course is about.',
      reveal: 'aws',
      holdMs: 400,
    },
  ],
}

const s12: Slide = {
  id: 's12-iceberg',
  navLabel: 'Licensing vs pay-as-you-go',
  title: 'Licensing vs Pay as You Go',
  subtitle: 'The two icebergs',
  sourceSlides: [10],
  scene: 'iceberg',
  script: [
    {
      text: 'Both models show you one number up front. A licence fee, or a subscription.',
      reveal: 'tip',
    },
    {
      text: 'The difference is what sits underneath it, and how much of that iceberg you can see from a distance.',
      reveal: 'underneath',
    },
    {
      text: 'With on-premises, you also pay for hardware, IT staff, maintenance, training, and capacity you bought but never used.',
      reveal: 'onprem-costs',
    },
    {
      text: 'With the cloud, most of that goes to the provider. You pay for implementation, some customisation, and training. That is close to the whole bill.',
      reveal: 'cloud-costs',
      holdMs: 400,
    },
    {
      text: 'Drag the slider to drain the water and see what you are actually buying in each model.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'slider-compare',
    prompt: 'Drain the water and see what each model really costs.',
    diagram: 'iceberg',
    revealAt: 60,
    successNote: 'The bill on the invoice is the tip. What sits below the waterline is where cloud actually wins.',
  },
}

const s13: Slide = {
  id: 's13-service-models',
  navLabel: 'IaaS · PaaS · SaaS',
  title: 'IaaS, PaaS, SaaS',
  subtitle: 'What you rent, and what they run',
  sourceSlides: [13],
  scene: 'service-models',
  script: [
    {
      text: 'The three service models describe how much of the stack the provider looks after, and how much stays with you.',
      reveal: 'intro',
    },
    {
      text: 'IaaS, Infrastructure as a Service. You rent servers, networking, storage. You install and run everything on top. EC2 is the classic example.',
      reveal: 'iaas',
    },
    {
      text: 'PaaS, Platform as a Service. The provider runs the operating system and the runtime. You bring the application and the data. Elastic Beanstalk sits here.',
      reveal: 'paas',
    },
    {
      text: 'SaaS, Software as a Service. You just use the application. Someone else runs everything underneath. Gmail, Office 365, Salesforce.',
      reveal: 'saas',
    },
    {
      text: 'Tap each layer to see which model exempts you from managing it.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Tap each layer to see which service model takes it off your plate.',
    columns: 3,
    cards: [
      {
        id: 'apps',
        label: 'Applications',
        teaser: 'Managed only in SaaS',
        body: 'Under IaaS and PaaS the app is still yours. Only SaaS lifts this off you completely.',
      },
      {
        id: 'runtime',
        label: 'Runtime & O/S',
        teaser: 'Managed in PaaS and SaaS',
        body: 'Under IaaS you patch the OS yourself. PaaS and SaaS remove that job entirely.',
      },
      {
        id: 'infra',
        label: 'Hardware & network',
        teaser: 'Never yours in cloud',
        body: 'The servers, storage, and networking are always the provider’s, no matter which model you pick.',
      },
    ],
  },
}

const s14: Slide = {
  id: 's14-six-advantages',
  navLabel: 'Six advantages',
  title: 'The Six Advantages',
  subtitle: 'Of cloud computing',
  sourceSlides: [16],
  scene: 'six-advantages',
  script: [
    {
      text: 'AWS lists six advantages of cloud computing. They are worth memorising because they show up on the Cloud Practitioner exam almost word for word.',
      reveal: 'intro',
    },
    {
      text: 'One. Trade capital expense for variable expense. Stop buying servers up front and pay per second instead.',
      reveal: 'a1',
    },
    {
      text: 'Two. Benefit from massive economies of scale. AWS buys hardware by the container ship, and passes the discount on.',
      reveal: 'a2',
    },
    {
      text: 'Three. Stop guessing capacity. Add servers when demand rises, remove them when it falls.',
      reveal: 'a3',
    },
    {
      text: 'Four. Increase speed and agility. New environments in minutes instead of months.',
      reveal: 'a4',
    },
    {
      text: 'Five. Stop spending money running and maintaining data centres. Focus on your customers instead.',
      reveal: 'a5',
    },
    {
      text: 'Six. Go global in minutes. Deploy to a new region with a click.',
      reveal: 'a6',
      holdMs: 300,
    },
    {
      text: 'Tap each advantage to lock it in.',
      gate: true,
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Tap each advantage to see the plain-language version.',
    columns: 3,
    cards: [
      { id: 'a1', label: 'Trade capex for opex', teaser: 'Rent, don’t buy', body: 'You never pay for a machine you did not run. That single change kills a lot of budget planning.' },
      { id: 'a2', label: 'Economies of scale', teaser: 'AWS gets the bulk price', body: 'You pay a small share of a very large hardware bill, which no medium business can negotiate on its own.' },
      { id: 'a3', label: 'Stop guessing capacity', teaser: 'Add and remove servers', body: 'Wrong forecasts cost real money. Elastic capacity turns that risk into a slider.' },
      { id: 'a4', label: 'Speed and agility', teaser: 'Minutes, not months', body: 'Provisioning goes from a purchase order to an API call.' },
      { id: 'a5', label: 'Stop running data centres', teaser: 'Focus on customers', body: 'The people who used to keep the lights on can build the product instead.' },
      { id: 'a6', label: 'Global in minutes', teaser: 'Deploy to any region', body: 'You choose the region from a dropdown. The provider handles everything below it.' },
    ],
  },
}

const s15: Slide = {
  id: 's15-global-infrastructure',
  navLabel: 'AWS global infrastructure',
  title: 'The AWS Global Infrastructure',
  sourceSlides: [19],
  scene: 'global-infrastructure',
  script: [
    {
      text: 'AWS runs one of the largest networks on earth. Understanding the shape of it makes the rest of the course click.',
      reveal: 'intro',
    },
    {
      text: 'Everything starts with a region. A region is a physical geographic area, like London or Frankfurt, that hosts a group of data centres.',
      reveal: 'region',
    },
    {
      text: 'Inside each region are availability zones. Each zone is one or more data centres, physically separated so a single event cannot take them all out at once.',
      reveal: 'az',
    },
    {
      text: 'Around the outside sit edge locations. Small facilities in hundreds of cities that cache content close to your users.',
      reveal: 'edge',
      holdMs: 400,
    },
    {
      text: 'That is the whole map. Regions, zones, and edges.',
      reveal: 'summary',
    },
  ],
}

const s16: Slide = {
  id: 's16-regions-azs',
  navLabel: 'Regions & availability zones',
  title: 'Regions and Availability Zones',
  sourceSlides: [20, 22],
  scene: 'regions-azs',
  script: [
    {
      text: 'Every AWS region contains a minimum of two availability zones. Most have three.',
      reveal: 'minimum',
    },
    {
      text: 'The zones inside a region are close enough to talk fast, but far enough apart to fail independently. In London that means roughly one hundred kilometres between the sites.',
      reveal: 'distance',
    },
    {
      text: 'Each zone is one or more discrete data centres, with its own power, cooling, and network.',
      reveal: 'discrete',
    },
    {
      text: 'The zones are connected by high-bandwidth, low-latency links, so you can replicate data between them almost instantly.',
      reveal: 'links',
      holdMs: 300,
    },
    {
      text: 'Which zones would you choose for each of these applications?',
      gate: true,
    },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Pick the right zone strategy for each application.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A UK regulated bank whose data must stay in the country.',
        options: [
          { id: 'a', label: 'Multiple availability zones in one UK region', correct: true, feedback: 'Correct. Regulation pins the region. Zones give you resilience without leaving the country.' },
          { id: 'b', label: 'One availability zone', feedback: 'Not resilient enough. One zone fails, the bank goes offline.' },
          { id: 'c', label: 'Multiple regions across Europe', feedback: 'Might breach data residency. The bank cannot move records to a region that is out of scope for the regulator.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'A global game with players in every continent.',
        options: [
          { id: 'a', label: 'One region and hope', feedback: 'Players far from your region will get 300 ms of lag. That kills games.' },
          { id: 'b', label: 'Multiple regions, with edge locations for content', correct: true, feedback: 'Correct. Play sessions land in the nearest region and assets stream from the nearest edge.' },
          { id: 'c', label: 'One region with lots of servers', feedback: 'More servers do not fix physics. The speed of light is the bottleneck.' },
        ],
      },
    ],
  },
}

const s17: Slide = {
  id: 's17-edge-locations',
  navLabel: 'Edge locations',
  title: 'Edge Locations',
  subtitle: 'Content close to your users',
  sourceSlides: [23, 24, 25],
  scene: 'edge-locations',
  script: [
    {
      text: 'Edge locations are AWS points of presence in hundreds of cities around the world. They exist for one reason.',
      reveal: 'intro',
    },
    {
      text: 'The speed of light is a hard limit. Data from a London data centre reaches Sydney in about a quarter of a second even in ideal conditions.',
      reveal: 'physics',
    },
    {
      text: 'A quarter of a second sounds fast, until you multiply it by every image on a busy news homepage.',
      reveal: 'multiply',
    },
    {
      text: 'Edge locations cache your content close to the viewer, so most requests never have to travel to the region at all. The service that does this is CloudFront.',
      reveal: 'cloudfront',
      holdMs: 400,
    },
    {
      text: 'The trade is simple. You store more copies. Everyone loads faster.',
      reveal: 'trade',
    },
  ],
}

const s18: Slide = {
  id: 's18-aws-accounts',
  navLabel: 'AWS accounts',
  title: 'All About AWS Accounts',
  sourceSlides: [26],
  scene: 'aws-accounts',
  script: [
    {
      text: 'Everything you do on AWS happens inside an account. Understanding what an account is worth the two minutes.',
      reveal: 'intro',
    },
    {
      text: 'An account is a container. It has its own login, its own bill, and its own resources.',
      reveal: 'container',
    },
    {
      text: 'When someone says they have an AWS account, they mean they can sign in, see a dashboard, and be charged.',
      reveal: 'signin',
    },
    {
      text: 'A serious company will often have many accounts. One for development, one for staging, one for production. Each is a hard boundary, so a mistake in dev cannot damage production.',
      reveal: 'many',
      holdMs: 400,
    },
    {
      text: 'The word account here does not mean a person. It means an environment.',
      reveal: 'environment',
    },
  ],
}

const s19: Slide = {
  id: 's19-account-features',
  navLabel: 'AWS account features',
  title: 'AWS Account Features',
  sourceSlides: [27, 28],
  scene: 'account-features',
  script: [
    {
      text: 'Two features of AWS accounts are worth memorising because they explain how large teams organise themselves.',
      reveal: 'intro',
    },
    {
      text: 'One. Each account is isolated from every other account, unless you deliberately enable cross-account access. That is the safety wall between teams.',
      reveal: 'isolated',
    },
    {
      text: 'Two. Each account spans the entire AWS global infrastructure. You can use any region from a single login, without asking anyone for permission.',
      reveal: 'spans',
      holdMs: 400,
    },
    {
      text: 'Together, those two ideas are why a small team can safely serve customers on five continents from one dashboard.',
      reveal: 'together',
    },
  ],
}

const s20: Slide = {
  id: 's20-root-and-iam',
  navLabel: 'Root user and IAM',
  title: 'Authentication',
  subtitle: 'Root user, IAM users, federated users',
  sourceSlides: [29, 30],
  scene: 'root-and-iam',
  script: [
    {
      text: 'Every account is created with one all-powerful login called the root user. Owning the root user means owning the account.',
      reveal: 'root',
    },
    {
      text: 'You use the root user to set the account up, and then you lock it away and almost never touch it again.',
      reveal: 'lock',
    },
    {
      text: 'For day-to-day work you create IAM users. IAM stands for Identity and Access Management. Each IAM user has only the permissions the job needs, and no more.',
      reveal: 'iam',
    },
    {
      text: 'For people who already sign in somewhere else, at their company, for example, you can use federated users. They log in with the corporate credentials they already have.',
      reveal: 'federated',
      holdMs: 400,
    },
    {
      text: 'Root once, IAM for people you employ, federated for people you trust to sign in elsewhere. That is the whole model.',
      reveal: 'summary',
    },
  ],
}

export const slides: Slide[] = [
  s01, s02, s03, s04, s05, s06, s07, s08, s09, s10,
  s11, s12, s13, s14, s15, s16, s17, s18, s19, s20,
]

export function slideById(id: string): Slide | undefined {
  return slides.find((s) => s.id === id)
}
