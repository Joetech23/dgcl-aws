import type { Screen } from '@/lib/lesson/types'

/**
 * Screens 01–05 — source slides 1–5.
 *
 * Narration is written to be spoken, not read: short sentences, second person,
 * one idea each. Anywhere the deck says "leverage synergies across the
 * enterprise", this says what it actually means.
 */

export const screen01: Screen = {
  id: 's01-welcome',
  navLabel: 'Welcome',
  eyebrow: 'Section 1 · Screen 01',
  title: 'Before we start, who are you?',
  sourceSlides: [1, 6],
  objective:
    'This section takes about 25 minutes. You can stop anywhere — it remembers where you got to.',
  points: [
    {
      id: 'p1',
      text: 'By the end of this section you will be able to explain what the cloud is to someone who has never heard of it.',
      emphasis: true,
    },
    {
      id: 'p2',
      text: 'You will also know the difference between IaaS, PaaS and SaaS, and be able to say who is responsible for what.',
    },
    {
      id: 'p3',
      text: 'Nothing here assumes you have worked in IT. Where a term is unavoidable, it gets explained the first time it appears.',
    },
  ],
  beats: [
    {
      say: 'Welcome. Before we get into Amazon Web Services, I want to set your expectations for the next twenty five minutes.',
      reveal: 'p1',
    },
    {
      say: 'By the end of this section, you will be able to explain what the cloud actually is to someone who has never heard of it. That is a higher bar than recognising the word.',
      pauseAfter: 600,
    },
    {
      say: 'You will also know the difference between the three service models, and, more importantly, who is responsible for what in each one.',
      reveal: 'p2',
    },
    {
      say: 'None of this assumes you have worked in IT. So let me ask you something, and answer honestly — it changes the examples I reach for.',
      reveal: 'p3',
    },
  ],
  interaction: {
    kind: 'path-choice',
    prompt: 'Which is closer to the truth for you?',
    choices: [
      {
        id: 'it',
        label: 'I work in or around IT',
        body: 'You have seen a server, a ticket queue, or a deployment go wrong. Examples will assume that.',
      },
      {
        id: 'non-it',
        label: 'I am coming to this fresh',
        body: 'You are switching careers or curious. Every technical term gets unpacked before it is used.',
      },
    ],
  },
}

