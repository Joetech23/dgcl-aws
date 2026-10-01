import type { Slide } from '@/lib/course/types'

/**
 * Module 4: Amazon Simple Storage Service (S3), Block and File Storage.
 *
 * From Simple-Storage-Service-(S3)-Block-File Storage.pptx, 50 slides, in
 * deck order. Diagrams and screenshots are rebuilt as cards and steps; the
 * JSON policies and CLI commands become live listings. Where AWS has changed
 * since the deck was written (ACLs off by default, encryption on by default,
 * S3 Select closed to new customers, EventBridge as a destination) the slide
 * keeps the deck's content and adds a short note on what AWS does today.
 *
 * Scripts follow the house rules: plain spoken English, no em dashes.
 */

const BLUE = '#000099'
const ELECTRIC = '#0000BC'
const ORANGE = '#F5871F'
const VIOLET = '#7A5AF8'
const MINT = '#12B981'
const ROSE = '#E5484D'
const TEAL = '#0E9AA7'
const GOLD = '#C98A00'

const b01: Slide = {
  id: 'b01-title',
  navLabel: 'Welcome to S3',
  title: 'Amazon S3, Block and File Storage',
  sourceSlides: [1, 2],
  scene: 'module-title',
  data: {
    kind: 'module-title',
    title: 'Amazon S3, Block and File Storage',
    points: ['Buckets and objects', 'Storage classes', 'Securing buckets', 'Versioning and replication', 'Static websites'],
  },
  script: [
    { text: 'Welcome to Module Four of AWS Cloud Training: Amazon Simple Storage Service, known as S3, together with block and file storage.', reveal: 'title', holdMs: 200 },
    { text: 'S3 is where most data on AWS ends up: photos, backups, logs, whole websites.', reveal: 'sub' },
    { text: 'In this module you will learn how S3 stores data, how to choose the right storage class, how to secure a bucket, and how to host a website straight from S3.', reveal: 'points', holdMs: 400 },
  ],
}

const b02: Slide = {
  id: 'b02-storage-types',
  navLabel: 'File, block and object',
  title: 'Storage on',
  subtitle: 'AWS',
  sourceSlides: [3, 8],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'AWS stores data in three ways. Each one has its own service.',
    columns: 3,
    cards: [
      { id: 'file', label: 'File storage', eyebrow: 'Amazon EFS', body: 'Folders and files, shared by many servers at once, like a network drive.', tint: GOLD },
      { id: 'object', label: 'Object storage', eyebrow: 'Amazon S3', body: 'Whole files as objects in a bucket, reached over the web from anywhere.', tint: BLUE },
      { id: 'block', label: 'Block storage', eyebrow: 'Amazon EBS', body: 'A raw disk attached to one server, fast enough for databases.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'You met EBS and EFS in Module 3. This module is mostly about S3.' },
  },
  script: [
    { text: 'AWS stores data in three different ways, and each one has its own service.', reveal: 'intro' },
    { text: 'File storage keeps folders and files that many servers can share at the same time, like a network drive. On AWS that is Amazon EFS.', reveal: 'file' },
    { text: 'Object storage keeps whole files as objects inside a bucket, and you reach them over the web from anywhere. That is Amazon S3.', reveal: 'object' },
    { text: 'Block storage is a raw disk attached to a single server, fast enough to run a database. That is Amazon EBS.', reveal: 'block' },
    { text: 'You met EBS and EFS in Module Three. This module is mostly about S3.', reveal: 'foot', holdMs: 300 },
    { text: 'Sort each job to the kind of storage that fits it.', gate: true },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Which kind of storage fits each job?',
    buckets: [
      { id: 'file', label: 'File (EFS)' },
      { id: 'object', label: 'Object (S3)' },
      { id: 'block', label: 'Block (EBS)' },
    ],
    chips: [
      { id: 'c1', label: 'Product photos for an online shop, loaded by browsers', bucket: 'object', why: 'Object storage. Each photo is a whole file, fetched over the web by its URL.' },
      { id: 'c2', label: 'The disk for a busy database server', bucket: 'block', why: 'Block storage. A database needs a fast disk attached directly to its server.' },
      { id: 'c3', label: 'A shared folder that ten web servers read at once', bucket: 'file', why: 'File storage. Many servers can mount the same file system together.' },
      { id: 'c4', label: 'Nightly backups kept for seven years', bucket: 'object', why: 'Object storage. S3 is cheap and extremely durable for long-term copies.' },
    ],
    successNote: 'Shared folders: file. A server disk: block. Anything you store and fetch whole: object.',
  },
}

const b03: Slide = {
  id: 'b03-what-is-s3',
  navLabel: 'What S3 is',
  title: 'Amazon Simple',
  subtitle: 'Storage Service (S3)',
  sourceSlides: [4],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'S3 is object storage that scales without limit, built for durability, availability, security and performance.',
    columns: 3,
    cards: [
      { id: 'durable', label: 'Eleven nines of durability', eyebrow: '99.999999999%', body: 'Store ten million objects and expect to lose one every ten thousand years.', tint: BLUE },
      { id: 'scale', label: 'Unlimited storage', eyebrow: 'No capacity to plan', body: 'Store as much as you like. Each object can be up to 5 TB.', tint: MINT },
      { id: 'uses', label: 'Stores almost anything', eyebrow: 'Many uses', body: 'Websites, mobile apps, backups, archives, IoT data and analytics.', tint: ORANGE },
    ],
  },
  script: [
    { text: 'Amazon S3 is object storage that scales without limit, built for durability, availability, security, and performance.', reveal: 'intro' },
    { text: 'It is designed for eleven nines of durability. Store ten million objects, and you would expect to lose one roughly every ten thousand years.', reveal: 'durable' },
    { text: 'There is no capacity to plan. You store as much as you like, and a single object can be up to five terabytes.', reveal: 'scale' },
    { text: 'That is why it holds websites, mobile app data, backups, archives, data from IoT devices, and big data for analytics.', reveal: 'uses', holdMs: 400 },
  ],
}

const b04: Slide = {
  id: 'b04-key-features',
  navLabel: 'Key features',
  title: 'Key',
  subtitle: 'Features',
  sourceSlides: [5, 6],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'buckets', label: 'Objects and buckets', body: 'Files are stored as objects inside containers called buckets.', tint: BLUE },
      { id: 'security', label: 'Security', body: 'Private by default, with policies, encryption and logging.', tint: ROSE },
      { id: 'versioning', label: 'Versioning', body: 'Keep every version of an object, and undo mistakes.', tint: VIOLET },
      { id: 'lifecycle', label: 'Lifecycle management', body: 'Move or delete objects automatically as they age.', tint: TEAL },
      { id: 'events', label: 'Event notifications', body: 'Trigger other services when an object arrives or changes.', tint: ORANGE },
      { id: 'reach', label: 'Global reach', body: 'Reach your data from anywhere with a URL.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Every object has a URL, e.g. https://bucket-name.s3.region.amazonaws.com/key-name' },
  },
  script: [
    { text: 'S3 stores files as objects inside containers called buckets.', reveal: 'buckets' },
    { text: 'It is private by default, and secured with policies, encryption, and logging.', reveal: 'security' },
    { text: 'Versioning keeps every version of an object, so you can undo mistakes.', reveal: 'versioning' },
    { text: 'Lifecycle management moves or deletes objects automatically as they age, which keeps costs down.', reveal: 'lifecycle' },
    { text: 'Event notifications can trigger other services when an object arrives or changes.', reveal: 'events' },
    { text: 'And you can reach your data from anywhere in the world.', reveal: 'reach' },
    { text: 'Every object has its own web address, made of the bucket name, the Region, and the object key.', reveal: 'foot', holdMs: 300 },
  ],
}

