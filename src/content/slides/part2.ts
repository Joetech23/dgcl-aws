import type { Slide } from '@/lib/course/types'

/**
 * Slides 21 to 40, covering the rest of the deck: the cloud toolbox, the
 * global network in detail, the shared responsibility model, the Cloud
 * Adoption Framework, APIs, multi-account strategy, and the whole
 * Well-Architected Framework.
 *
 * These use the four generic layouts, so the content is data and the design
 * stays consistent across twenty slides. Scripts keep the same plain voice as
 * the first twenty, and contain no em dashes.
 */

const BLUE = '#000099'
const ELECTRIC = '#0000BC'
const GOLD = '#FFC000'
const ORANGE = '#F5871F'
const VIOLET = '#7A5AF8'
const MINT = '#12B981'
const ROSE = '#E5484D'
const TEAL = '#0E9AA7'

const s21: Slide = {
  id: 's21-cloud-toolbox',
  navLabel: 'What the cloud enables',
  title: 'Advantages of',
  subtitle: 'the Cloud',
  sourceSlides: [15],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Seven capabilities that the cloud made ordinary. Each one used to need its own data centre and its own specialists.',
    columns: 4,
    cards: [
      { id: 'iaas', label: 'IaaS', eyebrow: 'Infrastructure', body: 'Rent servers, storage and networking.', tint: BLUE },
      { id: 'paas', label: 'PaaS', eyebrow: 'Platform', body: 'Your apps are hosted and run for you.', tint: ELECTRIC },
      { id: 'devops', label: 'DevOps', eyebrow: 'Automation', body: 'Automating how systems are built and released.', tint: ORANGE },
      { id: 'bigdata', label: 'Big Data', eyebrow: 'Analytics', body: 'Analysing huge volumes of data quickly.', tint: VIOLET },
      { id: 'security', label: 'Security', eyebrow: 'Protection', body: 'Isolated environments, with every access tracked.', tint: ROSE },
      { id: 'ml', label: 'Machine Learning', eyebrow: 'Intelligence', body: 'Computers that learn patterns from data.', tint: TEAL },
      { id: 'iot', label: 'IoT', eyebrow: 'Connected things', body: 'Everyday objects connected to the internet.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Notice how many of them feed each other. IoT produces the data, big data stores it, machine learning reads it.' },
  },
  script: [
    { text: 'The cloud did not just move servers. It made a set of capabilities ordinary that used to be out of reach for most companies.', reveal: 'intro' },
    { text: 'Infrastructure as a service, the foundational level, where you rent the machines themselves.', reveal: 'iaas' },
    { text: 'Platform as a service, where development and hosting are handled for you.', reveal: 'paas' },
    { text: 'DevOps, the automation of how infrastructure is built and how software gets deployed.', reveal: 'devops' },
    { text: 'Big data, collecting and analysing very large volumes of information in a short amount of time.', reveal: 'bigdata' },
    { text: 'Security, providing isolated environments and tracking movement and access inside them.', reveal: 'security' },
    { text: 'Machine learning, teaching a computer to analyse figures or images for patterns and then draw logical conclusions.', reveal: 'ml' },
    { text: 'And the internet of things, putting connectivity into everyday objects so they can be controlled or send data back for analysis.', reveal: 'iot' },
    { text: 'Notice how many of them feed each other. The connected devices produce the data, big data stores it, and machine learning reads it.', reveal: 'foot', holdMs: 400 },
  ],
}

const s22: Slide = {
  id: 's22-local-zones',
  navLabel: 'Local & Wavelength zones',
  title: 'Local Zones and',
  subtitle: 'Wavelength Zones',
  sourceSlides: [21],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Two extensions of a region, for when even a nearby region is not close enough.',
    columns: 2,
    cards: [
      { id: 'local', label: 'Local Zones', eyebrow: 'Closer to a city', body: 'Compute, storage, and databases placed next to large populations and industry centres, for workloads that need single-digit millisecond response.', tint: BLUE },
      { id: 'wavelength', label: 'Wavelength Zones', eyebrow: 'Inside the mobile network', body: 'AWS infrastructure embedded in telecom providers 5G networks, so mobile traffic never has to leave the carrier to reach your application.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Both exist for the same reason as edge locations: distance costs time, and some applications cannot afford it.' },
  },
  script: [
    { text: 'Regions and availability zones cover most needs. Two extensions exist for when even a nearby region is not close enough.', reveal: 'intro' },
    { text: 'Local zones place compute, storage, and database services next to large populations and industry centres. They serve workloads that need single-digit millisecond response times, like live video editing or electronic trading.', reveal: 'local' },
    { text: 'Wavelength zones go further. AWS infrastructure is embedded inside telecom providers 5G networks, so traffic from a phone never has to leave the carrier network to reach your application.', reveal: 'wavelength' },
    { text: 'Both exist for the same reason as edge locations. Distance costs time, and some applications cannot afford it.', reveal: 'foot', holdMs: 400 },
  ],
}

