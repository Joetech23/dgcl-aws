import type { Screen } from '@/lib/lesson/types'

/** Screens 11–15 — source slides 13–16, plus the section checkpoint. */

export const screen11: Screen = {
  id: 's11-service-models',
  navLabel: 'IaaS, PaaS, SaaS',
  eyebrow: 'Screen 11',
  title: 'IaaS, PaaS, SaaS',
  sourceSlides: [13],
  objective: 'Learn the three service models by how much of the work each one takes off you.',
  points: [
    {
      id: 'p1',
      text: 'These three are not products. They are levels of how much someone else has already done for you.',
      emphasis: true,
    },
    {
      id: 'p2',
      text: 'You have used SaaS today. Outlook, Excel online, anything you signed into rather than installed.',
    },
  ],
  beats: [
    {
      say: 'Three acronyms that get treated as jargon, and are actually very simple once you see what they have in common.',
      pauseAfter: 400,
    },
    {
      say: 'They are not products. They are levels — of how much of the work someone else has already done for you before you arrive.',
      reveal: 'p1',
      pauseAfter: 500,
    },
    {
      say: 'And you have almost certainly used the top one today. Outlook, Excel in a browser, anything you signed into rather than installed, is software as a service.',
      reveal: 'p2',
    },
    {
      say: 'Open all three on the diagram, starting from the bottom.',
    },
  ],
  interaction: {
    kind: 'hotspot',
    prompt: 'Open all three levels.',
    diagram: 'service-stack',
    hotspots: [
      {
        id: 'iaas',
        label: 'IaaS',
        x: 16,
        y: 80,
        body: 'Infrastructure as a service. You rent the raw ingredients — storage, networking, virtualisation, compute — and build everything above them yourself. Most control, most work.',
      },
      {
        id: 'paas',
        label: 'PaaS',
        x: 22,
        y: 48,
        body: 'Platform as a service. The operating system, runtime and middleware are handled for you. You bring your application and your data, and nothing else.',
      },
      {
        id: 'saas',
        label: 'SaaS',
        x: 30,
        y: 16,
        body: 'Software as a service. Finished software you simply use. Outlook, Excel online, Twitter. You manage nothing except how you use it.',
      },
    ],
  },
}

export const screen12: Screen = {
  id: 's12-shared-responsibility',
  navLabel: 'Separation of responsibilities',
  eyebrow: 'Screen 12',
  title: 'Who is responsible for what',
  sourceSlides: [14],
  objective:
    'Watch one boundary move up a single stack, and understand every service model at once.',
  points: [
    {
      id: 'p1',
      text: 'There are nine layers between bare networking and the application a person uses.',
    },
    {
      id: 'p2',
      text: 'Choosing a service model does exactly one thing: it decides how far up that stack your responsibility starts.',
      emphasis: true,
    },
    {
      id: 'p3',
      text: 'This is the single most examined idea in cloud fundamentals, and the one that causes the most real-world security incidents.',
    },
  ],
  beats: [
    {
      say: 'This is the most important screen in the section, so I want to change how it is usually drawn.',
      pauseAfter: 500,
    },
    {
      say: 'Between bare networking and the application a person actually uses, there are nine layers.',
      reveal: 'p1',
    },
    {
      say: 'The textbook prints four separate columns side by side and asks you to compare nine rows across them by eye. But it is not four stacks. It is one stack, and one moving line.',
      reveal: 'p2',
      pauseAfter: 600,
    },
    {
      say: 'Choosing a service model does exactly one thing: it decides how far up that stack your responsibility begins. Switch between the models below and watch the line move.',
      reveal: 'p3',
    },
  ],
  interaction: {
    kind: 'stack-explorer',
    prompt: 'Switch between all four models and watch the boundary move.',
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
      {
        id: 'onprem',
        label: 'On-premises',
        youManage: 9,
        note: 'Everything is yours, down to the network cable and the air conditioning. Complete control, complete burden.',
      },
      {
        id: 'iaas',
        label: 'IaaS',
        youManage: 5,
        note: 'The provider handles virtualisation and everything physical. You still own the operating system upwards — including patching it.',
      },
      {
        id: 'paas',
        label: 'PaaS',
        youManage: 2,
        note: 'You bring the application and the data. Nothing below that is your problem, which is why teams ship faster on it.',
      },
      {
        id: 'saas',
        label: 'SaaS',
        youManage: 0,
        note: 'You manage none of the stack. Note what is still yours though: who you grant access to, and what you put in. Misconfigured access is the most common cloud breach there is.',
      },
    ],
  },
}