const b05: Slide = {
  id: 'b05-buckets-objects',
  navLabel: 'Buckets, keys and objects',
  title: 'More About',
  subtitle: 'Buckets',
  sourceSlides: [7],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A bucket, a key and a version ID together identify exactly one object.',
    columns: 3,
    cards: [
      { id: 'key', label: 'Key', eyebrow: 'Up to 1,024 bytes', body: 'The object’s full name, e.g. finance-bucket/last-year-folder/report.xls', tint: BLUE },
      { id: 'value', label: 'Value', eyebrow: 'The data', body: 'The contents of the file itself, stored as binary.', tint: MINT },
      { id: 'version', label: 'Version ID', eyebrow: 'When versioning is on', body: 'Tells versions of the same key apart.', tint: VIOLET },
      { id: 'metadata', label: 'Metadata', eyebrow: 'About the object', body: 'Content type, size, dates and your own tags.', tint: ORANGE },
      { id: 'prefix', label: 'Prefixes, not folders', eyebrow: 'Flat storage', body: 'A key like last-year-folder/report.xls only looks like a folder. Everything sits at the bucket’s root.', tint: TEAL },
      { id: 'acl', label: 'Subresources', eyebrow: 'Access control', body: 'Extras attached to an object, such as its access control list.', tint: ROSE },
    ],
  },
  script: [
    { text: 'Inside a bucket, the bucket name, the key, and the version ID together identify exactly one object.', reveal: 'intro' },
    { text: 'The key is the object’s full name, up to one thousand and twenty four bytes long.', reveal: 'key' },
    { text: 'The value is the data itself, stored as binary.', reveal: 'value' },
    { text: 'When versioning is on, a version ID tells different versions of the same key apart.', reveal: 'version' },
    { text: 'Metadata describes the object: its type, size, dates, and any tags you add.', reveal: 'metadata' },
    { text: 'There are no real folders. A key with slashes in it only looks like a folder path. S3 calls that part a prefix, and every object actually sits at the root of the bucket.', reveal: 'prefix' },
    { text: 'Finally, subresources such as an access control list can be attached to an object.', reveal: 'acl', holdMs: 300 },
  ],
}

const b06: Slide = {
  id: 'b06-use-cases',
  navLabel: 'Use cases',
  title: 'S3',
  subtitle: 'Use Cases',
  sourceSlides: [9],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'assets', label: 'Application assets', body: 'Images, videos and files your apps serve.', tint: BLUE },
      { id: 'website', label: 'Static websites', body: 'Host a whole website straight from a bucket.', tint: MINT },
      { id: 'backup', label: 'Backup and recovery', body: 'Durable copies, ready when disaster strikes.', tint: ROSE },
      { id: 'archive', label: 'Data archive', body: 'Keep records for years at a very low cost.', tint: VIOLET },
      { id: 'analytics', label: 'Analytics', body: 'A data lake that analytics tools query in place.', tint: ORANGE },
      { id: 'hybrid', label: 'Hybrid cloud', body: 'Extend on-premises storage into AWS.', tint: TEAL },
    ],
    footnote: { id: 'foot', text: 'Nasdaq keeps seven years of data in S3 Glacier. Nielsen stores 30 petabytes in S3 for TV ratings.' },
  },
  script: [
    { text: 'Here is what people use S3 for. Storing application assets, such as images and videos.', reveal: 'assets' },
    { text: 'Hosting static websites straight from a bucket.', reveal: 'website' },
    { text: 'Backup and disaster recovery.', reveal: 'backup' },
    { text: 'Archiving records for years at very low cost.', reveal: 'archive' },
    { text: 'Holding large amounts of data for analytics.', reveal: 'analytics' },
    { text: 'And hybrid cloud storage, extending a company’s own data centre into AWS.', reveal: 'hybrid' },
    { text: 'Real examples: Nasdaq keeps seven years of data in S3 Glacier, and Nielsen stores thirty petabytes in S3 to produce television ratings.', reveal: 'foot', holdMs: 400 },
  ],
}

const b07: Slide = {
  id: 'b07-global-regional',
  navLabel: 'Global service, regional buckets',
  title: 'S3 Is Global,',
  subtitle: 'Buckets Are Regional',
  sourceSlides: [10],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'You manage S3 from one global console, but every bucket lives in the Region you choose.',
    columns: 3,
    cards: [
      { id: 'close', label: 'Close to users', eyebrow: 'Speed', body: 'Pick a Region near the people who use the data.', tint: BLUE },
      { id: 'rules', label: 'Compliance', eyebrow: 'Law', body: 'S3 never copies your data out of its Region unless you ask it to.', tint: ROSE },
      { id: 'replicate', label: 'Replication', eyebrow: 'Your choice', body: 'Copy objects to another Region, or the same one, when you want.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Bucket names are global, though: no two buckets anywhere can share a name.' },
  },
  script: [
    { text: 'S3 is a global service. You manage it from one console, but every bucket lives in the Region you choose when you create it.', reveal: 'intro' },
    { text: 'Choose a Region close to the people who will use the data, so it loads quickly.', reveal: 'close' },
    { text: 'Choose it for the law, too. S3 never copies your data outside its Region, which helps you meet compliance requirements.', reveal: 'rules' },
    { text: 'If you do want copies elsewhere, you switch on replication, to another Region or within the same one.', reveal: 'replicate' },
    { text: 'One thing is global: bucket names. No two buckets anywhere in the world can share a name.', reveal: 'foot', holdMs: 400 },
  ],
}

const b08: Slide = {
  id: 'b08-pricing',
  navLabel: 'How S3 is priced',
  title: 'S3',
  subtitle: 'Pricing',
  sourceSlides: [11],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'You pay for what you store, what you ask for, and what leaves AWS.',
    columns: 3,
    cards: [
      { id: 'storage', label: 'Storage', eyebrow: 'Per GB per month', body: 'Depends on how much you store and in which storage class.', tint: BLUE },
      { id: 'requests', label: 'Requests', eyebrow: 'Per request', body: 'Uploads, downloads and listings each cost a tiny amount.', tint: ORANGE },
      { id: 'lifecycle', label: 'Lifecycle management', eyebrow: 'Per transition', body: 'Moving objects between classes.', tint: VIOLET },
      { id: 'transfer', label: 'Data transfer out', eyebrow: 'Per GB', body: 'Data leaving AWS to the internet. Data coming in is free.', tint: ROSE },
      { id: 'accel', label: 'Transfer Acceleration', eyebrow: 'Optional', body: 'Faster uploads through AWS edge locations.', tint: MINT },
    ],
  },
  script: [
    { text: 'S3 pricing comes down to three things: what you store, what you ask for, and what leaves AWS.', reveal: 'intro' },
    { text: 'Storage is charged per gigabyte each month, and the price depends on the storage class.', reveal: 'storage' },
    { text: 'Every request, such as an upload, a download, or a listing, costs a tiny amount.', reveal: 'requests' },
    { text: 'Lifecycle management charges for moving objects between classes.', reveal: 'lifecycle' },
    { text: 'Data transferred out to the internet is charged per gigabyte. Data coming in is free.', reveal: 'transfer' },
    { text: 'And Transfer Acceleration, if you turn it on, costs extra for faster uploads.', reveal: 'accel', holdMs: 400 },
  ],
}