const s23: Slide = {
  id: 's23-points-of-presence',
  navLabel: 'Points of presence',
  title: 'Points of Presence',
  subtitle: 'and regional caches',
  sourceSlides: [22],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A point of presence is an edge location with a little more memory behind it.',
    columns: 3,
    cards: [
      { id: 'pop', label: 'What a PoP is', eyebrow: 'Definition', body: 'Similar to an edge location, but it can also hold a regional cache of data that is asked for often.', tint: BLUE },
      { id: 'ha', label: 'High availability', eyebrow: 'Benefit', body: 'With many regions and zones, applications keep running when any single part fails.', tint: MINT },
      { id: 'scale', label: 'Scalability', eyebrow: 'Benefit', body: 'The global footprint lets customers scale out to new places without building anything.', tint: ELECTRIC },
    ],
  },
  script: [
    { text: 'You will also hear the phrase points of presence, usually shortened to PoPs.', reveal: 'intro' },
    { text: 'A point of presence is similar to an edge location, but it can also hold a regional cache: a larger store of the data people ask for most often, which cuts latency even further.', reveal: 'pop' },
    { text: 'Two benefits follow from the whole global design. High availability, because with many regions and zones an application keeps running when any single part of it fails.', reveal: 'ha' },
    { text: 'And scalability, because the global footprint lets a customer expand into a new part of the world without building anything physical.', reveal: 'scale', holdMs: 400 },
  ],
}

const s24: Slide = {
  id: 's24-network-benefits',
  navLabel: 'What the network gives you',
  title: 'What the Global',
  subtitle: 'Network Gives You',
  sourceSlides: [23],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Four practical outcomes, each one a reason companies choose a provider with reach.',
    columns: 2,
    cards: [
      { id: 'dr', label: 'Disaster recovery', body: 'Spreading an application across zones and regions is what keeps a business running when one site is lost.', tint: ROSE },
      { id: 'global', label: 'Global applications', body: 'Deploy close to the people using it, and everything feels faster for reasons no amount of code can fix.', tint: BLUE },
      { id: 'content', label: 'Content delivery', body: 'CloudFront moves images, video, and pages to the edge so they arrive quickly and securely.', tint: ORANGE },
      { id: 'continuity', label: 'Business continuity', body: 'Regulators increasingly ask not whether you might fail, but what happens when you do.', tint: MINT },
    ],
  },
  script: [
    { text: 'So what does all of that reach actually buy you. Four things, and they show up in almost every real project.', reveal: 'intro' },
    { text: 'Disaster recovery. Distributing an application across availability zones and regions is what keeps a business running when one site is lost.', reveal: 'dr' },
    { text: 'Global applications. Deploying close to the people using the service makes it feel faster in a way no amount of clever code can match.', reveal: 'global' },
    { text: 'Content delivery, through CloudFront, moving images, video, and pages out to the edge so they arrive quickly and securely.', reveal: 'content' },
    { text: 'And business continuity. Regulators increasingly ask not whether you might fail, but what happens when you do.', reveal: 'continuity', holdMs: 400 },
  ],
}

