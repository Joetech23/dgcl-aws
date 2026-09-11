import type { Screen } from '@/lib/lesson/types'

/**
 * Screens 06–10 — source slides 7–12.
 *
 * These slides are flat screenshots in the source deck, so every diagram here
 * has been rebuilt as SVG. That is what makes them pointable and readable
 * aloud instead of being a picture of a diagram.
 */

export const screen06: Screen = {
  id: 's06-certifications',
  navLabel: 'Certification ladder',
  eyebrow: 'Screen 06',
  title: 'Where this course sits on the ladder',
  sourceSlides: [7],
  objective: 'Find your starting rung, and see what the ones above it ask for.',
  points: [
    {
      id: 'p1',
      text: 'Four tiers. You are aiming at the bottom one, and that is the right place to aim.',
    },
  ],
  beats: [
    {
      say: 'AWS certifications come in four tiers, and people routinely aim two rungs too high and lose a year to it.',
      reveal: 'p1',
    },
    {
      say: 'This course prepares you for the foundational tier — Cloud Practitioner. It assumes six months of general knowledge and no hands-on experience.',
      pauseAfter: 500,
    },
    {
      say: 'Open each tier on the diagram and read what it actually asks of you. The experience requirements are the honest part.',
    },
  ],
  interaction: {
    kind: 'hotspot',
    prompt: 'Open all four tiers.',
    diagram: 'cert-ladder',
    hotspots: [
      {
        id: 'foundational',
        label: 'Foundational',
        x: 22,
        y: 82,
        body: 'Cloud Practitioner. Around six months of general cloud and industry knowledge — no engineering experience assumed. This is the one this course is for.',
      },
      {
        id: 'associate',
        label: 'Associate',
        x: 22,
        y: 60,
        body: 'Solutions Architect, SysOps Administrator, Developer. Expects about a year of actually solving problems on AWS. Reachable within a year of starting.',
      },
      {
        id: 'professional',
        label: 'Professional',
        x: 22,
        y: 38,
        body: 'Solutions Architect and DevOps Engineer. Two years of designing, operating and troubleshooting real systems. Not a reading exercise.',
      },
      {
        id: 'specialty',
        label: 'Specialty',
        x: 22,
        y: 15,
        body: 'Advanced Networking, Security, Machine Learning, Databases and others. Deep experience in one domain rather than another step up the ladder.',
      },
    ],
  },
}

export const screen07: Screen = {
  id: 's07-what-is-cloud',
  navLabel: 'What is the cloud?',
  eyebrow: 'Screen 07',
  title: 'So what is “the cloud”?',
  sourceSlides: [8],
  objective: 'Commit to an answer before you are given one. You will remember it better.',
  points: [
    {
      id: 'p1',
      text: 'The cloud is someone else’s computer, in someone else’s building, that you rent over the internet.',
      emphasis: true,
    },
    {
      id: 'p2',
      text: 'There is nothing atmospheric about it. The word describes the drawing, not the technology: on network diagrams, the bit you did not control was always sketched as a cloud.',
    },
  ],
  beats: [
    {
      say: 'Now the central question of this whole section. And I am going to ask you before I answer it, because an answer you reached for yourself sticks.',
      pauseAfter: 700,
    },
    {
      say: 'Have a go at the question below. Get it wrong if you need to — the explanations are written for whichever way you answer.',
    },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Answer first — the explanation is worth more once you have committed.',
    scenarios: [
      {
        id: 'q1',
        scenario:
          'You save a photo to your phone’s cloud storage and it appears on your laptop. Where did the photo physically go?',
        options: [
          {
            id: 'a',
            label: 'Onto a hard drive in a building somewhere',
            correct: true,
            feedback:
              'Yes. This is the whole answer. The cloud is someone else’s computer, in someone else’s building, rented over the internet. There is nothing atmospheric about it — the word comes from the way network diagrams always drew the part you did not control as a cloud shape.',
          },
          {
            id: 'b',
            label: 'Nowhere physical — it is distributed as data',
            feedback:
              'A common instinct, but no. Every byte lives on a specific drive, in a specific rack, in a specific building, with a specific electricity bill. "The cloud" hides that from you; it does not remove it.',
          },
          {
            id: 'c',
            label: 'Onto the internet itself',
            feedback:
              'The internet is how the photo travelled, not where it stopped. It is the road, not the warehouse. The warehouse is a data centre with a physical address.',
          },
        ],
      },
    ],
  },
}

export const screen08: Screen = {
  id: 's08-csp',
  navLabel: 'Cloud service providers',
  eyebrow: 'Screen 08',
  title: 'Who is a cloud service provider',
  sourceSlides: [9],
  objective: 'See exactly what changes hands when you rent infrastructure instead of owning it.',
  points: [
    {
      id: 'p1',
      text: 'A cloud service provider is a third party that stores your data and runs your applications on servers you rent.',
    },
    {
      id: 'p2',
      text: 'It saves you cost, space and time — and the provider keeps every system off your site.',
    },
  ],
  beats: [
    {
      say: 'If the cloud is someone else’s computer, then a cloud service provider is that someone else.',
      reveal: 'p1',
    },
    {
      say: 'They give you a place to store your data and run your applications on servers you rent rather than buy. What you save is cost, space, and time.',
      reveal: 'p2',
      pauseAfter: 500,
    },
    {
      say: 'And the word public, in public cloud, only means that anyone can rent it. It does not mean your data is public. That confusion causes real anxiety, so hold on to the distinction.',
    },
  ],
  interaction: {
    kind: 'hotspot',
    prompt: 'Open all three parts of the arrangement.',
    diagram: 'csp',
    hotspots: [
      {
        id: 'you',
        label: 'You',
        x: 14,
        y: 50,
        body: 'Your business keeps the application and the data. What you no longer keep is the room, the racks, the power, the cooling and the staff who maintain them.',
      },
      {
        id: 'provider',
        label: 'The provider',
        x: 55,
        y: 30,
        body: 'AWS, Microsoft Azure and Google Cloud are the three you will hear named most. They own the hardware and rent you a slice of it by the hour.',
      },
      {
        id: 'offsite',
        label: 'Off-site',
        x: 90,
        y: 50,
        body: 'Every system is maintained off your premises. That is the point — and it is also why "who is responsible for what" becomes a question worth a whole screen of its own later.',
      },
    ],
  },
}