const b09: Slide = {
  id: 'b09-storage-classes',
  navLabel: 'Storage classes',
  title: 'S3 Storage',
  subtitle: 'Classes',
  sourceSlides: [12, 13],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Every class keeps eleven nines of durability. They differ in price, speed and how often you expect to read the data.',
    columns: 4,
    cards: [
      { id: 'standard', label: 'S3 Standard', eyebrow: 'Frequent access', body: 'Active data, read all the time. Milliseconds.', tint: BLUE },
      { id: 'intelligent', label: 'Intelligent-Tiering', eyebrow: 'Unknown pattern', body: 'Moves data between tiers for you as use changes.', tint: VIOLET },
      { id: 'ia', label: 'Standard-IA', eyebrow: 'Infrequent access', body: 'Cheaper storage, but a fee each time you read.', tint: TEAL },
      { id: 'onezone', label: 'One Zone-IA', eyebrow: 'One AZ only', body: 'Cheaper still, for data you can recreate.', tint: ORANGE },
      { id: 'instant', label: 'Glacier Instant Retrieval', eyebrow: 'Archive, fast', body: 'Rarely read, but back in milliseconds.', tint: MINT },
      { id: 'flexible', label: 'Glacier Flexible Retrieval', eyebrow: 'Archive', body: 'Back in minutes to hours.', tint: ELECTRIC },
      { id: 'deep', label: 'Glacier Deep Archive', eyebrow: 'Cheapest', body: 'Long-term records. Back within hours.', tint: ROSE },
    ],
  },
  script: [
    { text: 'S3 offers several storage classes. Every one keeps eleven nines of durability. They differ in price, speed, and how often you expect to read the data.', reveal: 'intro' },
    { text: 'S3 Standard is for active data you read all the time, returned in milliseconds.', reveal: 'standard' },
    { text: 'Intelligent-Tiering is for data whose use you cannot predict. It moves objects between tiers for you.', reveal: 'intelligent' },
    { text: 'Standard Infrequent Access costs less to store, but charges a fee each time you read.', reveal: 'ia' },
    { text: 'One Zone Infrequent Access is cheaper still, because it keeps data in a single Availability Zone. Use it for data you could recreate.', reveal: 'onezone' },
    { text: 'Glacier Instant Retrieval is an archive that still returns data in milliseconds.', reveal: 'instant' },
    { text: 'Glacier Flexible Retrieval returns data in minutes to hours.', reveal: 'flexible' },
    { text: 'And Glacier Deep Archive is the cheapest of all, for long-term records you can wait hours to get back.', reveal: 'deep', holdMs: 300 },
    { text: 'Now choose the class for each kind of data.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which storage class fits?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'Product images on a busy shopping site, loaded thousands of times an hour.',
        options: [
          { id: 'a', label: 'S3 Standard', correct: true, feedback: 'Yes. Frequently read data belongs in Standard, with no retrieval fees.' },
          { id: 'b', label: 'Glacier Deep Archive', feedback: 'Deep Archive can take hours to return a file. Shoppers will not wait.' },
          { id: 'c', label: 'One Zone-IA', feedback: 'Infrequent Access charges for every read, and these images are read constantly.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Financial records the law says you must keep for seven years, and will probably never read.',
        options: [
          { id: 'a', label: 'S3 Standard', feedback: 'It would work, but you would pay top price for data nobody reads.' },
          { id: 'b', label: 'Glacier Deep Archive', correct: true, feedback: 'Correct. The cheapest class, and waiting hours for a rare retrieval is fine.' },
          { id: 'c', label: 'Intelligent-Tiering', feedback: 'Useful when you cannot predict use. Here you know it will almost never be read.' },
        ],
      },
      {
        id: 'q3',
        scenario: 'Thumbnails you can regenerate from the originals at any time, read now and then.',
        options: [
          { id: 'a', label: 'One Zone-IA', correct: true, feedback: 'Right. Cheap, infrequent, and losing one zone costs you nothing you cannot remake.' },
          { id: 'b', label: 'Glacier Flexible Retrieval', feedback: 'Minutes to hours is too slow for images people are waiting to see.' },
          { id: 'c', label: 'S3 Standard', feedback: 'Fine, but you are paying for resilience these copies do not need.' },
        ],
      },
    ],
  },
}

const b10: Slide = {
  id: 'b10-bucket-policy',
  navLabel: 'Bucket policies',
  title: 'S3 Bucket',
  subtitle: 'Policy',
  sourceSlides: [14],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'A bucket policy is a JSON policy attached to the bucket itself. This one lets the IAM user Joe list and download everything in my-test-bucket.',
    code: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [',
      '    {',
      '      "Effect": "Allow",',
      '      "Principal": {',
      '        "AWS": "arn:aws:iam::111111222222:user/Joe"',
      '      },',
      '      "Action": ["s3:GetObject", "s3:ListBucket"],',
      '      "Resource": [',
      '        "arn:aws:s3:::my-test-bucket",',
      '        "arn:aws:s3:::my-test-bucket/*"',
      '      ]',
      '    }',
      '  ]',
      '}',
    ],
    highlights: [
      { id: 'effect', lines: [5, 5], label: 'Allow', body: 'This statement grants access.' },
      { id: 'principal', lines: [6, 8], label: 'Principal: who', body: 'Only bucket policies name a principal. Here, the user Joe.' },
      { id: 'action', lines: [9, 9], label: 'Action: what', body: 'Download objects and list the bucket.' },
      { id: 'resource', lines: [10, 13], label: 'Resource: where', body: 'The bucket for listing, and every object in it (/*) for downloading.' },
    ],
  },
  script: [
    { text: 'A bucket policy is a JSON policy, like the IAM policies from Module Two, but attached to the bucket itself. This one lets a user called Joe list and download everything in a bucket.', reveal: 'intro' },
    { text: 'The effect is allow, so this statement grants access.', reveal: 'effect' },
    { text: 'The principal says who. Bucket policies name a principal; identity policies do not need one. Here it is the IAM user Joe.', reveal: 'principal' },
    { text: 'The actions say what: get objects, and list the bucket.', reveal: 'action' },
    { text: 'And the resource says where: the bucket itself for listing, and every object inside it, shown by slash star, for downloading.', reveal: 'resource', holdMs: 400 },
  ],
}

const b11: Slide = {
  id: 'b11-acls',
  navLabel: 'Access control lists',
  title: 'S3 ACLs',
  subtitle: '(Access Control Lists)',
  sourceSlides: [15],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'An ACL grants access to a single bucket or object. It is the older way of controlling S3 access.',
    columns: 2,
    cards: [
      { id: 'grantee', label: 'Grantee', eyebrow: 'Who', body: 'An AWS account, or a predefined S3 group, receiving permission.', tint: BLUE },
      { id: 'perms', label: 'Permissions', eyebrow: 'What', body: 'READ, WRITE, READ_ACP, WRITE_ACP or FULL_CONTROL.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Today: new buckets have ACLs switched off (Object Ownership, bucket owner enforced). AWS recommends policies instead.' },
  },
  script: [
    { text: 'An access control list, or ACL, grants access to a single bucket or a single object. It is the older way of controlling access to S3.', reveal: 'intro' },
    { text: 'Each entry names a grantee: an AWS account, or one of the predefined S3 groups.', reveal: 'grantee' },
    { text: 'And the permission it gets: read, write, read the ACL, write the ACL, or full control.', reveal: 'perms' },
    { text: 'Things have moved on. New buckets now have ACLs switched off by default, and AWS recommends using policies instead.', reveal: 'foot', holdMs: 400 },
  ],
}