const s25: Slide = {
  id: 's25-global-footprint',
  navLabel: 'The global footprint',
  title: 'The Global',
  subtitle: 'Footprint',
  sourceSlides: [24],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Where the regions actually are. The list grows every year, so learn the shape rather than the number.',
    columns: 3,
    cards: [
      { id: 'na', label: 'North America', body: 'Oregon, Northern Virginia, Ohio, and others.', tint: BLUE },
      { id: 'eu', label: 'Europe', body: 'Ireland, Frankfurt, London, and others.', tint: ELECTRIC },
      { id: 'apac', label: 'Asia Pacific', body: 'Sydney, Tokyo, Singapore, and others.', tint: VIOLET },
      { id: 'sa', label: 'South America', body: 'São Paulo.', tint: ORANGE },
      { id: 'africa', label: 'Africa', body: 'Cape Town.', tint: MINT },
      { id: 'me', label: 'Middle East', body: 'Bahrain.', tint: TEAL },
    ],
    footnote: { id: 'foot', text: 'AWS keeps adding regions, so treat any exact count as a snapshot rather than a fact to memorise.' },
  },
  script: [
    { text: 'It helps to know roughly where the regions are, even though the list keeps growing.', reveal: 'intro' },
    { text: 'North America has regions in Oregon, Northern Virginia, and Ohio, among others.', reveal: 'na' },
    { text: 'Europe has Ireland, Frankfurt, and London.', reveal: 'eu' },
    { text: 'Asia Pacific has Sydney, Tokyo, and Singapore.', reveal: 'apac' },
    { text: 'South America has a region in São Paulo.', reveal: 'sa' },
    { text: 'Africa has Cape Town.', reveal: 'africa' },
    { text: 'And the Middle East has Bahrain.', reveal: 'me' },
    { text: 'AWS keeps adding to this, so treat any exact count as a snapshot rather than a fact to memorise.', reveal: 'foot', holdMs: 400 },
  ],
}

const s26: Slide = {
  id: 's26-data-centre',
  navLabel: 'Inside a data centre',
  title: 'Inside an AWS',
  subtitle: 'Data Centre',
  sourceSlides: [25],
  scene: 'photo',
  data: {
    kind: 'photo',
    image: '/art/datacenter-aerial.png',
    points: [
      { id: 'scale', label: 'Bigger than it looks', body: 'A single site can hold tens of thousands of servers, with its own substation and water supply.' },
      { id: 'power', label: 'Power is the real constraint', body: 'Availability zones are sited around independent power and cooling, not just floor space.' },
      { id: 'secret', label: 'Locations are not advertised', body: 'Exact addresses are deliberately not published, and access is tightly controlled.' },
    ],
    footnote: { id: 'foot', text: 'This is the building your data actually lives in. That is all the cloud ever was.' },
  },
  script: [
    { text: 'This is what a region actually looks like from above. It is worth seeing once, because it makes the abstraction concrete.', reveal: 'scale' },
    { text: 'Power, not floor space, is the real constraint. Availability zones are planned around independent power and cooling supplies.', reveal: 'power' },
    { text: 'Exact locations are deliberately not published, and physical access is tightly controlled.', reveal: 'secret' },
    { text: 'This is the building your data actually lives in. That is all the cloud ever was.', reveal: 'foot', holdMs: 500 },
  ],
}

const s27: Slide = {
  id: 's27-shared-responsibility',
  navLabel: 'Shared responsibility model',
  title: 'The Shared',
  subtitle: 'Responsibility Model',
  sourceSlides: [26],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'A framework that defines who secures what. Almost every cloud breach traces back to someone getting this line wrong.',
    left: {
      title: 'AWS: security OF the cloud',
      tint: BLUE,
      items: [
        { id: 'aws-hw', label: 'Hardware and global infrastructure', body: 'The buildings, the machines, the network between them.' },
        { id: 'aws-virt', label: 'Virtualisation layer', body: 'The software that divides one machine into many.' },
        { id: 'aws-managed', label: 'Managed services', body: 'Patching and upkeep of the services they run for you.' },
      ],
    },
    right: {
      title: 'You: security IN the cloud',
      tint: ORANGE,
      items: [
        { id: 'you-data', label: 'Your data', body: 'What you store, and how it is classified.' },
        { id: 'you-iam', label: 'Identity and access', body: 'Who can reach it, and with what permissions.' },
        { id: 'you-config', label: 'Configuration', body: 'Encryption, firewall rules, and network settings.' },
      ],
    },
    footnote: { id: 'foot', text: 'AWS secures the cloud. You secure what you put in it. Nobody covers both.' },
  },
  script: [
    { text: 'The shared responsibility model is a framework that defines the division of security between AWS and you.', reveal: 'intro' },
    { text: 'AWS is responsible for security of the cloud. That starts with the hardware and the global infrastructure: the buildings, the machines, and the network between them.', reveal: 'aws-hw' },
    { text: 'It includes the virtualisation layer, the software that divides one physical machine into many.', reveal: 'aws-virt' },
    { text: 'And it includes patching and upkeep of the managed services they run on your behalf.', reveal: 'aws-managed' },
    { text: 'You are responsible for security in the cloud. That begins with your data: what you store, and how sensitive it is.', reveal: 'you-data' },
    { text: 'It includes identity and access management. Who can reach that data, and with what permissions.', reveal: 'you-iam' },
    { text: 'And it includes configuration. Encryption settings, firewall rules, and how your network is arranged.', reveal: 'you-config' },
    { text: 'AWS secures the cloud. You secure what you put in it. Nobody covers both, and that gap is where breaches happen.', reveal: 'foot', holdMs: 400 },
  ],
}