export const screen13: Screen = {
  id: 's13-why-teams-move',
  navLabel: 'Why teams move',
  eyebrow: 'Screen 13',
  title: 'Why teams move, and what DevOps has to do with it',
  sourceSlides: [15],
  objective: 'Understand the change in working pace that the cloud actually buys a team.',
  points: [
    {
      id: 'p1',
      text: 'The cloud’s real effect on a team is the length of the gap between having an idea and testing it.',
      emphasis: true,
    },
  ],
  beats: [
    {
      say: 'Cost savings get the business case signed. But ask the engineers and they will tell you something different.',
      pauseAfter: 400,
    },
    {
      say: 'The real change is the length of the gap between having an idea and finding out whether it works.',
      reveal: 'p1',
      pauseAfter: 500,
    },
    {
      say: 'DevOps is the working practice this makes possible — the same team building the thing and running it, releasing small changes often instead of big ones rarely. Open both cards to see the difference in practice.',
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'The same request, before and after.',
    columns: 2,
    cards: [
      {
        id: 'before',
        label: 'Owning the hardware',
        teaser: '“We need a test server.”',
        body: 'Raise a request. Get budget approval. Order the machine. Wait six to twelve weeks. Rack it, power it, configure it. Then find out the idea does not work. Nobody proposes a risky idea in that system twice.',
      },
      {
        id: 'after',
        label: 'Renting it',
        teaser: '“We need a test server.”',
        body: 'Request it. Have it in minutes. Find out the idea does not work. Delete it and stop paying. The cost of being wrong collapses — and that is what changes how a team behaves.',
      },
    ],
  },
}

export const screen14: Screen = {
  id: 's14-six-advantages',
  navLabel: 'The six advantages',
  eyebrow: 'Screen 14',
  title: 'The six advantages of cloud computing',
  sourceSlides: [16],
  objective: 'Learn Amazon’s own six, and be able to defend each one in your own words.',
  points: [
    {
      id: 'p1',
      text: 'These six are Amazon’s own framing, quoted in the exam and in nearly every AWS presentation.',
    },
  ],
  beats: [
    {
      say: 'Amazon names six advantages of cloud computing. These are worth knowing in their exact form, because they are quoted in the exam and in nearly every presentation you will sit through.',
      reveal: 'p1',
    },
    {
      say: 'Open all six. Then there is one question at the bottom, and it is the one people most often get wrong.',
    },
  ],
  interaction: {
    kind: 'tap-reveal',
    prompt: 'All six. The card explains what each one means in practice.',
    columns: 3,
    cards: [
      {
        id: 'a1',
        label: 'Trade capital expense for variable expense',
        teaser: 'Stop buying, start renting',
        body: 'Instead of buying data centres and servers before you know how much you need, you pay only when you consume, and only for what you consume.',
      },
      {
        id: 'a2',
        label: 'Benefit from massive economies of scale',
        teaser: 'Their buying power, your bill',
        body: 'Because hundreds of thousands of customers share the same infrastructure, AWS buys hardware and power at a scale no single business could, and passes part of that on.',
      },
      {
        id: 'a3',
        label: 'Stop guessing capacity',
        teaser: 'No more sizing meetings',
        body: 'You no longer decide months ahead how much you will need — and then sit on idle hardware or run out at the worst moment. You scale with actual demand.',
      },
      {
        id: 'a4',
        label: 'Increase speed and agility',
        teaser: 'Minutes, not weeks',
        body: 'New resources are minutes away, so the cost of experimenting falls dramatically. This is the advantage engineers feel most directly.',
      },
      {
        id: 'a5',
        label: 'Stop spending money running data centres',
        teaser: 'Spend it on customers instead',
        body: 'Racking servers and maintaining buildings does not differentiate your business. Every hour reclaimed from it goes to work that does.',
      },
      {
        id: 'a6',
        label: 'Go global in minutes',
        teaser: 'Deploy near your users',
        body: 'Deploy into regions around the world with a few clicks, putting your application close to your customers, at latency you could never buy by building.',
      },
    ],
  },
  check: {
    prompt:
      'A finance director says “we moved to the cloud, so our IT costs must be lower.” What is the most accurate response?',
    options: [
      {
        id: 'a',
        label: 'Correct — pay as you go is always cheaper than owning',
        correct: false,
        explain:
          'No. Pay as you go bills you for what is running, and resources left running when nobody needs them bill just as happily as busy ones. Plenty of migrations increase costs.',
      },
      {
        id: 'b',
        label: 'It changes capital expense into variable expense — whether it is cheaper depends on how well it is managed',
        correct: true,
        explain:
          'Exactly. The advantage AWS claims is trading capital expense for variable expense, not a guaranteed reduction. The saving is real but it has to be earned by turning things off and sizing correctly.',
      },
      {
        id: 'c',
        label: 'Incorrect — the cloud is always more expensive at scale',
        correct: false,
        explain:
          'Too strong in the other direction. Some very large, very steady workloads are cheaper to own, but "always" is wrong, and it ignores the speed and reach you are also buying.',
      },
    ],
  },
}

export const screen15: Screen = {
  id: 's15-checkpoint',
  navLabel: 'Section checkpoint',
  eyebrow: 'Checkpoint',
  title: 'Section 1 checkpoint',
  sourceSlides: [],
  objective:
    'Six questions on what you have just covered. Wrong answers explain themselves — this is revision, not an exam.',
  beats: [
    {
      say: 'Last thing. Six questions on what we have covered. Nothing here is a trick, and a wrong answer will tell you exactly which screen to go back to.',
    },
  ],
  quiz: [
    {
      prompt: 'In one sentence, what is “the cloud”?',
      options: [
        {
          id: 'a',
          label: 'Computers in someone else’s building that you rent over the internet',
          correct: true,
          explain: 'Yes. Physical machines, a real address, an electricity bill — just not yours.',
        },
        {
          id: 'b',
          label: 'Data stored across the internet rather than in any one place',
          correct: false,
          explain:
            'Every byte lives on a specific drive in a specific rack. The cloud hides that from you; it does not remove it. See screen 07.',
        },
        {
          id: 'c',
          label: 'A network protocol for distributing storage',
          correct: false,
          explain: 'It is not a protocol or a technology at all — it is a rental arrangement.',
        },
      ],
    },
    {
      prompt: 'Under IaaS, which of these are still your responsibility?',
      multi: true,
      options: [
        {
          id: 'a',
          label: 'Patching the operating system',
          correct: true,
          explain: 'Yes. Under IaaS you own the OS upwards, and patching it is a common blind spot.',
        },
        {
          id: 'b',
          label: 'Your application code',
          correct: true,
          explain: 'Yes — the application is yours in every model except SaaS.',
        },
        {
          id: 'c',
          label: 'Replacing failed physical drives',
          correct: false,
          explain: 'No. Everything physical belongs to the provider from IaaS upward.',
        },
        {
          id: 'd',
          label: 'The virtualisation layer',
          correct: false,
          explain:
            'No. Virtualisation is exactly where the boundary sits for IaaS. Revisit screen 12.',
        },
      ],
    },
    {
      prompt:
        'A hospital keeps patient records in its own data centre but runs its public website on AWS. What is that?',
      options: [
        {
          id: 'a',
          label: 'Hybrid cloud',
          correct: true,
          explain: 'Right. Some systems private, some public, one organisation.',
        },
        {
          id: 'b',
          label: 'Multi-cloud',
          correct: false,
          explain:
            'Multi-cloud means more than one public provider. Here there is only one, alongside their own data centre.',
        },
        {
          id: 'c',
          label: 'Private cloud',
          correct: false,
          explain: 'Private would mean everything stayed in their own data centre. The website did not.',
        },
      ],
    },
    {
      prompt: 'What does “public” mean in “public cloud”?',
      options: [
        {
          id: 'a',
          label: 'Anyone can rent the service',
          correct: true,
          explain:
            'Correct — it describes who may become a customer, nothing about the visibility of your data.',
        },
        {
          id: 'b',
          label: 'The data stored there is publicly visible',
          correct: false,
          explain:
            'No, and this misunderstanding causes real anxiety. Your data is yours and private by default.',
        },
        {
          id: 'c',
          label: 'It is operated by a government body',
          correct: false,
          explain: 'No — public cloud providers are commercial companies.',
        },
      ],
    },
    {
      prompt:
        'On the iceberg comparison, which cost sits below the waterline for on-premises but not for pay as you go?',
      options: [
        {
          id: 'a',
          label: 'Hardware, maintenance and IT staff',
          correct: true,
          explain:
            'Yes. Those belong to the provider once you rent, which is the whole shape of the argument on screen 09.',
        },
        {
          id: 'b',
          label: 'The subscription fee',
          correct: false,
          explain: 'The subscription is the visible tip on the cloud side, not a hidden cost.',
        },
        {
          id: 'c',
          label: 'Implementation and training',
          correct: false,
          explain:
            'Careful — those sit below the line on both sides. Renting does not remove the work of adopting something.',
        },
      ],
    },
    {
      prompt: 'Which is the most accurate statement about AWS’s security tools?',
      options: [
        {
          id: 'a',
          label: 'They secure your data automatically once you are on AWS',
          correct: false,
          explain:
            'No. They are tools, and an unconfigured tool protects nothing. Misconfigured access is the most common cause of cloud breaches.',
        },
        {
          id: 'b',
          label: 'They are available to you, but you have to configure them correctly',
          correct: true,
          explain:
            'Right. Even under SaaS, who you grant access to and what you put in remain yours. Screens 03 and 12 both make this point.',
        },
        {
          id: 'c',
          label: 'Security is entirely the customer’s responsibility on AWS',
          correct: false,
          explain:
            'Too far the other way. AWS secures the infrastructure itself — the split is what screen 12 is about.',
        },
      ],
    },
  ],
}