const b12: Slide = {
  id: 'b12-policy-vs-acl',
  navLabel: 'Policies versus ACLs',
  title: 'Bucket Policies vs',
  subtitle: 'ACLs',
  sourceSlides: [16],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Bucket policies',
      tint: MINT,
      items: [
        { id: 'p1', label: 'Whole-bucket rules', body: 'Decide who can do what to every object in the bucket.' },
        { id: 'p2', label: 'Recommended', body: 'More flexible, easier to scale, one place to read.' },
      ],
    },
    right: {
      title: 'ACLs',
      tint: ORANGE,
      items: [
        { id: 'a1', label: 'Per-object rules', body: 'Grant access to one object at a time.' },
        { id: 'a2', label: 'Rarely needed now', body: 'Only for unusual per-object cases.' },
      ],
    },
    footnote: { id: 'foot', text: 'Rule of thumb: use bucket policies, and leave ACLs off.' },
  },
  script: [
    { text: 'So which should you use? Bucket policies work at the bucket level, deciding who can do what to every object inside.', reveal: 'p1' },
    { text: 'They are recommended, because they are more flexible, scale better, and keep your rules in one place.', reveal: 'p2' },
    { text: 'ACLs grant access one object at a time.', reveal: 'a1' },
    { text: 'There are rare cases where that is needed, but the overall trend is away from them.', reveal: 'a2' },
    { text: 'The rule of thumb: use bucket policies, and leave ACLs off.', reveal: 'foot', holdMs: 400 },
  ],
}

const b13: Slide = {
  id: 'b13-which-policy',
  navLabel: 'IAM or bucket policy?',
  title: 'When to Use',
  subtitle: 'Which Policy?',
  sourceSlides: [24, 27, 28],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Use IAM policies if',
      tint: BLUE,
      items: [
        { id: 'i1', label: 'You control more than S3', body: 'Manage all your permissions in one place.' },
        { id: 'i2', label: 'You have many buckets', body: 'A few IAM policies beat dozens of bucket policies.' },
      ],
    },
    right: {
      title: 'Use bucket policies if',
      tint: ORANGE,
      items: [
        { id: 'b1', label: 'Another account needs access', body: 'Simple cross-account access, without IAM roles.' },
        { id: 'b2', label: 'Your rules are big', body: 'Bucket policies allow 20 KB; IAM policies far less.' },
      ],
    },
  },
  script: [
    { text: 'You can control S3 access from either side. Use IAM policies when you manage access to more than just S3, so all your permissions live in one place.', reveal: 'i1' },
    { text: 'And when you have many buckets, since a few detailed IAM policies are easier than dozens of bucket policies.', reveal: 'i2' },
    { text: 'Use bucket policies when you want a simple way to give another AWS account access, without setting up IAM roles.', reveal: 'b1' },
    { text: 'Or when your rules are large. A bucket policy can be up to twenty kilobytes, far more than an IAM policy allows.', reveal: 'b2', holdMs: 300 },
    { text: 'Choose the right policy for each situation.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'IAM policy or bucket policy?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A partner company’s AWS account needs to read files from one of your buckets.',
        options: [
          { id: 'a', label: 'A bucket policy', correct: true, feedback: 'Yes. A bucket policy can name the other account as the principal directly.' },
          { id: 'b', label: 'An IAM policy in your account', feedback: 'IAM policies only apply to identities in your own account, not a partner’s.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Your developers need access to EC2, DynamoDB and several S3 buckets.',
        options: [
          { id: 'a', label: 'A bucket policy on each bucket', feedback: 'That covers S3 only, and spreads their permissions across many places.' },
          { id: 'b', label: 'An IAM policy for the developers group', correct: true, feedback: 'Correct. One IAM policy manages all their access, S3 and beyond, in one place.' },
        ],
      },
    ],
  },
}

const b14: Slide = {
  id: 'b14-evaluation',
  navLabel: 'How access is decided',
  title: 'How a Request',
  subtitle: 'Is Decided',
  sourceSlides: [25],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Every S3 request is checked against all the policies that apply, in this order.',
    steps: [
      { id: 'request', label: 'Request', body: 'Someone asks to read, write or delete.', tint: BLUE },
      { id: 'deny', label: 'Any Deny?', body: 'An explicit Deny anywhere ends it: refused.', tint: ROSE },
      { id: 'allow', label: 'Any Allow?', body: 'If something allows it: approved.', tint: MINT },
      { id: 'default', label: 'Otherwise', body: 'Nothing allows it: refused by default.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'An explicit Deny always wins, however many Allows there are.' },
  },
  script: [
    { text: 'When a request reaches S3, it is checked against every policy that applies, in a fixed order.', reveal: 'intro' },
    { text: 'First, the request arrives: someone wants to read, write, or delete.', reveal: 'request' },
    { text: 'AWS looks for an explicit deny in any of the policies. If it finds one, the request is refused, and checking stops.', reveal: 'deny' },
    { text: 'If there is no deny, it looks for an allow. If one applies, the request is approved.', reveal: 'allow' },
    { text: 'And if nothing allows it, the answer is deny, by default.', reveal: 'default' },
    { text: 'So an explicit deny always wins, however many allows there are.', reveal: 'foot', holdMs: 400 },
  ],
}

const b15: Slide = {
  id: 'b15-versioning',
  navLabel: 'Versioning',
  title: 'Amazon S3',
  subtitle: 'Versioning',
  sourceSlides: [17, 18, 19],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Versioning keeps every version of every object, so you can recover from mistakes and deletions.',
    steps: [
      { id: 'off', label: 'Unversioned', body: 'The default. Overwriting replaces the file for good.', tint: ORANGE },
      { id: 'on', label: 'Enabled', body: 'Each upload gets a new version ID. Old ones are kept.', tint: MINT },
      { id: 'suspended', label: 'Suspended', body: 'No new versions, but existing ones stay.', tint: VIOLET },
    ],
    footnote: { id: 'foot', text: 'Once enabled, versioning can be suspended but never turned fully off. Each version is stored, and paid for.' },
  },
  script: [
    { text: 'Versioning keeps every version of every object in a bucket, so you can recover from accidents, failed apps, and deliberate deletions.', reveal: 'intro' },
    { text: 'A bucket starts unversioned. Upload a file with the same name, and the old one is gone for good.', reveal: 'off' },
    { text: 'Enable versioning, and each upload gets its own version ID. Upload photo dot gif twice, and both versions are kept.', reveal: 'on' },
    { text: 'You can later suspend versioning. New uploads stop creating versions, but the existing versions remain.', reveal: 'suspended' },
    { text: 'Remember: once enabled, versioning can be suspended but never switched fully off. And every version is stored, so every version costs money.', reveal: 'foot', holdMs: 400 },
  ],
}