const s28: Slide = {
  id: 's28-caf-perspectives',
  navLabel: 'Cloud Adoption Framework',
  title: 'AWS Cloud Adoption',
  subtitle: 'Framework',
  sourceSlides: [27, 28],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Six perspectives, split into business and technical. Each one is a part of the organisation that has to change for cloud adoption to work.',
    left: {
      title: 'Business perspectives',
      tint: BLUE,
      items: [
        { id: 'biz', label: 'Business', body: 'Aligning cloud adoption with business goals and value.' },
        { id: 'people', label: 'People', body: 'Workforce readiness, culture, and skills.' },
        { id: 'gov', label: 'Governance', body: 'Compliance, risk management, and policy.' },
      ],
    },
    right: {
      title: 'Technical perspectives',
      tint: ORANGE,
      items: [
        { id: 'platform', label: 'Platform', body: 'Building and modernising the infrastructure itself.' },
        { id: 'sec', label: 'Security', body: 'Confidentiality, integrity, and availability of systems.' },
        { id: 'ops', label: 'Operations', body: 'Running and supporting services to agreed levels.' },
      ],
    },
    footnote: { id: 'foot', text: 'The point of the framework is that cloud adoption is not only a technology project. Half of it is people and governance.' },
  },
  script: [
    { text: 'The AWS Cloud Adoption Framework, usually shortened to CAF, describes six perspectives. Each is a part of an organisation that has to evolve for cloud adoption to succeed.', reveal: 'intro' },
    { text: 'On the business side. The business perspective identifies how cloud adoption aligns with business objectives, including financial management and value realisation.', reveal: 'biz' },
    { text: 'The people perspective focuses on workforce readiness, cultural adjustment, and the skills the transformation needs.', reveal: 'people' },
    { text: 'The governance perspective covers compliance, risk management, and policy alignment.', reveal: 'gov' },
    { text: 'On the technical side. The platform perspective is about building and modernising the infrastructure itself.', reveal: 'platform' },
    { text: 'The security perspective covers confidentiality, integrity, and availability of systems and data.', reveal: 'sec' },
    { text: 'And the operations perspective covers running and supporting services to the levels the business agreed.', reveal: 'ops' },
    { text: 'The real point of the framework is that cloud adoption is not only a technology project. Half of it is people and governance.', reveal: 'foot', holdMs: 400 },
  ],
}

const s29: Slide = {
  id: 's29-caf-journey',
  navLabel: 'The migration journey',
  title: 'The Migration',
  subtitle: 'Journey',
  sourceSlides: [29],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'CAF describes moving to the cloud in three stages. Most failed migrations skipped the first one.',
    steps: [
      { id: 'assess', label: 'Assess', body: 'Evaluate readiness and find the gaps in skills, processes, and technology.', tint: BLUE },
      { id: 'mobilize', label: 'Mobilise', body: 'Build the skills, set a migration plan, and test a small set of applications.', tint: ELECTRIC },
      { id: 'migrate', label: 'Migrate and modernise', body: 'Move the workloads, improving them for the cloud as you go.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Lifting an application unchanged into the cloud is allowed. It is just rarely where the value is.' },
  },
  script: [
    { text: 'CAF also describes the journey itself, in three stages.', reveal: 'intro' },
    { text: 'Assess. Evaluate how ready the organisation actually is, and identify the gaps in skills, processes, and technology.', reveal: 'assess' },
    { text: 'Mobilise. Build the skill sets, set up a migration plan, and test a small set of applications in the cloud before committing.', reveal: 'mobilize' },
    { text: 'Migrate and modernise. Move the workloads across, improving them for the cloud where it makes sense rather than copying them unchanged.', reveal: 'migrate' },
    { text: 'Lifting an application into the cloud untouched is allowed. It is just rarely where the value turns out to be.', reveal: 'foot', holdMs: 400 },
  ],
}