export const screen09: Screen = {
  id: 's09-licensing-vs-payg',
  navLabel: 'Licensing vs pay as you go',
  eyebrow: 'Screen 09',
  title: 'The bill you see, and the bill you do not',
  sourceSlides: [10],
  objective:
    'Uncover the costs of running your own infrastructure that never appear on the quote.',
  points: [
    {
      id: 'p1',
      text: 'Both models show you one number up front: a licence fee, or a subscription.',
    },
    {
      id: 'p2',
      text: 'The difference is what sits underneath it.',
      emphasis: true,
    },
  ],
  beats: [
    {
      say: 'When someone compares owning software to renting it, they usually compare the two numbers on the quotes. A licence fee against a subscription fee.',
      reveal: 'p1',
    },
    {
      say: 'Those are the tips of two icebergs. The difference between the models is not the tip — it is the mass underneath.',
      reveal: 'p2',
      pauseAfter: 600,
    },
    {
      say: 'So drain the water yourself. Drag the slider and watch what surfaces on each side.',
    },
  ],
  interaction: {
    kind: 'slider-compare',
    diagram: 'iceberg',
    revealAt: 92,
    prompt: 'Drag to drain the water and uncover what each model really costs.',
    successNote:
      'That is the argument in one picture. On-premises, everything below the line is yours to buy, staff and replace — including capacity you paid for and never used. With pay as you go, most of that mass belongs to the provider, and you rent the rest by the hour.',
  },
}

export const screen10: Screen = {
  id: 's10-deployment-models',
  navLabel: 'Deployment models',
  eyebrow: 'Screen 10',
  title: 'Private, public, hybrid, multi',
  sourceSlides: [11, 12],
  objective: 'Place four real businesses into the deployment model that fits their constraints.',
  points: [
    {
      id: 'p1',
      text: 'Private cloud: a company runs its own data centre, hosting only its own systems and data.',
    },
    {
      id: 'p2',
      text: 'Public cloud: data centres run by Amazon, Microsoft or Google, which anyone can rent from.',
    },
    {
      id: 'p3',
      text: 'Hybrid keeps some systems in each. Multi-cloud uses more than one public provider at once.',
    },
  ],
  beats: [
    {
      say: 'A business picks a deployment model based on two things: what its security rules demand, and what it can afford.',
      pauseAfter: 400,
    },
    {
      say: 'Private cloud means the company operates its own data centre, hosting only its own systems and its own data.',
      reveal: 'p1',
    },
    {
      say: 'Public cloud means data centres run by Amazon, Microsoft or Google. Public refers to who may rent the service — not to who can see your data.',
      reveal: 'p2',
    },
    {
      say: 'Hybrid keeps some systems in each. Multi-cloud deliberately spreads across more than one public provider.',
      reveal: 'p3',
      pauseAfter: 500,
    },
    {
      say: 'Now place these four businesses. Tap a card to pick it up, then tap where it belongs.',
    },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Tap a business to pick it up, then tap the model that fits it.',
    buckets: [
      { id: 'private', label: 'Private', hint: 'Own data centre' },
      { id: 'public', label: 'Public', hint: 'Rented from a provider' },
      { id: 'hybrid', label: 'Hybrid', hint: 'Some of each' },
      { id: 'multi', label: 'Multi-cloud', hint: 'Several providers' },
    ],
    chips: [
      {
        id: 'c1',
        label: 'Defence contractor, classified work, legally barred from off-site hosting',
        bucket: 'private',
        why: 'When the law forbids the data leaving your premises, renting is not an option. You build and staff it yourself.',
      },
      {
        id: 'c2',
        label: 'Three-person start-up launching an app next month',
        bucket: 'public',
        why: 'No capital, no staff, no time. Renting from a public provider is the only way they open at all.',
      },
      {
        id: 'c3',
        label: 'Bank keeping account records in-house, running its mobile app on rented infrastructure',
        bucket: 'hybrid',
        why: 'Regulated data stays put; the customer-facing part goes where it can scale. Two models, one business — that is hybrid.',
      },
      {
        id: 'c4',
        label: 'Media company running on AWS and Google Cloud so no single outage can take it off air',
        bucket: 'multi',
        why: 'More than one public provider, on purpose. It buys resilience and negotiating leverage, and costs real complexity.',
      },
    ],
    successNote:
      'Notice that none of these were decided on technical grounds alone. Regulation, budget and risk appetite choose the model far more often than engineers do.',
  },
}