const b16: Slide = {
  id: 'b16-replication',
  navLabel: 'Replication',
  title: 'Amazon S3',
  subtitle: 'Replication',
  sourceSlides: [20, 21, 22],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'Replication copies new objects to another bucket automatically, in the background.',
    left: {
      title: 'Same-Region Replication (SRR)',
      tint: BLUE,
      items: [
        { id: 'srr1', label: 'Same Region', body: 'Source and destination in one Region.' },
        { id: 'srr2', label: 'For example', body: 'Gather logs, or keep a copy in another account.' },
      ],
    },
    right: {
      title: 'Cross-Region Replication (CRR)',
      tint: MINT,
      items: [
        { id: 'crr1', label: 'Different Regions', body: 'A copy far away, safe from a regional outage.' },
        { id: 'crr2', label: 'For example', body: 'Disaster recovery, or data closer to users.' },
      ],
    },
    footnote: { id: 'foot', text: 'Replication Time Control (optional) promises most objects copy within 15 minutes.' },
  },
  script: [
    { text: 'Replication copies new objects to another bucket automatically, in the background. The buckets can belong to the same account, or to different accounts.', reveal: 'intro' },
    { text: 'Same-Region Replication copies between buckets in the same Region.', reveal: 'srr1' },
    { text: 'It is useful for gathering logs into one place, or keeping a copy in a separate account.', reveal: 'srr2' },
    { text: 'Cross-Region Replication copies to a bucket in a different Region, so your data survives even if a whole Region has an outage.', reveal: 'crr1' },
    { text: 'It is used for disaster recovery, and to put data closer to users.', reveal: 'crr2' },
    { text: 'If you need a guarantee, Replication Time Control copies most objects within fifteen minutes.', reveal: 'foot', holdMs: 400 },
  ],
}

const b17: Slide = {
  id: 'b17-replication-rules',
  navLabel: 'Replication requirements',
  title: 'Replication',
  subtitle: 'Requirements',
  sourceSlides: [23],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 2,
    cards: [
      { id: 'versioning', label: 'Versioning on both buckets', eyebrow: 'Required', body: 'Source and destination must both have versioning enabled.', tint: BLUE },
      { id: 'role', label: 'An IAM role for S3', eyebrow: 'Permission', body: 'S3 assumes a role to copy objects on your behalf. It can create one for you.', tint: ORANGE },
      { id: 'policy', label: 'A bucket policy across accounts', eyebrow: 'Two accounts', body: 'The destination account must let the source copy in.', tint: VIOLET },
      { id: 'regions', label: 'Regions enabled', eyebrow: 'Both sides', body: 'Each account must have its Region switched on.', tint: MINT },
    ],
  },
  script: [
    { text: 'Replication has a few requirements. Both the source and destination buckets must have versioning enabled.', reveal: 'versioning' },
    { text: 'S3 needs an IAM role to copy objects on your behalf. It can create one for you when you set replication up.', reveal: 'role' },
    { text: 'If the buckets are in two different accounts, the destination needs a bucket policy letting the source copy in. In one account, that is not needed.', reveal: 'policy' },
    { text: 'And each account must have its Region enabled.', reveal: 'regions', holdMs: 300 },
    { text: 'Check your understanding of replication.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Replication questions',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A London company wants a copy of its data in Frankfurt, in case the London Region goes down.',
        options: [
          { id: 'a', label: 'Cross-Region Replication', correct: true, feedback: 'Yes. A copy in a different Region protects against a regional outage.' },
          { id: 'b', label: 'Same-Region Replication', feedback: 'Both copies would be in London, so one outage could hit both.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Replication is set up, but nothing is being copied. What is most likely missing?',
        options: [
          { id: 'a', label: 'Versioning on the buckets', correct: true, feedback: 'Correct. Both buckets must have versioning enabled before replication works.' },
          { id: 'b', label: 'Transfer Acceleration', feedback: 'Acceleration speeds up uploads from users. Replication does not need it.' },
          { id: 'c', label: 'A static website', feedback: 'Website hosting has nothing to do with replication.' },
        ],
      },
    ],
  },
}

const b18: Slide = {
  id: 'b18-mfa-delete',
  navLabel: 'MFA Delete',
  title: 'MFA',
  subtitle: 'Delete',
  sourceSlides: [29, 30],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'MFA Delete asks for a second factor before anyone can delete a version or change versioning.',
    columns: 3,
    cards: [
      { id: 'risk', label: 'The risk', eyebrow: 'Why', body: 'Important data deleted or changed by mistake, or by an attacker.', tint: ROSE },
      { id: 'when', label: 'When to use it', eyebrow: 'Sensitive data', body: 'Regulated data (PCI, HIPAA, GDPR), or many people with delete rights.', tint: BLUE },
      { id: 'who', label: 'Who can turn it on', eyebrow: 'Root only', body: 'Only the bucket owner’s root account can enable MFA Delete.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Recommended by the CIS AWS Foundations Benchmark (v3.0.0, 2024).' },
  },
  script: [
    { text: 'MFA Delete adds an extra lock. Anyone deleting an object version, or changing the bucket’s versioning, must also give a multi-factor code.', reveal: 'intro' },
    { text: 'The risk it guards against is important data being deleted or changed, by mistake or by an attacker.', reveal: 'risk' },
    { text: 'Use it for sensitive or regulated data, such as card data, health records, or personal data under GDPR, and where many people can delete.', reveal: 'when' },
    { text: 'Only the bucket owner’s root account can switch it on.', reveal: 'who' },
    { text: 'It is recommended by the CIS Foundations Benchmark for AWS, a widely used security standard.', reveal: 'foot', holdMs: 400 },
  ],
}

const b19: Slide = {
  id: 'b19-mfa-policy',
  navLabel: 'MFA-protected access',
  title: 'MFA-Protected',
  subtitle: 'API Access',
  sourceSlides: [31],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'A bucket policy can refuse any request that was not made with MFA.',
    code: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [',
      '    {',
      '      "Effect": "Deny",',
      '      "Principal": "*",',
      '      "Action": "s3:*",',
      '      "Resource": "arn:aws:s3:::examplebucket/securedocuments/*",',
      '      "Condition": { "Null": { "aws:MultiFactorAuthAge": true } }',
      '    }',
      '  ]',
      '}',
    ],
    highlights: [
      { id: 'deny', lines: [5, 7], label: 'Deny everything, to everyone', body: 'Any action, by any principal...' },
      { id: 'where', lines: [8, 8], label: 'On the secure folder', body: '...on objects under securedocuments/...' },
      { id: 'cond', lines: [9, 9], label: 'When there is no MFA', body: '...if the request carries no MFA age, it was not made with MFA.' },
    ],
  },
  script: [
    { text: 'You can go further, and refuse any request that was not made with multi-factor authentication. This bucket policy does exactly that.', reveal: 'intro' },
    { text: 'It denies every action, to everyone.', reveal: 'deny' },
    { text: 'But only for objects under the secure documents prefix.', reveal: 'where' },
    { text: 'And only when the request has no MFA age, which means it was not made with MFA. Requests with MFA are unaffected by this statement.', reveal: 'cond', holdMs: 400 },
  ],
}