const s30: Slide = {
  id: 's30-caf-benefits',
  navLabel: 'Why CAF helps',
  title: 'Why the Framework',
  subtitle: 'Helps',
  sourceSlides: [30],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Four things an organisation gets from following the framework rather than improvising.',
    columns: 2,
    cards: [
      { id: 'guidance', label: 'Structured guidance', body: 'A clear roadmap and a set of practices that have worked elsewhere.', tint: BLUE },
      { id: 'align', label: 'Alignment across teams', body: 'Technical, business, and compliance people working to one plan.', tint: ELECTRIC },
      { id: 'security', label: 'Security and compliance', body: 'Security practices adopted deliberately rather than bolted on later.', tint: ROSE },
      { id: 'efficiency', label: 'Operational efficiency', body: 'Automation and optimisation encouraged from the start.', tint: MINT },
    ],
  },
  script: [
    { text: 'Four benefits are worth remembering, because they are the argument for using a framework at all.', reveal: 'intro' },
    { text: 'Structured guidance. A clear roadmap and best practices, rather than each organisation rediscovering the same problems.', reveal: 'guidance' },
    { text: 'Alignment across teams. Technical, business, and compliance people working from one plan, which is what makes a transition smooth.', reveal: 'align' },
    { text: 'Enhanced security and compliance, because security practices get adopted deliberately instead of bolted on afterwards.', reveal: 'security' },
    { text: 'And operational efficiency, because the framework pushes automation and optimisation from the beginning.', reveal: 'efficiency', holdMs: 400 },
  ],
}

const s31: Slide = {
  id: 's31-what-is-an-api',
  navLabel: 'What is an API',
  title: 'Application Programming',
  subtitle: 'Interfaces',
  sourceSlides: [31],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'An API is a set of rules that lets two pieces of software talk to each other without either knowing how the other works inside.',
    columns: 3,
    cards: [
      { id: 'client', label: 'The client asks', eyebrow: 'Step one', body: 'Your application sends a request. It does not need to know how the answer is produced.', tint: BLUE },
      { id: 'api', label: 'The API carries it', eyebrow: 'Step two', body: 'The interface takes the request to the system that holds the data, in an agreed format.', tint: GOLD },
      { id: 'server', label: 'The server answers', eyebrow: 'Step three', body: 'The data comes back, usually as JSON, and your application uses it.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Every time an app shows you a map, a payment, or a weather forecast it did not calculate, that is an API call.' },
  },
  script: [
    { text: 'Almost everything on AWS is driven by APIs, so it is worth defining the term properly.', reveal: 'intro' },
    { text: 'An application programming interface is a set of rules and protocols that let different software applications communicate. Think of it as a request and an answer.', reveal: 'client' },
    { text: 'Your application sends a request. The interface carries it, in an agreed format, to the system that actually holds the data.', reveal: 'api' },
    { text: 'The system answers, usually in a format called JSON, and your application uses the result. Neither side needs to know how the other works inside.', reveal: 'server' },
    { text: 'Every time an app shows you a map, a payment, or a weather forecast it did not calculate itself, that is an API call.', reveal: 'foot', holdMs: 400 },
  ],
}

const s32: Slide = {
  id: 's32-api-methods',
  navLabel: 'How an API call works',
  title: 'Requests, Responses,',
  subtitle: 'and Endpoints',
  sourceSlides: [32],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'An endpoint is the address you call. The method is the verb that says what you want done there.',
    columns: 4,
    cards: [
      { id: 'get', label: 'GET', eyebrow: 'Read', body: 'Retrieve data. The most common call by far, and the safest.', tint: BLUE },
      { id: 'post', label: 'POST', eyebrow: 'Create', body: 'Send new data to be stored.', tint: MINT },
      { id: 'put', label: 'PUT', eyebrow: 'Update', body: 'Replace something that already exists.', tint: ORANGE },
      { id: 'delete', label: 'DELETE', eyebrow: 'Remove', body: 'Delete a resource. Treated carefully for obvious reasons.', tint: ROSE },
    ],
    footnote: { id: 'foot', text: 'An endpoint is a URL, such as one that returns a user profile. The response comes back as JSON or XML.' },
  },
  script: [
    { text: 'Two terms come up constantly. Endpoints, and methods.', reveal: 'intro' },
    { text: 'GET retrieves data. It is the most common call by a wide margin, and the safest, because it changes nothing.', reveal: 'get' },
    { text: 'POST sends new data to be stored.', reveal: 'post' },
    { text: 'PUT updates something that already exists, replacing it.', reveal: 'put' },
    { text: 'And DELETE removes a resource, which for obvious reasons is the one guarded most carefully.', reveal: 'delete' },
    { text: 'An endpoint is simply the URL you call, such as one that returns a user profile. The response comes back as JSON or XML.', reveal: 'foot', holdMs: 400 },
  ],
}