export const screen02: Screen = {
  id: 's02-what-is-aws',
  navLabel: 'What AWS is',
  eyebrow: 'Screen 02',
  title: 'What Amazon Web Services actually is',
  sourceSlides: [2],
  objective: 'Strip the marketing language off the definition and see what is left.',
  points: [
    {
      id: 'p1',
      text: 'AWS rents you computing power, storage and databases over the internet.',
      emphasis: true,
    },
    {
      id: 'p2',
      text: 'You do not buy the machines. You do not house them, power them, cool them, or replace their failed drives at two in the morning.',
    },
    {
      id: 'p3',
      text: 'You ask for what you need, you use it, and you pay for the time you used it.',
    },
    {
      id: 'p4',
      text: 'Everything else in this course is a detail hanging off that one sentence.',
      emphasis: true,
    },
  ],
  beats: [
    {
      say: 'Here is the official definition. Amazon Web Services is a comprehensive, on-demand platform offering computing power, storage, databases and machine learning tools delivered through the cloud.',
      pauseAfter: 700,
    },
    {
      say: 'That sentence is accurate and almost useless. Let me give you the version you can actually repeat.',
      pauseAfter: 500,
    },
    {
      say: 'AWS rents you computing power, storage and databases over the internet.',
      reveal: 'p1',
      pauseAfter: 600,
    },
    {
      say: 'You do not buy the machines. You do not find a room for them, power them, cool them, or get up at two in the morning to replace a failed drive.',
      reveal: 'p2',
    },
    {
      say: 'You ask for what you need, you use it, and you pay for the time you used it. That is the whole idea.',
      reveal: 'p3',
    },
    {
      say: 'Everything else in this course is a detail hanging off that one sentence. Open the three cards below and you have the shape of it.',
      reveal: 'p4',
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Three things that follow from renting instead of owning.',
    columns: 3,
    cards: [
      {
        id: 'c1',
        label: 'You can change your mind',
        teaser: 'What if you need more?',
        body: 'Need ten times the capacity on Friday? Ask for it. Need it gone on Monday? Give it back. Owning hardware makes that decision permanent and expensive.',
      },
      {
        id: 'c2',
        label: 'Someone else is on call',
        teaser: 'Who fixes the hardware?',
        body: 'The building, the power, the cooling, the physical machines and their failures are all Amazon staff and Amazon expense. You never see any of it.',
      },
      {
        id: 'c3',
        label: 'You start with nothing',
        teaser: 'What does it cost to begin?',
        body: 'No purchase order, no data centre, no twelve-week lead time on servers. An account and a card gets you the same infrastructure a bank uses.',
      },
    ],
  },
}

export const screen03: Screen = {
  id: 's03-key-features',
  navLabel: 'Five key features',
  eyebrow: 'Screen 03',
  title: 'Five features you will hear named constantly',
  sourceSlides: [3],
  objective: 'Learn the five words AWS uses about itself, and what each one buys you.',
  points: [
    {
      id: 'p1',
      text: 'These five come up in every AWS conversation, every exam, and every sales pitch you will ever sit through.',
    },
  ],
  beats: [
    {
      say: 'There are five features AWS names about itself over and over. Learn them now and the rest of the course will keep confirming them.',
      reveal: 'p1',
    },
    {
      say: 'I am not going to read them to you. Open each card, because the second half of each one is the part people forget.',
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Open all five. The useful detail is inside, not on the front.',
    columns: 3,
    cards: [
      {
        id: 'scalability',
        label: 'Scalability',
        teaser: 'Up and down',
        body: 'Resources grow and shrink with demand. The part people forget: shrinking matters as much as growing. Hardware you own cannot get smaller when demand drops.',
      },
      {
        id: 'cost',
        label: 'Cost efficiency',
        teaser: 'Pay as you go',
        body: 'You pay for what you use, with no long-term contract. The part people forget: this only saves money if you actually turn things off. Idle resources bill happily.',
      },
      {
        id: 'reach',
        label: 'Global reach',
        teaser: 'Data centres worldwide',
        body: 'AWS runs data centres in regions all over the world. The part people forget: this is about distance. Putting your application near your users is what makes it feel fast.',
      },
      {
        id: 'security',
        label: 'Security & compliance',
        teaser: 'Tools, not guarantees',
        body: 'AWS provides data protection, identity management and network security tools. The part people forget: they are tools. Left unconfigured, they protect nothing.',
      },
      {
        id: 'breadth',
        label: 'Breadth of services',
        teaser: 'Over 200 of them',
        body: 'Compute, storage, databases, machine learning and much more. The part people forget: nobody uses all of them. Most real systems use fewer than ten.',
      },
    ],
  },
}

export const screen04: Screen = {
  id: 's04-service-families',
  navLabel: '200+ services',
  eyebrow: 'Screen 04',
  title: 'Two hundred services, four families',
  sourceSlides: [4],
  objective: 'Stop being intimidated by the service count by learning the four groups they fall into.',
  points: [
    {
      id: 'p1',
      text: 'The service list is long on purpose — it is a catalogue, not a curriculum.',
    },
    {
      id: 'p2',
      text: 'Almost everything you meet early on sits in one of four families.',
      emphasis: true,
    },
  ],
  beats: [
    {
      say: 'AWS offers over two hundred services. That number is quoted to impress you, and it usually just intimidates people instead.',
      reveal: 'p1',
    },
    {
      say: 'So here is the reframe. It is a catalogue, not a curriculum. Nobody learns all of it, and nobody is expected to.',
      pauseAfter: 500,
    },
    {
      say: 'Almost everything you meet in your first year sits in one of four families. Open each one and note the two names inside — you will see those names again in every section that follows.',
      reveal: 'p2',
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'Four families. Remember the service names inside — they recur constantly.',
    columns: 4,
    cards: [
      {
        id: 'compute',
        label: 'Compute',
        teaser: 'Somewhere to run code',
        body: 'EC2 gives you a virtual machine you control. Lambda runs a piece of your code on demand without any machine to manage. Between them they cover most of what "run this" means.',
      },
      {
        id: 'storage',
        label: 'Storage',
        teaser: 'Somewhere to put things',
        body: 'S3 stores files — images, backups, video, anything. EBS is a disk you attach to an EC2 machine. Files versus drives: that is the distinction to hold on to.',
      },
      {
        id: 'database',
        label: 'Databases',
        teaser: 'Somewhere for structured data',
        body: 'RDS runs traditional relational databases. DynamoDB is non-relational and built for enormous scale. Aurora is Amazon’s own high-performance relational engine.',
      },
      {
        id: 'ml',
        label: 'Machine learning',
        teaser: 'Somewhere to train models',
        body: 'SageMaker builds, trains and deploys models without you assembling the infrastructure by hand. This family grew fastest and is where most new services now appear.',
      },
    ],
  },
}

export const screen05: Screen = {
  id: 's05-use-cases',
  navLabel: 'What people build',
  eyebrow: 'Screen 05',
  title: 'What people actually build with it',
  sourceSlides: [5],
  objective: 'Match four real situations to the reason a business reaches for AWS.',
  points: [
    {
      id: 'p1',
      text: 'Start-ups and banks use the same platform, for different reasons.',
    },
  ],
  beats: [
    {
      say: 'The same platform is used by a two-person start-up and by a national bank. What differs is the reason they came.',
      reveal: 'p1',
    },
    {
      say: 'Four situations below. Read each one and pick the use case it fits. If you get one wrong, the explanation tells you why — that is the part worth reading.',
    },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Match each situation to what the business is really buying.',
    scenarios: [
      {
        id: 'sc1',
        scenario:
          'A retailer’s website falls over every Black Friday. They need it to hold up for one weekend a year without paying for that capacity in February.',
        options: [
          {
            id: 'a',
            label: 'Web & mobile applications',
            correct: true,
            feedback:
              'Right. Hosting an application that can grow for a weekend and shrink again is the most common reason businesses arrive.',
          },
          {
            id: 'b',
            label: 'Disaster recovery',
            feedback:
              'Not quite. Nothing has failed here. They are sizing for a predictable spike, which is a scaling problem, not a recovery one.',
          },
          {
            id: 'c',
            label: 'Machine learning',
            feedback:
              'No — there is no model here. The need is capacity that appears and disappears on demand.',
          },
        ],
      },
      {
        id: 'sc2',
        scenario:
          'A hospital must keep a working copy of its patient system in a second location, in case the primary site is lost to fire or flood.',
        options: [
          {
            id: 'a',
            label: 'Data analytics',
            feedback:
              'No. They are not asking questions of the data — they are protecting their ability to keep operating.',
          },
          {
            id: 'b',
            label: 'Disaster recovery & backup',
            correct: true,
            feedback:
              'Right. A second site you only pay for properly when you need it is far cheaper than building and staffing one.',
          },
          {
            id: 'c',
            label: 'Web & mobile applications',
            feedback:
              'Not this one. The system already exists and works; the requirement is that it survives losing a building.',
          },
        ],
      },
      {
        id: 'sc3',
        scenario:
          'A logistics firm has eight years of delivery records sitting in files nobody has ever queried, and wants to find out which routes lose money.',
        options: [
          {
            id: 'a',
            label: 'Data analytics',
            correct: true,
            feedback:
              'Right. The data already exists. What they lack is the means to ask it questions at that volume.',
          },
          {
            id: 'b',
            label: 'Disaster recovery',
            feedback: 'No — nothing is at risk. The data is sitting safe and unread.',
          },
          {
            id: 'c',
            label: 'Web & mobile applications',
            feedback: 'No. Nobody is building an app; they are interrogating history.',
          },
        ],
      },
      {
        id: 'sc4',
        scenario:
          'An insurer wants to read scanned claim forms automatically instead of having staff type them in.',
        options: [
          {
            id: 'a',
            label: 'Web & mobile applications',
            feedback:
              'Not really. There may be an app around it, but the hard part is teaching a system to read handwriting.',
          },
          {
            id: 'b',
            label: 'Machine learning & AI',
            correct: true,
            feedback:
              'Right. Recognising content in a document is a trained-model problem, and it is why this family exists.',
          },
          {
            id: 'c',
            label: 'Data analytics',
            feedback:
              'Close, but analytics queries data you already hold in a usable form. Here the data is trapped in an image and has to be extracted first.',
          },
        ],
      },
    ],
  },
}