const b20: Slide = {
  id: 'b20-encryption',
  navLabel: 'Encryption at rest',
  title: 'Encryption',
  subtitle: 'at Rest',
  sourceSlides: [32, 33],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'S3 can encrypt your data as it writes it, and decrypt it as you read it.',
    columns: 4,
    cards: [
      { id: 'sses3', label: 'SSE-S3', eyebrow: 'Default', body: 'S3 manages the keys. On for every new object.', tint: MINT },
      { id: 'ssekms', label: 'SSE-KMS', eyebrow: 'Audit trail', body: 'Keys in AWS KMS: you control them, and every use is logged.', tint: BLUE },
      { id: 'ssec', label: 'SSE-C', eyebrow: 'Your keys', body: 'You send the key with each request. AWS never stores it.', tint: ORANGE },
      { id: 'client', label: 'Client-side', eyebrow: 'Before upload', body: 'You encrypt files yourself before sending them.', tint: VIOLET },
    ],
    footnote: { id: 'foot', text: 'Best practice: SSE-KMS for audit trails, rotate keys, and always use HTTPS so data is encrypted in transit too.' },
  },
  script: [
    { text: 'S3 can encrypt your data as it writes it to disk, and decrypt it when you read it back. There are four ways.', reveal: 'intro' },
    { text: 'SSE-S3, where S3 manages the keys. It is now switched on for every new object by default.', reveal: 'sses3' },
    { text: 'SSE-KMS keeps the keys in AWS Key Management Service, so you control them, and every use is logged.', reveal: 'ssekms' },
    { text: 'SSE-C lets you supply your own key with each request. AWS uses it and never stores it.', reveal: 'ssec' },
    { text: 'And client-side encryption means you encrypt files yourself before they are uploaded.', reveal: 'client' },
    { text: 'Best practice: use SSE-KMS when you need an audit trail, rotate your keys, and always use HTTPS so data is also encrypted in transit.', reveal: 'foot', holdMs: 300 },
    { text: 'Pick the right encryption for each case.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which encryption fits?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'Auditors want a record of every time an encryption key was used.',
        options: [
          { id: 'a', label: 'SSE-KMS', correct: true, feedback: 'Yes. KMS logs every use of a key in CloudTrail.' },
          { id: 'b', label: 'SSE-S3', feedback: 'Secure, but S3 manages the keys and you get no per-use record.' },
          { id: 'c', label: 'No encryption', feedback: 'S3 encrypts new objects by default anyway, and auditors would not accept none.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'Company rules say AWS must never see the data unencrypted, not even for a moment.',
        options: [
          { id: 'a', label: 'SSE-S3', feedback: 'S3 receives the data before encrypting it.' },
          { id: 'b', label: 'Client-side encryption', correct: true, feedback: 'Correct. The data is encrypted before it leaves your machine.' },
          { id: 'c', label: 'SSE-KMS', feedback: 'Still server-side: S3 sees the data before encrypting it.' },
        ],
      },
    ],
  },
}

const b21: Slide = {
  id: 'b21-events',
  navLabel: 'Event notifications',
  title: 'S3 Event',
  subtitle: 'Notifications',
  sourceSlides: [34, 35],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'S3 can announce what happens in a bucket, and start other work automatically.',
    left: {
      title: 'Events',
      tint: BLUE,
      items: [
        { id: 'e1', label: 'Object created or removed', body: 's3:ObjectCreated, s3:ObjectRemoved' },
        { id: 'e2', label: 'Replication and more', body: 's3:ObjectReplicated, failed or late replication' },
      ],
    },
    right: {
      title: 'Destinations',
      tint: ORANGE,
      items: [
        { id: 'd1', label: 'Lambda', body: 'Run code, e.g. make a thumbnail of every new photo.' },
        { id: 'd2', label: 'SNS, SQS or EventBridge', body: 'Send an alert, queue a job, or route the event anywhere.' },
      ],
    },
    footnote: { id: 'foot', text: 'This is the heart of event-driven, serverless designs on AWS.' },
  },
  script: [
    { text: 'Event notifications let S3 announce what happens in a bucket, and start other work automatically.', reveal: 'intro' },
    { text: 'The main events are an object being created, or an object being removed.', reveal: 'e1' },
    { text: 'There are also replication events, including when replication fails or runs late.', reveal: 'e2' },
    { text: 'The event can run a Lambda function, for example to make a thumbnail of every photo that is uploaded.', reveal: 'd1' },
    { text: 'Or send a message through SNS, add a job to an SQS queue, or pass it to EventBridge to route anywhere.', reveal: 'd2' },
    { text: 'This is the heart of event-driven, serverless design on AWS.', reveal: 'foot', holdMs: 400 },
  ],
}

const b22: Slide = {
  id: 'b22-presigned',
  navLabel: 'Pre-signed URLs',
  title: 'Pre-Signed',
  subtitle: 'URLs',
  sourceSlides: [36],
  scene: 'code',
  data: {
    kind: 'code',
    filename: 'terminal',
    intro: 'A pre-signed URL gives someone short-term access to one private object, with no AWS account needed.',
    code: [
      '# Share a private file for one hour (AWS CLI)',
      'aws s3 presign s3://my-bucket/presentation.ppt --expires-in 3600',
      '',
      '# The same from PowerShell',
      'Get-S3PreSignedURL -BucketName my-bucket -Key presentation.ppt `',
      '  -Expire (Get-Date).AddHours(1)',
      '',
      '# The link it prints carries its own signature:',
      'https://my-bucket.s3.amazonaws.com/presentation.ppt?X-Amz-Expires=3600&X-Amz-Signature=...',
    ],
    highlights: [
      { id: 'cli', lines: [1, 2], label: 'Create the link', body: 'One command, with an expiry in seconds.' },
      { id: 'ps', lines: [4, 6], label: 'Or from PowerShell', body: 'The deck’s method, with an expiry time.' },
      { id: 'url', lines: [8, 9], label: 'What you share', body: 'Your access key, expiry and signature are baked into the link.' },
    ],
    footnote: { id: 'foot', text: 'Use them for occasional private sharing, or to let an app upload and download without making the bucket public.' },
  },
  script: [
    { text: 'A pre-signed URL gives someone short-term access to one private object, without them needing an AWS account.', reveal: 'intro' },
    { text: 'From the AWS command line, one command creates the link, with an expiry time in seconds. Here, one hour.', reveal: 'cli' },
    { text: 'From PowerShell, the Get S3 PreSignedURL command does the same.', reveal: 'ps' },
    { text: 'The link carries its own signature and expiry time, so it simply stops working once the time is up.', reveal: 'url' },
    { text: 'Use them for occasional private sharing, or to let an application upload and download files without ever making the bucket public.', reveal: 'foot', holdMs: 400 },
  ],
}

const b23: Slide = {
  id: 'b23-multipart',
  navLabel: 'Multipart upload',
  title: 'Multipart',
  subtitle: 'Upload',
  sourceSlides: [37],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'One upload request can send at most 5 GB. Multipart upload sends a big file in pieces.',
    steps: [
      { id: 'split', label: 'Split', body: 'Break the file into parts.', tint: BLUE },
      { id: 'parallel', label: 'Upload in parallel', body: 'Send the parts at the same time. Retry only failed parts.', tint: ORANGE },
      { id: 'join', label: 'Reassemble', body: 'S3 joins the parts into one object.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Recommended above 100 MB, and required above 5 GB. Objects can be up to 5 TB.' },
  },
  script: [
    { text: 'A single upload request can send at most five gigabytes. For big files, S3 offers multipart upload.', reveal: 'intro' },
    { text: 'The file is split into parts.', reveal: 'split' },
    { text: 'The parts are uploaded in parallel, which is faster, and if one part fails, only that part is sent again.', reveal: 'parallel' },
    { text: 'When all the parts arrive, S3 joins them back into a single object.', reveal: 'join' },
    { text: 'AWS recommends multipart upload for anything over one hundred megabytes. Above five gigabytes it is required, up to the five terabyte limit.', reveal: 'foot', holdMs: 400 },
  ],
}