const s33: Slide = {
  id: 's33-api-controls',
  navLabel: 'API keys and limits',
  title: 'Authentication,',
  subtitle: 'Limits, and Types',
  sourceSlides: [33],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Two controls protect an API, and three broad types of API exist.',
    columns: 2,
    cards: [
      { id: 'auth', label: 'Authentication', eyebrow: 'Who are you', body: 'Most APIs require an API key or an OAuth token before they will answer at all.', tint: BLUE },
      { id: 'rate', label: 'Rate limiting', eyebrow: 'How often', body: 'A cap on requests in a time window, to keep one caller from overloading the system.', tint: ORANGE },
      { id: 'web', label: 'Web APIs', eyebrow: 'Type', body: 'Called over the internet. Google Maps, Twitter, Stripe.', tint: ELECTRIC },
      { id: 'os', label: 'Library and OS APIs', eyebrow: 'Type', body: 'Called inside a program or against the operating system itself.', tint: VIOLET },
    ],
  },
  script: [
    { text: 'Two controls sit around almost every API you will meet.', reveal: 'intro' },
    { text: 'Authentication. Most APIs require proof of who is calling, usually an API key or an OAuth token, before they will answer at all.', reveal: 'auth' },
    { text: 'Rate limiting. A cap on how many requests are allowed in a given time, which keeps one enthusiastic caller from overloading the system for everyone else.', reveal: 'rate' },
    { text: 'As for types, web APIs are the ones called over the internet. Google Maps, Twitter, and payment providers are the familiar examples.', reveal: 'web' },
    { text: 'And library or operating system APIs are called inside a program, or against the operating system itself.', reveal: 'os', holdMs: 400 },
  ],
}

const s34: Slide = {
  id: 's34-multi-account',
  navLabel: 'Multi-account strategies',
  title: 'Multi-Account',
  subtitle: 'Strategies',
  sourceSlides: [38],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Most organisations end up with several accounts. There are two common reasons, and they lead to different shapes.',
    left: {
      title: 'By environment',
      tint: BLUE,
      items: [
        { id: 'dev', label: 'Development', body: 'Where things are allowed to break.' },
        { id: 'uat', label: 'UAT', body: 'Where the business checks it before release.' },
        { id: 'prod', label: 'Production', body: 'Where customers are. Tightly controlled.' },
      ],
    },
    right: {
      title: 'By client',
      tint: ORANGE,
      items: [
        { id: 'c1', label: 'Client one', body: 'Complete separation of data and billing.' },
        { id: 'c2', label: 'Client two', body: 'One client cannot ever reach another client data.' },
        { id: 'c3', label: 'Client three', body: 'Each account can be handed over or closed on its own.' },
      ],
    },
    footnote: { id: 'foot', text: 'The account boundary is the strongest wall AWS gives you. Both strategies are really just using that wall deliberately.' },
  },
  script: [
    { text: 'Most organisations do not stop at one account. There are two common strategies, and they produce different shapes.', reveal: 'intro' },
    { text: 'The first splits accounts by environment. A development account, where things are allowed to break.', reveal: 'dev' },
    { text: 'A UAT account, where the business checks the work before it is released.', reveal: 'uat' },
    { text: 'And a production account, where the customers are, which is controlled far more tightly than the other two.', reveal: 'prod' },
    { text: 'The second strategy splits by client. An agency or consultancy gives each client their own account, so data and billing are completely separate.', reveal: 'c1' },
    { text: 'One client can never reach another client data, because the wall between accounts is absolute unless someone deliberately opens it.', reveal: 'c2' },
    { text: 'And each account can be handed over or closed down on its own when the relationship ends.', reveal: 'c3' },
    { text: 'The account boundary is the strongest wall AWS gives you. Both strategies are really just using that wall on purpose.', reveal: 'foot', holdMs: 400 },
  ],
}