const b24: Slide = {
  id: 'b24-acceleration',
  navLabel: 'Transfer Acceleration',
  title: 'S3 Transfer',
  subtitle: 'Acceleration',
  sourceSlides: [38, 39],
  scene: 'code',
  data: {
    kind: 'code',
    filename: 'terminal',
    intro: 'Uploads go to the nearest AWS edge location, then travel to your bucket over AWS’s own fast network.',
    code: [
      '# Switch it on for a bucket',
      'aws s3api put-bucket-accelerate-configuration \\',
      '  --bucket my-bucket --accelerate-configuration Status=Enabled',
      '',
      '# Upload through the accelerated endpoint',
      'aws s3 cp bigfile.zip s3://my-bucket/bigfile.zip \\',
      '  --endpoint-url https://s3-accelerate.amazonaws.com',
    ],
    highlights: [
      { id: 'on', lines: [1, 3], label: 'Turn it on', body: 'One setting per bucket.' },
      { id: 'use', lines: [5, 7], label: 'Use the fast endpoint', body: 'The first hop is short; the rest rides AWS’s private network.' },
    ],
    footnote: { id: 'foot', text: 'Best for users far from the bucket’s Region. It works with multipart upload, and costs extra per GB.' },
  },
  script: [
    { text: 'Transfer Acceleration speeds up uploads and downloads. Data goes to the nearest AWS edge location over the public internet, then travels to your bucket over AWS’s own fast private network.', reveal: 'intro' },
    { text: 'You switch it on for a bucket with one setting.', reveal: 'on' },
    { text: 'Then upload through the accelerated endpoint. The slow public part of the journey becomes very short.', reveal: 'use' },
    { text: 'It helps most when users are far from the bucket’s Region. It works with multipart upload, and it costs extra per gigabyte.', reveal: 'foot', holdMs: 400 },
  ],
}

const b25: Slide = {
  id: 'b25-select-logging',
  navLabel: 'S3 Select and access logs',
  title: 'S3 Select and',
  subtitle: 'Access Logging',
  sourceSlides: [39, 40],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'S3 Select',
      tint: TEAL,
      items: [
        { id: 's1', label: 'Fetch only what you need', body: 'Query a 1 GB CSV and receive just the 10 KB of rows you asked for.' },
        { id: 's2', label: 'Today', body: 'Closed to new customers since 2024. Amazon Athena does this job now.' },
      ],
    },
    right: {
      title: 'Server access logging',
      tint: BLUE,
      items: [
        { id: 'l1', label: 'Every request recorded', body: 'Who asked for what, and when: PUT, GET, DELETE.' },
        { id: 'l2', label: 'Security best practice', body: 'Often the first thing checked after a data breach.' },
      ],
    },
  },
  script: [
    { text: 'S3 Select let you query a file in place. Instead of downloading a whole one gigabyte CSV, you asked for the rows you needed, and received just ten kilobytes.', reveal: 's1' },
    { text: 'AWS closed S3 Select to new customers in twenty twenty four. Amazon Athena now does this job.', reveal: 's2' },
    { text: 'Server access logging records every request made to a bucket: who asked for what, and when.', reveal: 'l1' },
    { text: 'It is a security best practice, and the logs are often the first thing investigators check after a data breach.', reveal: 'l2', holdMs: 400 },
  ],
}

const b26: Slide = {
  id: 'b26-cors',
  navLabel: 'CORS',
  title: 'Cross-Origin Resource',
  subtitle: 'Sharing (CORS)',
  sourceSlides: [41],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'Bucket one hosts a website. Its images live in bucket two. The browser will only load them if bucket two allows it, with a CORS rule.',
    code: [
      '[',
      '  {',
      '    "AllowedOrigins": ["http://my-bucket-one.s3-website.eu-west-2.amazonaws.com"],',
      '    "AllowedMethods": ["GET"],',
      '    "AllowedHeaders": ["*"],',
      '    "MaxAgeSeconds": 3000',
      '  }',
      ']',
    ],
    highlights: [
      { id: 'origin', lines: [3, 3], label: 'Allowed origin', body: 'The website in bucket one may ask.' },
      { id: 'method', lines: [4, 5], label: 'Allowed methods and headers', body: 'It may read (GET), with any headers.' },
      { id: 'cache', lines: [6, 6], label: 'Remember the answer', body: 'The browser caches this permission for 3,000 seconds.' },
    ],
  },
  script: [
    { text: 'Browsers are cautious. A web page from one address may not load resources from another address unless that other address allows it. This is called cross-origin resource sharing, or CORS.', reveal: 'intro' },
    { text: 'Say bucket one hosts a website, and bucket two holds its images. On bucket two, you add a CORS rule naming bucket one’s website as an allowed origin.', reveal: 'origin' },
    { text: 'It allows GET requests, which means reading, with any headers.', reveal: 'method' },
    { text: 'And the browser remembers the permission for three thousand seconds, so it does not ask every time.', reveal: 'cache', holdMs: 400 },
  ],
}

const b27: Slide = {
  id: 'b27-object-lambda',
  navLabel: 'S3 Object Lambda',
  title: 'S3 Object',
  subtitle: 'Lambda',
  sourceSlides: [42, 43],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Object Lambda changes data as it is read, so you keep one copy and serve many versions of it.',
    steps: [
      { id: 'ap', label: 'Access point', body: 'Create an S3 access point.', tint: BLUE },
      { id: 'fn', label: 'Connect Lambda', body: 'Attach your function to it.', tint: ORANGE },
      { id: 'process', label: 'Process', body: 'The function changes the data.', tint: VIOLET },
      { id: 'return', label: 'Return', body: 'The app receives the changed version.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Uses: hide personal data, add extra information, convert formats, resize images on the fly.' },
  },
  script: [
    { text: 'S3 Object Lambda changes data as it is being read. You keep one copy, and serve different versions of it without duplicating anything.', reveal: 'intro' },
    { text: 'First, create an S3 access point.', reveal: 'ap' },
    { text: 'Then connect a Lambda function to it.', reveal: 'fn' },
    { text: 'When an app reads through the access point, the function processes the data.', reveal: 'process' },
    { text: 'And the app receives the changed version.', reveal: 'return' },
    { text: 'Use it to hide personal data, add extra information, convert formats, or resize images on the fly.', reveal: 'foot', holdMs: 400 },
  ],
}

const b28: Slide = {
  id: 'b28-website-vs-api',
  navLabel: 'Static website hosting',
  title: 'Static Website vs',
  subtitle: 'API Access',
  sourceSlides: [44],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Website endpoint',
      tint: MINT,
      items: [
        { id: 'w1', label: 'For browsers', body: 'Returns HTML pages, like any website.' },
        { id: 'w2', label: 'Public content only', body: 'Everything served must be readable by anyone.' },
      ],
    },
    right: {
      title: 'REST API endpoint',
      tint: BLUE,
      items: [
        { id: 'a1', label: 'For code and tools', body: 'The CLI, the console and SDK calls like GetObject.' },
        { id: 'a2', label: 'Public or private', body: 'Every request can be checked against policies.' },
      ],
    },
  },
  script: [
    { text: 'A bucket can be reached two ways. The website endpoint serves browsers, returning HTML pages just like any other website.', reveal: 'w1' },
    { text: 'But it only supports content that anyone can read.', reveal: 'w2' },
    { text: 'The REST API endpoint serves code and tools: the command line, the console, and SDK calls such as get object.', reveal: 'a1' },
    { text: 'It supports both public and private content, because every request can be checked against your policies.', reveal: 'a2', holdMs: 400 },
  ],
}