const s35: Slide = {
  id: 's35-well-architected',
  navLabel: 'Well-Architected Framework',
  title: 'The Well-Architected',
  subtitle: 'Framework',
  sourceSlides: [39],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A set of key concepts, design principles, and best practices for designing and running workloads in the cloud.',
    columns: 3,
    cards: [
      { id: 'measure', label: 'Measure against best practice', body: 'It lets you compare an architecture you already have against what is known to work.', tint: BLUE },
      { id: 'questions', label: 'A set of questions', body: 'The framework is written as foundational questions to ask about a workload.', tint: ELECTRIC },
      { id: 'improve', label: 'Find what to improve', body: 'The output is a list of areas worth attention, not a pass or fail grade.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'It is built on six pillars, which the next slides go through one at a time.' },
  },
  script: [
    { text: 'The AWS Well-Architected Framework describes the key concepts, design principles, and best practices for designing and running workloads in the cloud.', reveal: 'intro' },
    { text: 'Its purpose is to let you consistently measure an architecture you already have against practices that are known to work.', reveal: 'measure' },
    { text: 'It is written as a set of foundational questions to ask about a workload, rather than a rulebook to obey.', reveal: 'questions' },
    { text: 'And the output is a list of areas worth improving, not a pass or fail grade.', reveal: 'improve' },
    { text: 'The framework is built on six pillars, and we will go through them one at a time.', reveal: 'foot', holdMs: 400 },
  ],
}

const s36: Slide = {
  id: 's36-wa-tool',
  navLabel: 'The Well-Architected Tool',
  title: 'The Well-Architected',
  subtitle: 'Tool',
  sourceSlides: [40],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'AWS provides a free service for reviewing your workloads against the framework.',
    steps: [
      { id: 'identify', label: 'Identify the workload', body: 'Choose what to document, then answer a series of questions about its architecture.', tint: BLUE },
      { id: 'review', label: 'Review against the pillars', body: 'Your answers are measured against the six pillars of the framework.', tint: ELECTRIC },
      { id: 'report', label: 'Get recommendations', body: 'A report of improvements, plus videos and documentation, in one dashboard.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'The tool costs nothing. The only investment is being honest in the answers.' },
  },
  script: [
    { text: 'AWS also provides a service for reviewing your workloads, at no charge. It is called the Well-Architected Tool.', reveal: 'intro' },
    { text: 'First you identify the workload you want to document, and answer a series of questions about its architecture.', reveal: 'identify' },
    { text: 'Your answers are then reviewed against the six pillars of the framework.', reveal: 'review' },
    { text: 'And the tool returns recommendations for making the workload more reliable, secure, efficient, and cost effective, together with videos and documentation, in a single dashboard.', reveal: 'report' },
    { text: 'The tool costs nothing. The only real investment is being honest in the answers.', reveal: 'foot', holdMs: 400 },
  ],
}

const s37: Slide = {
  id: 's37-design-principles',
  navLabel: 'General design principles',
  title: 'General Design',
  subtitle: 'Principles',
  sourceSlides: [41],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Six habits that separate cloud architecture from data centre architecture.',
    columns: 3,
    cards: [
      { id: 'capacity', label: 'Stop guessing capacity', body: 'Automate how capacity is met, and you avoid both idle resources and outages.', tint: BLUE },
      { id: 'test', label: 'Test at production scale', body: 'Create a full-size test environment on demand, then shut it down afterwards.', tint: ELECTRIC },
      { id: 'automate', label: 'Automate experimentation', body: 'Replicating a workload cheaply makes architectural experiments affordable.', tint: ORANGE },
      { id: 'evolve', label: 'Allow evolutionary architectures', body: 'Businesses change. The cloud lets the architecture change with them.', tint: VIOLET },
      { id: 'data', label: 'Drive architecture with data', body: 'Collect evidence about how the workload behaves, then decide.', tint: MINT },
      { id: 'gameday', label: 'Improve through game days', body: 'Simulate production events on a schedule, and find out what actually breaks.', tint: ROSE },
    ],
  },
  script: [
    { text: 'Before the pillars, the framework sets out six general design principles. They are the habits that separate cloud architecture from data centre architecture.', reveal: 'intro' },
    { text: 'Stop guessing your capacity needs. Automate how capacity is met, and you avoid both expensive idle resources and outages from guessing too low.', reveal: 'capacity' },
    { text: 'Test systems at production scale. Create a full-size test environment on demand, run the test, and decommission it afterwards.', reveal: 'test' },
    { text: 'Automate to make architectural experimentation easier. When replicating a workload is cheap, experiments become affordable.', reveal: 'automate' },
    { text: 'Allow for evolutionary architectures. Businesses change quickly, and the cloud lets the architecture change with them rather than being fixed for years.', reveal: 'evolve' },
    { text: 'Drive architectures using data. Collect evidence about how your workload actually behaves, then make decisions from it.', reveal: 'data' },
    { text: 'And improve through game days. Schedule simulations of real production events, and find out what breaks while you are watching.', reveal: 'gameday', holdMs: 400 },
  ],
}

const s38: Slide = {
  id: 's38-pillars-one',
  navLabel: 'Pillars 1 to 3',
  title: 'The Six Pillars',
  subtitle: 'Operations, Security, Reliability',
  sourceSlides: [42, 43, 44],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'The first three pillars deal with running systems, protecting them, and keeping them up.',
    columns: 3,
    cards: [
      { id: 'ops', label: 'Operational excellence', eyebrow: 'Pillar one', body: 'Running and monitoring systems to deliver business value, and improving the processes around them.', tint: BLUE },
      { id: 'sec', label: 'Security', eyebrow: 'Pillar two', body: 'Protecting data, systems, and assets. Identity management, data protection, and detecting threats.', tint: ROSE },
      { id: 'rel', label: 'Reliability', eyebrow: 'Pillar three', body: 'Recovering from failure and continuing to function. Backup, failover, and staying available.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Reliability is where auto scaling belongs: the system replaces what it loses without anyone being paged.' },
  },
  script: [
    { text: 'The first three pillars deal with running systems, protecting them, and keeping them up.', reveal: 'intro' },
    { text: 'Operational excellence focuses on running and monitoring systems to deliver business value, and on continually improving the processes and procedures around them.', reveal: 'ops' },
    { text: 'The security pillar focuses on protecting data, systems, and assets. It covers identity management, data protection, and detecting and responding to threats.', reveal: 'sec' },
    { text: 'The reliability pillar ensures systems can recover from failure and keep functioning. It includes backup, failover, and designing so the service stays available.', reveal: 'rel' },
    { text: 'Reliability is also where auto scaling belongs. The system replaces what it loses without anyone being paged at three in the morning.', reveal: 'foot', holdMs: 400 },
  ],
}

const s39: Slide = {
  id: 's39-pillars-two',
  navLabel: 'Pillars 4 to 6',
  title: 'The Six Pillars',
  subtitle: 'Performance, Cost, Sustainability',
  sourceSlides: [45, 46, 47, 48],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'The last three deal with efficiency: of machines, of money, and of energy.',
    columns: 3,
    cards: [
      { id: 'perf', label: 'Performance efficiency', eyebrow: 'Pillar four', body: 'Using resources efficiently to meet demand. Choosing the right services and scaling as needed.', tint: ELECTRIC },
      { id: 'cost', label: 'Cost optimisation', eyebrow: 'Pillar five', body: 'Avoiding unnecessary cost. Pay only for what you use, and keep reviewing it.', tint: GOLD },
      { id: 'sus', label: 'Sustainability', eyebrow: 'Pillar six', body: 'Reducing the energy and resources a workload consumes to do its job.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Sustainability is shared too. AWS is responsible for sustainability OF the cloud; you are responsible for sustainability IN it, through the code and storage choices you make.' },
  },
  script: [
    { text: 'The last three pillars all deal with efficiency: of machines, of money, and of energy.', reveal: 'intro' },
    { text: 'Performance efficiency focuses on using resources efficiently to meet system demands. It involves selecting the right services and scaling as the load changes.', reveal: 'perf' },
    { text: 'Cost optimisation ensures you avoid unnecessary costs and get value from what you spend. Pay only for what you use, and keep reviewing it.', reveal: 'cost' },
    { text: 'And sustainability focuses on reducing the energy and resources a workload consumes to do its job. Data storage choices, code efficiency, and how much you leave running all count.', reveal: 'sus' },
    { text: 'Sustainability is shared, like security. AWS is responsible for sustainability of the cloud, the buildings, cooling, and power. You are responsible for sustainability in the cloud, through your code and your storage choices.', reveal: 'foot', holdMs: 400 },
  ],
}

const s40: Slide = {
  id: 's40-complete',
  navLabel: 'Module complete',
  title: 'Module 1 Complete',
  sourceSlides: [49],
  scene: 'outro',
  script: [
    { text: 'That is the end of Module One.', reveal: 'done', holdMs: 300 },
    { text: 'You now know what AWS is and what it gives you, what the cloud actually is, which deployment and service models exist, and where your responsibility begins and ends.', reveal: 'covered' },
    { text: 'You have seen the global network of regions, zones, and edge locations, how accounts and APIs work, and the framework AWS uses to judge a good architecture.', holdMs: 300 },
    { text: 'Module Two, Identity and Access Management, builds directly on these foundations. Well done, and see you there.', reveal: 'next', holdMs: 500 },
  ],
}

export const slidesPart2: Slide[] = [
  s21, s22, s23, s24, s25, s26, s27, s28, s29, s30,
  s31, s32, s33, s34, s35, s36, s37, s38, s39, s40,
]