const b29: Slide = {
  id: 'b29-website-urls',
  navLabel: 'Website URLs',
  title: 'S3 Website',
  subtitle: 'URLs',
  sourceSlides: [45],
  scene: 'code',
  data: {
    kind: 'code',
    filename: 'website endpoints',
    intro: 'Depending on the Region, a website endpoint uses a dash or a dot before the Region name.',
    code: [
      '# Two formats, depending on the Region',
      'http://bucket-name.s3-website-region.amazonaws.com',
      'http://bucket-name.s3-website.region.amazonaws.com',
      '',
      '# What each address returns',
      'http://bucket-name.s3-website.region.amazonaws.com',
      '  -> index.html',
      'http://bucket-name.s3-website.region.amazonaws.com/photo.jpg',
      '  -> photo.jpg',
      'http://bucket-name.s3-website.region.amazonaws.com/blog/post.html',
      '  -> blog/post.html',
    ],
    highlights: [
      { id: 'formats', lines: [1, 3], label: 'Dash or dot', body: 'Older Regions use a dash, newer ones a dot.' },
      { id: 'home', lines: [6, 7], label: 'The home page', body: 'The bare address returns index.html.' },
      { id: 'paths', lines: [8, 11], label: 'Anything else', body: 'Add the object key, prefix included.' },
    ],
  },
  script: [
    { text: 'Once website hosting is on, the bucket gets a website address. Depending on the Region, it has a dash or a dot before the Region name.', reveal: 'intro' },
    { text: 'Here are the two formats. Older Regions use the dash, newer ones the dot.', reveal: 'formats' },
    { text: 'The bare address returns your home page, index dot html.', reveal: 'home' },
    { text: 'Add an object key to the address, including any prefix, and you get that object.', reveal: 'paths', holdMs: 400 },
  ],
}

const b30: Slide = {
  id: 'b30-create-website',
  navLabel: 'Create a static website',
  title: 'Create a',
  subtitle: 'Static Website',
  sourceSlides: [46, 47],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Five steps to a website with no servers at all.',
    steps: [
      { id: 'bucket', label: 'Create a bucket', body: 'Named after your website’s hostname.', tint: BLUE },
      { id: 'upload', label: 'Upload files', body: 'Including index.html and error.html.', tint: ORANGE },
      { id: 'public', label: 'Allow public read', body: 'With a bucket policy.', tint: ROSE },
      { id: 'enable', label: 'Enable hosting', body: 'Switch on static website hosting.', tint: MINT },
      { id: 'dns', label: 'Point your domain', body: 'Optional CNAME to the S3 address.', tint: VIOLET },
    ],
    footnote: { id: 'foot', text: 'Great for launch pages, maintenance pages, and offloading images from web servers.' },
  },
  script: [
    { text: 'Hosting a website on S3 takes five steps, with no servers at all.', reveal: 'intro' },
    { text: 'Create a bucket, named after your website’s hostname.', reveal: 'bucket' },
    { text: 'Upload your files, including an index dot html home page and an error dot html page.', reveal: 'upload' },
    { text: 'Let everyone read the files, using a bucket policy.', reveal: 'public' },
    { text: 'Switch on static website hosting for the bucket.', reveal: 'enable' },
    { text: 'And optionally, point your own domain at it with a CNAME record. The bucket name must match that domain.', reveal: 'dns' },
    { text: 'It is ideal for product launch pages, maintenance pages, and offloading images from busy web servers.', reveal: 'foot', holdMs: 300 },
    { text: 'Now two quick questions about hosting a website.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Static website questions',
    scenarios: [
      {
        id: 'q1',
        scenario: 'The site is uploaded and hosting is on, but visitors get Access Denied. What is missing?',
        options: [
          { id: 'a', label: 'A bucket policy allowing public read', correct: true, feedback: 'Yes. The website endpoint only serves content anyone can read.' },
          { id: 'b', label: 'Versioning', feedback: 'Versioning keeps old copies. It does not make files readable.' },
          { id: 'c', label: 'Multipart upload', feedback: 'That is for uploading large files, not for letting visitors read them.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'You want the site at www.dgcl-demo.com. What must the bucket be called?',
        options: [
          { id: 'a', label: 'www.dgcl-demo.com', correct: true, feedback: 'Correct. With a CNAME, the bucket name must match the domain name exactly.' },
          { id: 'b', label: 'Anything you like', feedback: 'Not when you point your own domain at it: the names must match.' },
        ],
      },
    ],
  },
}

const b31: Slide = {
  id: 'b31-storage-gateway',
  navLabel: 'Storage Gateway',
  title: 'AWS Storage',
  subtitle: 'Gateway',
  sourceSlides: [48, 49],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Storage Gateway connects servers in your own building to almost unlimited storage in AWS.',
    columns: 3,
    cards: [
      { id: 'file', label: 'File Gateway', eyebrow: 'NFS and SMB', body: 'Store files as S3 objects, with a local cache. Apps work unchanged.', tint: GOLD },
      { id: 'volume', label: 'Volume Gateway', eyebrow: 'Cached or stored', body: 'Disks on-premises, backed up to AWS as EBS snapshots.', tint: BLUE },
      { id: 'tape', label: 'Tape Gateway', eyebrow: 'Virtual tapes', body: 'Replace physical backup tapes with S3 and Glacier.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'This is how block and file storage in your own data centre becomes hybrid cloud storage.' },
  },
  script: [
    { text: 'Finally, AWS Storage Gateway connects servers in your own building to almost unlimited storage in AWS.', reveal: 'intro' },
    { text: 'File Gateway stores files as S3 objects, with a local cache for speed. Existing applications keep working without change.', reveal: 'file' },
    { text: 'Volume Gateway presents disks to your servers on-premises, backed by cloud storage as EBS snapshots. It comes in cached and stored modes.', reveal: 'volume' },
    { text: 'And Tape Gateway replaces physical backup tapes with virtual ones, kept in S3 and Glacier.', reveal: 'tape' },
    { text: 'This is how block and file storage in your own data centre becomes hybrid cloud storage.', reveal: 'foot', holdMs: 400 },
  ],
}

const b32: Slide = {
  id: 'b32-complete',
  navLabel: 'Module complete',
  title: 'Module 4 Complete',
  sourceSlides: [50],
  scene: 'module-outro',
  data: {
    kind: 'module-outro',
    heading: 'Module 4 complete',
    covered: [
      'File, block and object storage',
      'Buckets, objects and storage classes',
      'Bucket policies, ACLs and MFA Delete',
      'Versioning, replication and encryption',
      'Pre-signed URLs, CORS and static websites',
    ],
    next: 'Next: Module 5, Virtual Private Cloud (VPC) networking.',
  },
  script: [
    { text: 'That is the end of Module Four, Amazon S3, block and file storage.', reveal: 'done', holdMs: 300 },
    { text: 'You have covered the three kinds of storage, buckets and storage classes, how to secure a bucket, versioning, replication and encryption, and how to host a website from S3.', reveal: 'covered' },
    { text: 'Next comes Module Five, networking with Virtual Private Cloud. Well done.', reveal: 'next', holdMs: 500 },
  ],
}

export const slidesS3: Slide[] = [
  b01, b02, b03, b04, b05, b06, b07, b08, b09, b10,
  b11, b12, b13, b14, b15, b16, b17, b18, b19, b20,
  b21, b22, b23, b24, b25, b26, b27, b28, b29, b30,
  b31, b32,
]
