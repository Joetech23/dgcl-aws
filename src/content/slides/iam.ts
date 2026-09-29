import type { Slide } from '@/lib/course/types'

/**
 * Module 2: AWS Identity and Access Management (IAM).
 *
 * From Identity-and-Access-Management-(IAM).pptx, 38 slides, in deck order.
 * The deck's three repeated title cards become one module title, and its
 * screenshots of JSON and of the SSO console are rebuilt: the policies as
 * live code listings that highlight line by line, the rest as diagrams.
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

const i01: Slide = {
  id: 'i01-title',
  navLabel: 'Welcome to IAM',
  title: 'AWS Identity and Access Management (IAM)',
  sourceSlides: [1, 2],
  scene: 'module-title',
  data: {
    kind: 'module-title',
    title: 'AWS Identity and Access Management (IAM)',
    points: ['Users, groups and roles', 'Authentication', 'Policies', 'Permission boundaries', 'Best practice'],
  },
  script: [
    { text: 'Welcome to Module Two of AWS Cloud Training: Identity and Access Management, usually called IAM.', reveal: 'title', holdMs: 200 },
    { text: 'IAM decides who can sign in to your AWS account, and what each of them is allowed to do once they are in.', reveal: 'sub' },
    { text: 'In this module you will meet the identities IAM manages, the ways they prove who they are, and the policies that grant or deny them access.', reveal: 'points', holdMs: 400 },
  ],
}

const i02: Slide = {
  id: 'i02-what-is-iam',
  navLabel: 'What IAM is',
  title: 'What is',
  subtitle: 'IAM?',
  sourceSlides: [3],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'IAM manages AWS users and their access to AWS accounts and services.',
    columns: 3,
    cards: [
      { id: 'who', label: 'Who can get in', eyebrow: 'Identity', body: 'Creates the users, groups and roles that can reach your account.', tint: BLUE },
      { id: 'what', label: 'What they can do', eyebrow: 'Access', body: 'Controls the level of access each of them has, service by service.', tint: ELECTRIC },
      { id: 'grant', label: 'Permission to act', eyebrow: 'Policies', body: 'Grants permission to use particular features of the account, and nothing more.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Every request to AWS passes through IAM first. Nothing reaches a service without its approval.' },
  },
  script: [
    { text: 'Identity and Access Management manages Amazon Web Services users, and their access to AWS accounts and services.', reveal: 'intro' },
    { text: 'It creates the identities that can reach your account: the users, groups and roles.', reveal: 'who' },
    { text: 'It controls the level of access each of those identities has, service by service.', reveal: 'what' },
    { text: 'And it grants permission to use particular features of the account, and nothing beyond them.', reveal: 'grant' },
    { text: 'Every request made to AWS passes through IAM first. Nothing reaches a service without its approval.', reveal: 'foot', holdMs: 400 },
  ],
}

const i03: Slide = {
  id: 'i03-root-and-users',
  navLabel: 'Root account vs new users',
  title: 'The Root Account',
  subtitle: 'and New Users',
  sourceSlides: [4],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'IAM manages four things: users, groups, roles, and access policies. It starts from two very different kinds of login.',
    left: {
      title: 'The root account',
      tint: ROSE,
      items: [
        { id: 'root-1', label: 'Created when you sign up', body: 'The login you made to open the AWS account.' },
        { id: 'root-2', label: 'Holds every administrative right', body: 'It can reach every part of the account, and nothing can restrict it.' },
      ],
    },
    right: {
      title: 'A new IAM user',
      tint: BLUE,
      items: [
        { id: 'user-1', label: 'Starts with no access at all', body: 'A brand new user cannot use a single service by default.' },
        { id: 'user-2', label: 'Given access through IAM', body: 'The root holder applies policies that grant access to specific services.' },
      ],
    },
    footnote: { id: 'foot', text: 'Nobody is given access by accident. Every permission a user has was granted on purpose.' },
  },
  script: [
    { text: 'IAM manages four things: users, groups, roles, and access policies. And it starts from two very different kinds of login.', reveal: 'intro' },
    { text: 'The account you created to sign up to Amazon Web Services is called the root account.', reveal: 'root-1' },
    { text: 'It holds every administrative right, and has access to every part of the account.', reveal: 'root-2' },
    { text: 'A new user, by contrast, starts with no access to any service at all.', reveal: 'user-1' },
    { text: 'It is through IAM that the root account holder applies policies, and grants that user permission to use particular services.', reveal: 'user-2' },
    { text: 'So nobody is given access by accident. Every permission a user has was granted on purpose.', reveal: 'foot', holdMs: 400 },
  ],
}

const i04: Slide = {
  id: 'i04-how-iam-works',
  navLabel: 'How IAM works',
  title: 'How IAM',
  subtitle: 'Works',
  sourceSlides: [5],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'IAM checks that a user or a service has the authorisation it needs, every time, for every request.',
    steps: [
      { id: 'request', label: 'A request arrives', body: 'A person, an application, or another AWS service asks to do something.', tint: BLUE },
      { id: 'authn', label: 'Who is asking?', body: 'IAM confirms the identity behind the request.', tint: ELECTRIC },
      { id: 'authz', label: 'Is it allowed?', body: 'IAM checks the policies attached to that identity and resource.', tint: ORANGE },
      { id: 'decision', label: 'Allow or deny', body: 'The request goes through, or it is refused.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Example: IAM can let an EC2 instance read from one S3 bucket, with permissions as narrow as a single action.' },
  },
  script: [
    { text: 'IAM verifies that a user or a service has the authorisation it needs to reach a particular service in the AWS cloud.', reveal: 'intro' },
    { text: 'It starts when a request arrives, from a person, an application, or another AWS service.', reveal: 'request' },
    { text: 'IAM first confirms who is asking.', reveal: 'authn' },
    { text: 'Then it checks the policies attached to that identity, and to the resource being asked for.', reveal: 'authz' },
    { text: 'And the request is either allowed through, or denied.', reveal: 'decision' },
    { text: 'For example, IAM can let an EC2 instance read from an S3 bucket, with permissions as fine grained as a single action.', reveal: 'foot', holdMs: 400 },
  ],
}

const i05: Slide = {
  id: 'i05-workflow',
  navLabel: 'IAM workflow',
  title: 'IAM',
  subtitle: 'Workflow',
  sourceSlides: [6],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'Here is a real pattern: engineers in one account working safely on resources in another.',
    steps: [
      { id: 'login', label: 'Engineers log in', body: 'Each signs in with their own credentials.', tint: BLUE },
      { id: 'accountA', label: 'Account A', body: 'Their IAM user or group lives here.', tint: ELECTRIC },
      { id: 'temp', label: 'Temporary credentials', body: 'Short-lived security credentials, not permanent keys.', tint: GOLD },
      { id: 'role', label: 'IAM role in Account B', body: 'The role they assume in the other account.', tint: ORANGE },
      { id: 'services', label: 'Reach the services', body: 'Access or modify S3, Lambda, and CloudWatch.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Nobody holds a permanent password for Account B. Access lasts only as long as the credentials do.' },
  },
  script: [
    { text: 'Here is how that works in a real setup, where engineers in one account work on resources in another.', reveal: 'intro' },
    { text: 'The engineers log in, each with their own credentials.', reveal: 'login' },
    { text: 'Their IAM user, or the IAM group they belong to, lives in Account A.', reveal: 'accountA' },
    { text: 'From there, they are issued temporary security credentials, rather than a permanent key.', reveal: 'temp' },
    { text: 'Those credentials let them assume an IAM role in Account B.', reveal: 'role' },
    { text: 'And through that role they can access or modify services such as S3, Lambda, and CloudWatch.', reveal: 'services' },
    { text: 'Notice that nobody holds a permanent password for Account B. The access lasts only as long as the credentials do.', reveal: 'foot', holdMs: 400 },
  ],
}

const i06: Slide = {
  id: 'i06-identities',
  navLabel: 'IAM identities',
  title: 'What Does',
  subtitle: 'IAM Do?',
  sourceSlides: [7],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'IAM identities control which users can reach which services. They are all created from the root user.',
    columns: 4,
    cards: [
      { id: 'root', label: 'Root user', eyebrow: 'Created for you', body: 'Made automatically, with unrestricted rights.', tint: ROSE },
      { id: 'users', label: 'IAM users', eyebrow: 'People', body: 'Individuals who sign in with their own credentials.', tint: BLUE },
      { id: 'groups', label: 'IAM groups', eyebrow: 'Collections', body: 'Sets of users who share the same permissions.', tint: ELECTRIC },
      { id: 'roles', label: 'IAM roles', eyebrow: 'Assumed', body: 'Permissions that people or services take on when needed.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'Good practice: create an admin user with fewer powers for daily work, and keep the root user locked away.' },
  },
  script: [
    { text: 'IAM identities control which users can access which services and resources, and policies can be assigned to each of them.', reveal: 'intro' },
    { text: 'The root user is created automatically, and granted unrestricted rights.', reveal: 'root' },
    { text: 'IAM users are individual people, each signing in with their own credentials.', reveal: 'users' },
    { text: 'IAM groups are collections of users who share the same permissions.', reveal: 'groups' },
    { text: 'And IAM roles are sets of permissions that people or services take on when they need them.', reveal: 'roles' },
    { text: 'Good practice is to create an admin user with fewer powers for daily work, and keep the root user locked away.', reveal: 'foot', holdMs: 300 },
    { text: 'Now sort these four cases to the identity that fits each one.', gate: true },
  ],
  interaction: {
    kind: 'sort',
    prompt: 'Which identity fits each case?',
    buckets: [
      { id: 'root', label: 'Root user' },
      { id: 'user', label: 'IAM user' },
      { id: 'group', label: 'IAM group' },
      { id: 'role', label: 'IAM role' },
    ],
    chips: [
      { id: 'c1', label: 'The login created when the AWS account was first opened', bucket: 'root', why: 'Root user. It exists from the start and cannot be restricted, which is why it should be locked away.' },
      { id: 'c2', label: 'A new analyst who signs in to the console with her own password', bucket: 'user', why: 'IAM user. One person, one set of credentials, so every action can be traced back to them.' },
      { id: 'c3', label: 'Ten people in finance who all need the same billing access', bucket: 'group', why: 'IAM group. Grant the permissions once to the group, and every member gets them.' },
      { id: 'c4', label: 'An application on an EC2 server that needs to read from S3', bucket: 'role', why: 'IAM role. A service takes on the role and receives temporary credentials, with no password stored on the server.' },
    ],
    successNote: 'Root to set up, users for people, groups to manage people in bulk, roles for services and temporary access.',
  },
}

const i07: Slide = {
  id: 'i07-users-groups',
  navLabel: 'Users and groups',
  title: 'IAM Users and',
  subtitle: 'IAM Groups',
  sourceSlides: [8],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'IAM users',
      tint: BLUE,
      items: [
        { id: 'u1', label: 'Sign in to the AWS console', body: 'With fewer rights than the root user, and their logins can be tracked.' },
        { id: 'u2', label: 'Example: read-only access', body: 'User-1 can view EC2 instances, but cannot create, delete, or change them.' },
      ],
    },
    right: {
      title: 'IAM groups',
      tint: ORANGE,
      items: [
        { id: 'g1', label: 'A collection of users', body: 'One person can belong to several groups at once.' },
        { id: 'g2', label: 'Example: two levels of access', body: 'One group manages the auto scaling group only; another also maintains EC2.' },
        { id: 'g3', label: 'New starters join a group', body: 'They inherit its permissions immediately, with nothing set up by hand.' },
      ],
    },
  },
  script: [
    { text: 'IAM users are used to access the AWS console. Their rights differ from the root user, and their logins can be tracked.', reveal: 'u1' },
    { text: 'For example, user one might need read-only access to an EC2 instance, with no permission to create, delete, or update anything. An IAM user with exactly that permission does the job.', reveal: 'u2' },
    { text: 'An IAM group is a collection of users, and a single person can belong to several groups.', reveal: 'g1' },
    { text: 'Say user one should only manage the auto scaling group, while user two also needs to maintain EC2. Create a group for each level of access, and add each user to the right one.', reveal: 'g2' },
    { text: 'When someone new joins, add them to the group, and they have the right permissions straight away.', reveal: 'g3', holdMs: 400 },
  ],
}

const i08: Slide = {
  id: 'i08-roles',
  navLabel: 'IAM roles',
  title: 'IAM',
  subtitle: 'Roles',
  sourceSlides: [9],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'A role gives one AWS service permission to use another. Here is a real example with Amazon EKS.',
    steps: [
      { id: 'need', label: 'EKS needs EC2', body: 'To maintain an auto scaling group, EKS must reach EC2 instances.', tint: BLUE },
      { id: 'problem', label: 'No direct policy', body: 'You cannot attach a policy straight to the EKS service.', tint: ROSE },
      { id: 'build', label: 'Build a role', body: 'Create a role and attach the policies it needs.', tint: ORANGE },
      { id: 'attach', label: 'Attach it to EKS', body: 'EKS assumes the role, and gains exactly those permissions.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'A role is like a user that anyone who needs it can step into, and step out of again.' },
  },
  script: [
    { text: 'IAM roles are how one AWS service is given permission to use another. Here is a real example.', reveal: 'intro' },
    { text: 'A developer is using Amazon EKS. To maintain an auto scaling group, EKS needs access to EC2 instances.', reveal: 'need' },
    { text: 'But you cannot attach a policy directly to the EKS service.', reveal: 'problem' },
    { text: 'So you build a role, and attach the necessary policies to that role.', reveal: 'build' },
    { text: 'Then you attach the role to EKS. It assumes the role, and gains exactly those permissions.', reveal: 'attach' },
    { text: 'Think of a role as a user that anyone who needs it can step into, and step out of again.', reveal: 'foot', holdMs: 400 },
  ],
}

const i09: Slide = {
  id: 'i09-policies',
  navLabel: 'IAM policies',
  title: 'IAM',
  subtitle: 'Policies',
  sourceSlides: [10],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Policies are where permissions actually live. Everything else in IAM points at them.',
    columns: 2,
    cards: [
      { id: 'attach', label: 'Attached to identities or resources', body: 'A policy defines what a user, group, role, or resource is allowed to do.', tint: BLUE },
      { id: 'evaluate', label: 'Checked on every request', body: 'AWS evaluates the policies and decides whether the request is allowed or denied.', tint: ELECTRIC },
      { id: 'json', label: 'Written in JSON', body: 'Every policy is stored as a JSON document, which you will learn to read later in this module.', tint: GOLD },
      { id: 'many', label: 'Several per identity', body: 'An identity can carry more than one policy, depending on how many permissions it needs.', tint: MINT },
    ],
  },
  script: [
    { text: 'Policies are where permissions actually live. Everything else in IAM points at them.', reveal: 'intro' },
    { text: 'A policy is attached to an IAM identity or to a resource, and defines what it is permitted to do.', reveal: 'attach' },
    { text: 'When a request is made, AWS evaluates the relevant policies and confirms whether it should be allowed or denied.', reveal: 'evaluate' },
    { text: 'Policies are stored in JSON format. Later in this module you will learn to read one line by line.', reveal: 'json' },
    { text: 'And an identity can have several policies attached, depending on how many permissions it needs.', reveal: 'many', holdMs: 400 },
  ],
}

const i10: Slide = {
  id: 'i10-features',
  navLabel: 'IAM features',
  title: 'IAM',
  subtitle: 'Features',
  sourceSlides: [12],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'shared', label: 'Shared access', body: 'A team can share resources on a project without sharing a login.', tint: BLUE },
      { id: 'free', label: 'Free of cost', body: 'IAM itself costs nothing. You pay only for the services your users go on to use.', tint: MINT },
      { id: 'central', label: 'Centralised control', body: 'Every user and group created or removed is under your control.', tint: ELECTRIC },
      { id: 'grant', label: 'Grant permissions', body: 'Users receive exactly the access they need, service by service.', tint: ORANGE },
      { id: 'mfa', label: 'Multi-factor authentication', body: 'A six-digit code from a device, entered alongside the password.', tint: ROSE },
    ],
  },
  script: [
    { text: 'IAM has five features worth knowing. Shared access: a team can share resources on a project without sharing a single login.', reveal: 'shared' },
    { text: 'It is free of cost. IAM itself is free, and charges only appear when your users go on to use other AWS services.', reveal: 'free' },
    { text: 'It gives you centralised control. Every user or group that is created or removed is under your control, and so is what data they can reach.', reveal: 'central' },
    { text: 'It lets you grant permissions, so each user gets access to exactly the services they need.', reveal: 'grant' },
    { text: 'And it supports multi-factor authentication: a six-digit code from a device, entered alongside the password when you sign in.', reveal: 'mfa', holdMs: 400 },
  ],
}

const i11: Slide = {
  id: 'i11-auth-methods',
  navLabel: 'Authentication methods',
  title: 'IAM Authentication',
  subtitle: 'Methods',
  sourceSlides: [13],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Five ways an identity can prove who it is. The next few slides take them one at a time.',
    columns: 3,
    cards: [
      { id: 'password', label: 'Password', body: 'For people signing in to the console.', tint: BLUE },
      { id: 'keys', label: 'Access keys', body: 'For programs, the CLI, and SDKs.', tint: ELECTRIC },
      { id: 'mfa', label: 'Multi-factor', body: 'A second proof on top of the first.', tint: ROSE },
      { id: 'federated', label: 'Federated access', body: 'Signing in with an identity from elsewhere.', tint: VIOLET },
      { id: 'role', label: 'Role-based', body: 'Temporary credentials from an assumed role.', tint: ORANGE },
    ],
  },
  script: [
    { text: 'IAM offers several ways to authenticate, which means proving who you are. Here are the five main ones.', reveal: 'intro' },
    { text: 'Passwords, for people signing in to the management console.', reveal: 'password' },
    { text: 'Access keys, for programs, the command line, and software development kits.', reveal: 'keys' },
    { text: 'Multi-factor authentication, which adds a second proof on top of the first.', reveal: 'mfa' },
    { text: 'Federated access, where you sign in with an identity from somewhere else.', reveal: 'federated' },
    { text: 'And role-based authentication, which issues temporary credentials when a role is assumed.', reveal: 'role', holdMs: 300 },
    { text: 'Before we look at each one, see if you can match two situations to the right method.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Which method fits each situation?',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A script on your laptop needs to upload files to S3 through the AWS command line.',
        options: [
          { id: 'a', label: 'Access keys', correct: true, feedback: 'Yes. Access keys sign programmatic requests from the CLI, SDKs, and APIs.' },
          { id: 'b', label: 'A console password', feedback: 'Passwords are for people signing in to the console, not for scripts.' },
          { id: 'c', label: 'MFA on its own', feedback: 'MFA adds a second factor to another method. It is not a credential on its own.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'An application running on an EC2 instance needs to read a DynamoDB table.',
        options: [
          { id: 'a', label: 'Store access keys on the server', feedback: 'It works, but a permanent key left on a server is a leak waiting to happen.' },
          { id: 'b', label: 'Give the instance an IAM role', correct: true, feedback: 'Correct. The instance assumes the role and receives temporary credentials, so nothing permanent is stored.' },
          { id: 'c', label: 'Use the root user', feedback: 'Never. The root user should not be used for day-to-day work of any kind.' },
        ],
      },
    ],
  },
}

const i12: Slide = {
  id: 'i12-passwords',
  navLabel: 'Password authentication',
  title: 'Password-Based',
  subtitle: 'Authentication',
  sourceSlides: [14],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'what', label: 'What it is', eyebrow: 'Description', body: 'A user proves who they are with a username and a password.', tint: BLUE },
      { id: 'use', label: 'When to use it', eyebrow: 'Use case', body: 'Signing in to the AWS Management Console.', tint: ELECTRIC },
      { id: 'features', label: 'What protects it', eyebrow: 'Features', body: 'Password policies for complexity, expiry, and reuse, plus support for MFA.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'A password policy is set once for the whole account, so every user follows the same rules.' },
  },
  script: [
    { text: 'Password-based authentication is the one everyone knows. A user proves who they are with a username and a password.', reveal: 'what' },
    { text: 'It is the method for signing in to the AWS Management Console.', reveal: 'use' },
    { text: 'Password policies can enforce complexity, set how often passwords expire, and stop old ones being reused. It also supports multi-factor authentication for extra security.', reveal: 'features' },
    { text: 'The password policy is set once for the whole account, so every user follows the same rules.', reveal: 'foot', holdMs: 400 },
  ],
}

const i13: Slide = {
  id: 'i13-access-keys-mfa',
  navLabel: 'Access keys and MFA',
  title: 'Access Keys and',
  subtitle: 'Multi-Factor Authentication',
  sourceSlides: [15],
  scene: 'split',
  data: {
    kind: 'split',
    left: {
      title: 'Access keys',
      tint: ELECTRIC,
      items: [
        { id: 'k1', label: 'An ID and a secret', body: 'An access key ID plus a secret access key, used to sign programmatic requests.' },
        { id: 'k2', label: 'For the CLI, SDKs, and APIs', body: 'How code, rather than people, talks to AWS.' },
        { id: 'k3', label: 'Rotate them, guard them', body: 'Change them regularly, and never share or commit them.' },
      ],
    },
    right: {
      title: 'Multi-factor authentication',
      tint: ROSE,
      items: [
        { id: 'm1', label: 'Something you know, plus something you have', body: 'A password, plus a code from a device you carry.' },
        { id: 'm2', label: 'Console, CLI, and API', body: 'It protects every way into the account.' },
        { id: 'm3', label: 'Virtual, hardware, or SMS', body: 'Several device types, enforceable per user or per group.' },
      ],
    },
  },
  script: [
    { text: 'Access keys are made of two parts: an access key ID, and a secret access key. Together they sign programmatic requests to AWS.', reveal: 'k1' },
    { text: 'They are how the command line, software development kits, and APIs talk to AWS. In other words, how code reaches AWS rather than people.', reveal: 'k2' },
    { text: 'They should be rotated regularly, and kept secret and secure. Never share them, and never put them in code you upload.', reveal: 'k3' },
    { text: 'Multi-factor authentication adds a second layer. Something you have, on top of something you know.', reveal: 'm1' },
    { text: 'It strengthens security for the console, the command line, and API access alike.', reveal: 'm2' },
    { text: 'It supports virtual MFA apps, hardware devices, and SMS codes, and can be enforced for each user or group.', reveal: 'm3', holdMs: 400 },
  ],
}

const i14: Slide = {
  id: 'i14-mfa',
  navLabel: 'How MFA works',
  title: 'Multi-Factor',
  subtitle: 'Authentication (MFA)',
  sourceSlides: [16],
  scene: 'steps',
  data: {
    kind: 'steps',
    intro: 'MFA is a simple sum. Two different kinds of proof, both required.',
    steps: [
      { id: 'know', label: 'Something you know', body: 'Your password.', tint: BLUE },
      { id: 'have', label: 'Something you have', body: 'A phone app, a security key, a card, or a fingerprint.', tint: ORANGE },
      { id: 'granted', label: 'Access granted', body: 'Only when both are correct.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'A stolen password on its own is no longer enough to get in.' },
  },
  script: [
    { text: 'Multi-factor authentication is a simple sum: two different kinds of proof, and both are required.', reveal: 'intro' },
    { text: 'The first is something you know. Your password.', reveal: 'know' },
    { text: 'The second is something you have. An authenticator app on your phone, a hardware security key, a card, or even your fingerprint.', reveal: 'have' },
    { text: 'Access is granted only when both are correct.', reveal: 'granted' },
    { text: 'Which means a stolen password on its own is no longer enough to get in.', reveal: 'foot', holdMs: 400 },
  ],
}

const i15: Slide = {
  id: 'i15-federated',
  navLabel: 'Federated access',
  title: 'Federated',
  subtitle: 'Access',
  sourceSlides: [17],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Federated sign-in lets a user sign in to AWS with an identity from a third-party service.',
    columns: 3,
    cards: [
      { id: 'what', label: 'Use an existing identity', eyebrow: 'Description', body: 'Authenticate with an external provider and receive temporary access to AWS.', tint: VIOLET },
      { id: 'use', label: 'Single sign-on', eyebrow: 'Use case', body: 'Corporate directories such as Active Directory, Google or Facebook, or OpenID Connect.', tint: BLUE },
      { id: 'features', label: 'SAML and STS', eyebrow: 'Features', body: 'Supports SAML 2.0, and uses the Security Token Service for temporary credentials.', tint: ORANGE },
    ],
    footnote: { id: 'foot', text: 'No separate AWS password to create, remember, or remove when someone leaves.' },
  },
  script: [
    { text: 'Federated sign-in lets a user sign in to AWS using an identity from a third-party service.', reveal: 'intro' },
    { text: 'The user authenticates with an external identity provider, and is given temporary access to AWS resources.', reveal: 'what' },
    { text: 'It enables single sign-on for people in corporate directories such as Active Directory, for social identity providers like Google or Facebook, and for OpenID Connect providers.', reveal: 'use' },
    { text: 'It supports federation based on SAML 2.0, and uses the AWS Security Token Service to issue temporary security credentials.', reveal: 'features' },
    { text: 'So there is no separate AWS password to create, to remember, or to remove when someone leaves.', reveal: 'foot', holdMs: 400 },
  ],
}

const i16: Slide = {
  id: 'i16-role-based',
  navLabel: 'Role-based authentication',
  title: 'Role-Based',
  subtitle: 'Authentication',
  sourceSlides: [18, 19],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'what', label: 'Delegate access', eyebrow: 'Description', body: 'A role hands out defined permissions with temporary credentials.', tint: ORANGE },
      { id: 'use', label: 'Applications on AWS', eyebrow: 'Use case', body: 'Such as an EC2 instance that needs to reach other AWS resources.', tint: BLUE },
      { id: 'features', label: 'Assumed, then expired', eyebrow: 'Features', body: 'Assumed by users, applications, or services, with STS issuing the credentials.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Temporary credentials expire on their own, so there is nothing long-lived to steal.' },
  },
  script: [
    { text: 'Role-based authentication uses IAM roles to delegate access, with defined permissions and temporary credentials.', reveal: 'what' },
    { text: 'It suits applications running on AWS, such as an EC2 instance that needs to reach other AWS resources.', reveal: 'use' },
    { text: 'A role can be assumed by users, by applications, or by AWS services, and the Security Token Service provides the temporary credentials.', reveal: 'features' },
    { text: 'Those credentials expire on their own, so there is nothing long-lived to steal.', reveal: 'foot', holdMs: 400 },
  ],
}

const i17: Slide = {
  id: 'i17-sso',
  navLabel: 'AWS Single Sign-On',
  title: 'AWS Single',
  subtitle: 'Sign-On (SSO)',
  sourceSlides: [20, 21, 22],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'what', label: 'One place for every account', eyebrow: 'Description', body: 'Centralised access control across many AWS accounts and business applications.', tint: BLUE },
      { id: 'use', label: 'Simpler access management', eyebrow: 'Use case', body: 'One sign-in, then a portal listing every account and role you can use.', tint: ELECTRIC },
      { id: 'features', label: 'Works with what you have', eyebrow: 'Features', body: 'Integrates with existing corporate identity providers, through a web portal.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'In the AWS console today this service is called IAM Identity Center. It is the same thing under a newer name.' },
  },
  script: [
    { text: 'AWS Single Sign-On provides centralised access control across multiple AWS accounts and business applications.', reveal: 'what' },
    { text: 'It simplifies access management. You sign in once, and a portal lists every account and every role you are allowed to use, with a link to the console or to programmatic access for each.', reveal: 'use' },
    { text: 'It integrates with existing corporate identity providers, and gives users a friendly web portal to work from.', reveal: 'features' },
    { text: 'One thing to know: in the AWS console today this service is called IAM Identity Center. It is the same service under a newer name.', reveal: 'foot', holdMs: 400 },
  ],
}

const i18: Slide = {
  id: 'i18-policy-types',
  navLabel: 'Six types of policy',
  title: 'Six Types of',
  subtitle: 'Policy',
  sourceSlides: [22, 23],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A policy is an object that defines permissions when attached to an identity or a resource. AWS supports six types.',
    columns: 3,
    cards: [
      { id: 'identity', label: 'Identity-based', body: 'Attached to users, groups, or roles. Grants permissions to that identity.', tint: BLUE },
      { id: 'resource', label: 'Resource-based', body: 'Attached to a resource, such as an S3 bucket policy or a role trust policy.', tint: ELECTRIC },
      { id: 'boundary', label: 'Permissions boundaries', body: 'Sets the maximum an identity-based policy can grant. Grants nothing itself.', tint: ORANGE },
      { id: 'scp', label: 'Organizations SCPs', body: 'Sets the maximum for every account in an organisation or unit.', tint: VIOLET },
      { id: 'acl', label: 'Access control lists', body: 'Lets principals in other accounts reach a resource. The only type not in JSON.', tint: TEAL },
      { id: 'session', label: 'Session policies', body: 'Passed in when assuming a role or federated user, to narrow that session.', tint: MINT },
    ],
  },
  script: [
    { text: 'A policy is an object in AWS that defines permissions when it is attached to an identity or a resource. AWS supports six types.', reveal: 'intro' },
    { text: 'Identity-based policies are attached to users, groups, or roles, and grant permissions to that identity.', reveal: 'identity' },
    { text: 'Resource-based policies are attached to resources. The most common examples are S3 bucket policies and IAM role trust policies.', reveal: 'resource' },
    { text: 'Permissions boundaries set the maximum permissions that identity-based policies can grant. On their own they grant nothing.', reveal: 'boundary' },
    { text: 'Service control policies from AWS Organizations set the maximum permissions for every account in an organisation or organisational unit.', reveal: 'scp' },
    { text: 'Access control lists control which principals in other accounts can reach a resource. They are the only type that does not use the JSON policy format.', reveal: 'acl' },
    { text: 'And session policies are passed in when you assume a role or a federated user, to narrow what that particular session can do.', reveal: 'session', holdMs: 400 },
  ],
}

const i19: Slide = {
  id: 'i19-boundaries',
  navLabel: 'Permission boundaries',
  title: 'What Are Permission',
  subtitle: 'Boundaries?',
  sourceSlides: [24],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'A permission boundary is a managed policy that sets the maximum permissions an IAM entity can ever have.',
    columns: 3,
    cards: [
      { id: 'max', label: 'A ceiling, not a grant', body: 'The boundary limits what can be allowed. It never allows anything by itself.', tint: ORANGE },
      { id: 'both', label: 'Both must agree', body: 'An action is allowed only if the identity policy and the boundary both permit it.', tint: BLUE },
      { id: 'delegate', label: 'Safe delegation', body: 'You can let trusted staff create permissions, knowing they cannot exceed the limit.', tint: MINT },
    ],
    footnote: { id: 'foot', text: 'Within an account, an entity is shaped by identity policies, resource policies, boundaries, SCPs, and session policies together.' },
  },
  script: [
    { text: 'A permission boundary is a managed policy that sets the maximum permissions an IAM user or role can ever have.', reveal: 'intro' },
    { text: 'It is a ceiling, not a grant. The boundary limits what can be allowed, but it never allows anything on its own.', reveal: 'max' },
    { text: 'An entity can only perform an action that is allowed by both its identity-based policy and its permission boundary.', reveal: 'both' },
    { text: 'That is what makes delegation safe. You can let trusted employees create permissions, knowing they cannot go beyond the limit you set.', reveal: 'delegate' },
    { text: 'Within an account, what an entity can do is shaped by identity-based policies, resource-based policies, boundaries, service control policies, and session policies, all together.', reveal: 'foot', holdMs: 400 },
  ],
}

const i20: Slide = {
  id: 'i20-boundary-in-action',
  navLabel: 'Boundaries in action',
  title: 'A Permission Boundary',
  subtitle: 'in Action',
  sourceSlides: [25, 26],
  scene: 'steps',
  data: {
    kind: 'steps',
    steps: [
      { id: 'admin', label: 'Central IAM admin', body: 'Lets a developer create roles, but only within a set boundary.', tint: BLUE },
      { id: 'dev', label: 'Developer', body: 'Creates an IAM role for an application.', tint: MINT },
      { id: 'role', label: 'IAM role', body: 'Its policies are capped by the permissions boundary.', tint: ORANGE },
      { id: 'result', label: 'The result', body: 'The app reaches its S3 bucket and DynamoDB table. The sensitive bucket stays out of reach.', tint: ROSE },
    ],
    footnote: { id: 'foot', text: 'Example from the deck: an employee building a blog is limited to s3:GetObject on the photo bucket, and nothing more.' },
  },
  script: [
    { text: 'Here is a boundary at work. A central IAM administrator lets a developer create roles, but only within a boundary the administrator sets.', reveal: 'admin' },
    { text: 'The developer creates an IAM role for their application.', reveal: 'dev' },
    { text: 'Whatever policies the developer attaches to that role, they are capped by the permissions boundary.', reveal: 'role' },
    { text: 'So the application can reach its own S3 bucket and DynamoDB table, but the sensitive S3 bucket stays out of reach, even if the developer tries to grant it.', reveal: 'result' },
    { text: 'The same idea in a simpler case: an employee building a blog needs photos from S3, so their boundary allows only the S3 get object action, and nothing more.', reveal: 'foot', holdMs: 300 },
    { text: 'Try this one before we move on.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Work out what the role can actually do.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'A role’s identity policy allows every S3 action. Its permission boundary allows only s3:GetObject. Can the role delete an object?',
        options: [
          { id: 'a', label: 'No', correct: true, feedback: 'Right. An action must be allowed by both the policy and the boundary. Delete is outside the boundary, so it is refused.' },
          { id: 'b', label: 'Yes, the identity policy allows it', feedback: 'The identity policy allows it, but the boundary does not, and both must agree.' },
          { id: 'c', label: 'Yes, because the boundary grants GetObject', feedback: 'A boundary never grants anything, and delete is not GetObject in any case.' },
        ],
      },
    ],
  },
}

const i21: Slide = {
  id: 'i21-boundary-benefits',
  navLabel: 'Why use boundaries',
  title: 'Key Benefits of',
  subtitle: 'Permission Boundaries',
  sourceSlides: [27],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'granular', label: 'Granular access control', body: 'Users and roles get only what their task needs.', tint: BLUE },
      { id: 'over', label: 'No over-privileged users', body: 'Nobody quietly accumulates more access than they should.', tint: ROSE },
      { id: 'compliance', label: 'Compliance and governance', body: 'A clear tool for meeting industry regulations.', tint: VIOLET },
      { id: 'simple', label: 'Simpler to manage', body: 'Well-defined limits are easier to understand and to audit.', tint: ELECTRIC },
      { id: 'scale', label: 'Scales with you', body: 'Boundaries keep working as the environment grows.', tint: MINT },
    ],
  },
  script: [
    { text: 'Permission boundaries bring five benefits. Granular access control: users and roles are granted only the permissions their specific task needs.', reveal: 'granular' },
    { text: 'They prevent over-privileged users, so nobody quietly accumulates more access than they should have.', reveal: 'over' },
    { text: 'They improve compliance and governance, giving you a clear tool for meeting industry regulations.', reveal: 'compliance' },
    { text: 'They simplify access and policy management, because well-defined limits are easier to understand and to audit.', reveal: 'simple' },
    { text: 'And they scale. As your AWS environment grows, the boundaries grow with it.', reveal: 'scale', holdMs: 400 },
  ],
}

const i22: Slide = {
  id: 'i22-boundary-practices',
  navLabel: 'Boundary best practices',
  title: 'Permission Boundaries:',
  subtitle: '8 Best Practices',
  sourceSlides: [28],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 4,
    cards: [
      { id: 'b1', label: 'Apply them to roles, not developers', tint: BLUE },
      { id: 'b2', label: 'Combine with identity policies and SCPs', tint: ELECTRIC },
      { id: 'b3', label: 'Do not copy developer policies into boundaries', tint: ORANGE },
      { id: 'b4', label: 'Group boundaries into categories', tint: VIOLET },
      { id: 'b5', label: 'Fit them to common business purposes', tint: TEAL },
      { id: 'b6', label: 'Apply the least privilege principle', tint: ROSE },
      { id: 'b7', label: 'Watch cross-account access', tint: GOLD },
      { id: 'b8', label: 'Document and label everything', tint: MINT },
    ],
  },
  script: [
    { text: 'There are eight best practices for permission boundaries. First, apply them to IAM roles, not to the developers themselves.', reveal: 'b1' },
    { text: 'Second, use them together with identity policies and AWS Organizations service control policies.', reveal: 'b2' },
    { text: 'Third, avoid copying the developer policy space into the boundary. A boundary should be a limit, not a duplicate.', reveal: 'b3' },
    { text: 'Fourth, group boundaries into categories.', reveal: 'b4' },
    { text: 'Fifth, adapt them to common business purposes, rather than writing one for every person.', reveal: 'b5' },
    { text: 'Sixth, apply the principle of least privilege.', reveal: 'b6' },
    { text: 'Seventh, be conscious of cross-account access.', reveal: 'b7' },
    { text: 'And eighth, document and label everything, so the next person understands why each boundary exists.', reveal: 'b8', holdMs: 400 },
  ],
}

const i23: Slide = {
  id: 'i23-when-boundaries',
  navLabel: 'When to use boundaries',
  title: 'When Should You Use',
  subtitle: 'Permission Boundaries?',
  sourceSlides: [29],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'tenant', label: 'Multi-tenant environments', body: 'Isolate each tenant’s data and resources when many share AWS.', tint: BLUE },
      { id: 'third', label: 'Third-party access', body: 'Vendors and partners reach only what their task needs.', tint: ORANGE },
      { id: 'complex', label: 'Complex IAM policies', body: 'An extra layer of safety over a tangle of policies.', tint: VIOLET },
      { id: 'regulated', label: 'Regulated industries', body: 'Clearly defined access controls for compliance.', tint: ROSE },
      { id: 'resource', label: 'Fine-grained resource control', body: 'Precise management and auditing of permissions.', tint: MINT },
    ],
  },
  script: [
    { text: 'So when should you use permission boundaries? In multi-tenant environments, where several tenants share AWS resources and each one’s data must stay isolated.', reveal: 'tenant' },
    { text: 'For third-party and cross-account access, so vendors and partners reach only the resources their task needs.', reveal: 'third' },
    { text: 'Where IAM policies have become complex, boundaries simplify management and add a layer of security.', reveal: 'complex' },
    { text: 'In industries with strict regulatory requirements, because they define access controls clearly.', reveal: 'regulated' },
    { text: 'And wherever fine-grained control over resources matters, they allow precise management and auditing of permissions.', reveal: 'resource', holdMs: 400 },
  ],
}

const i24: Slide = {
  id: 'i24-policy-structure',
  navLabel: 'Policy types and structure',
  title: 'IAM Policies and',
  subtitle: 'Policy Structure',
  sourceSlides: [30],
  scene: 'split',
  data: {
    kind: 'split',
    intro: 'IAM policies are JSON documents that say which actions are allowed or denied.',
    left: {
      title: 'Policy types',
      tint: BLUE,
      items: [
        { id: 'aws', label: 'AWS managed', body: 'Written and kept up to date by AWS.' },
        { id: 'customer', label: 'Customer managed', body: 'Written and maintained by you. Reusable across identities.' },
        { id: 'inline', label: 'Inline', body: 'Embedded directly in one user, group, or role.' },
      ],
    },
    right: {
      title: 'Inside every policy',
      tint: ORANGE,
      items: [
        { id: 'version', label: 'Version', body: 'The policy language version, such as 2012-10-17.' },
        { id: 'statement', label: 'Statement', body: 'One or more permissions, each with an Effect, Action, and Resource.' },
        { id: 'condition', label: 'Condition (optional)', body: 'Rules for when the statement applies.' },
      ],
    },
  },
  script: [
    { text: 'IAM policies are JSON documents that define permissions. They are attached to users, groups, or roles, and say which actions are allowed or denied.', reveal: 'intro' },
    { text: 'There are managed policies, which can be attached to many identities. AWS managed policies are written and kept up to date by AWS.', reveal: 'aws' },
    { text: 'Customer managed policies are written and maintained by you, the account owner.', reveal: 'customer' },
    { text: 'And inline policies are embedded directly in a single user, group, or role.', reveal: 'inline' },
    { text: 'Every policy document starts with a Version, the version of the policy language, such as 2012-10-17.', reveal: 'version' },
    { text: 'Then one or more Statements. Each one has an Effect, allow or deny, an Action, and a Resource the action applies to.', reveal: 'statement' },
    { text: 'And optionally a Condition, which sets rules for when the statement applies.', reveal: 'condition', holdMs: 400 },
  ],
}

const i25: Slide = {
  id: 'i25-policy-example',
  navLabel: 'Reading a policy',
  title: 'Reading an',
  subtitle: 'IAM Policy',
  sourceSlides: [11, 31, 33],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'This policy lets someone list every S3 bucket, and read objects from one bucket only.',
    code: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [',
      '    {',
      '      "Effect": "Allow",',
      '      "Action": "s3:ListBucket",',
      '      "Resource": "arn:aws:s3:::*"',
      '    },',
      '    {',
      '      "Effect": "Allow",',
      '      "Action": "s3:GetObject",',
      '      "Resource": "arn:aws:s3:::example_bucket/*"',
      '    }',
      '  ]',
      '}',
    ],
    highlights: [
      { id: 'version', lines: [2, 2], label: 'Version', body: 'The policy language version. Always 2012-10-17 for new policies.' },
      { id: 'statement', lines: [3, 14], label: 'Statement', body: 'A list of permissions. This one has two.' },
      { id: 'first', lines: [5, 7], label: 'Allow listing every bucket', body: 'Effect Allow, action ListBucket, on every bucket.' },
      { id: 'second', lines: [10, 12], label: 'Allow reading one bucket', body: 'GetObject, but only on objects inside example_bucket.' },
    ],
  },
  script: [
    { text: 'Let us read a real policy. This one lets someone list all their S3 buckets, and read objects from one bucket only.', reveal: 'intro' },
    { text: 'Line two is the Version. It is the version of the policy language, and for new policies it is always 2012-10-17.', reveal: 'version' },
    { text: 'The Statement is a list of permissions. This policy has two of them.', reveal: 'statement' },
    { text: 'The first statement allows the ListBucket action, and the star in the resource means every bucket.', reveal: 'first' },
    { text: 'The second allows GetObject, but its resource names one bucket, example bucket. So objects can be read from that bucket, and no other.', reveal: 'second', holdMs: 300 },
    { text: 'One quick question before we go on.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Check your reading of the policy.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'Someone with only this policy tries to delete an object from example_bucket. What happens?',
        options: [
          { id: 'a', label: 'It is denied', correct: true, feedback: 'Correct. Anything a policy does not allow is denied by default. DeleteObject is never mentioned, so it is refused.' },
          { id: 'b', label: 'It works, because they can read the bucket', feedback: 'Reading and deleting are different actions. Only GetObject was allowed.' },
          { id: 'c', label: 'It works, because the first statement covers every bucket', feedback: 'The first statement allows listing buckets, not changing what is in them.' },
        ],
      },
    ],
  },
}

const i26: Slide = {
  id: 'i26-policy-elements',
  navLabel: 'Policy elements explained',
  title: 'Policy Elements',
  subtitle: 'Explained',
  sourceSlides: [32],
  scene: 'cards',
  data: {
    kind: 'cards',
    columns: 3,
    cards: [
      { id: 'version', label: 'Version', eyebrow: '"2012-10-17"', body: 'The version of the policy language.', tint: BLUE },
      { id: 'statement', label: 'Statement', eyebrow: '[ ... ]', body: 'The main element, holding the individual permissions.', tint: ELECTRIC },
      { id: 'effect', label: 'Effect', eyebrow: '"Allow" or "Deny"', body: 'Whether the action is allowed or denied.', tint: MINT },
      { id: 'action', label: 'Action', eyebrow: '"s3:ListBucket"', body: 'The actions the statement covers.', tint: ORANGE },
      { id: 'resource', label: 'Resource', eyebrow: '"arn:aws:s3:::bucket/*"', body: 'The resources the actions apply to.', tint: VIOLET },
      { id: 'condition', label: 'Condition', eyebrow: 'optional', body: 'Extra rules, such as source IP address or MFA.', tint: ROSE },
    ],
  },
  script: [
    { text: 'Here are the elements once more, each with an example. Version indicates the version of the policy language.', reveal: 'version' },
    { text: 'Statement is the main element. It contains the individual permissions as a list.', reveal: 'statement' },
    { text: 'Effect says whether the action is allowed or denied.', reveal: 'effect' },
    { text: 'Action lists the actions covered, such as s3 ListBucket.', reveal: 'action' },
    { text: 'Resource says which AWS resources those actions apply to, written as an ARN, an Amazon Resource Name.', reveal: 'resource' },
    { text: 'And Condition is optional. It restricts when the statement applies, for example to certain IP addresses, or only when MFA was used.', reveal: 'condition', holdMs: 400 },
  ],
}

const i27: Slide = {
  id: 'i27-condition',
  navLabel: 'Policies with conditions',
  title: 'A Policy With a',
  subtitle: 'Condition',
  sourceSlides: [34],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'The same permission, but only for requests that come from one network.',
    code: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [',
      '    {',
      '      "Effect": "Allow",',
      '      "Action": "s3:GetObject",',
      '      "Resource": "arn:aws:s3:::example_bucket/*",',
      '      "Condition": {',
      '        "IpAddress": {',
      '          "aws:SourceIp": "203.0.113.0/24"',
      '        }',
      '      }',
      '    }',
      '  ]',
      '}',
    ],
    highlights: [
      { id: 'grant', lines: [5, 7], label: 'The permission', body: 'Read objects from example_bucket.' },
      { id: 'condition', lines: [8, 12], label: 'The condition block', body: 'The statement only applies when this is true.' },
      { id: 'ip', lines: [10, 10], label: 'Source IP range', body: 'Requests must come from addresses in 203.0.113.0/24.' },
    ],
    footnote: { id: 'foot', text: 'The same condition can sit on any statement. The deck’s example puts it on both ListBucket and GetObject.' },
  },
  script: [
    { text: 'Conditions make a policy much more precise. This one grants the same kind of permission, but only for requests from one network.', reveal: 'intro' },
    { text: 'The permission itself is familiar: read objects from example bucket.', reveal: 'grant' },
    { text: 'Then comes the Condition block. The statement only applies while the condition is true.', reveal: 'condition' },
    { text: 'Here the condition checks the source IP address. Requests must come from the range 203.0.113.0 slash 24, for example an office network. From anywhere else, the request is denied.', reveal: 'ip' },
    { text: 'The same condition can be added to any statement. The example in your notes applies it to both the list and the read permissions.', reveal: 'foot', holdMs: 400 },
  ],
}

const i28: Slide = {
  id: 'i28-managed-policies',
  navLabel: 'AWS managed policies',
  title: 'AWS Managed',
  subtitle: 'Policies',
  sourceSlides: [35, 36],
  scene: 'code',
  data: {
    kind: 'code',
    intro: 'AWS writes ready-made policies for common jobs. This is AmazonEC2FullAccess.',
    code: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [',
      '    {',
      '      "Effect": "Allow",',
      '      "Action": "ec2:*",',
      '      "Resource": "*"',
      '    }',
      '  ]',
      '}',
    ],
    highlights: [
      { id: 'action', lines: [6, 6], label: 'ec2:*', body: 'The star means every EC2 action there is.' },
      { id: 'resource', lines: [7, 7], label: 'Resource: *', body: 'On every resource in the account.' },
      { id: 'readonly', lines: [5, 7], label: 'Compare: AmazonS3ReadOnlyAccess', body: 'Allows only List and Get actions on S3. Reading, never changing.' },
    ],
    footnote: { id: 'foot', text: 'Managed policies are convenient, but check what a star grants before you attach one.' },
  },
  script: [
    { text: 'AWS writes ready-made policies for common jobs, called AWS managed policies. This one is Amazon EC2 Full Access.', reveal: 'intro' },
    { text: 'The action is e c 2 colon star. The star means every EC2 action that exists.', reveal: 'action' },
    { text: 'And the resource is a star too, meaning every resource in the account. That is full access, as the name says.', reveal: 'resource' },
    { text: 'Compare Amazon S3 Read Only Access. It allows only list and get actions on S3, such as listing buckets and reading objects. It can read, but never change anything.', reveal: 'readonly' },
    { text: 'Managed policies are convenient, but always check what a star grants before you attach one.', reveal: 'foot', holdMs: 400 },
  ],
}

const i29: Slide = {
  id: 'i29-best-practices',
  navLabel: 'IAM best practices',
  title: 'AWS IAM',
  subtitle: 'Best Practices',
  sourceSlides: [37],
  scene: 'cards',
  data: {
    kind: 'cards',
    intro: 'Seven habits that keep an AWS environment secure and manageable.',
    columns: 4,
    cards: [
      { id: 'least', label: 'Use least privilege', body: 'Grant only what the task needs.', tint: BLUE },
      { id: 'mfa', label: 'Turn on MFA', body: 'Especially for the root user and admins.', tint: ROSE },
      { id: 'caution', label: 'Change policies with caution', body: 'Test before changing live access.', tint: TEAL },
      { id: 'conditions', label: 'Use policy conditions', body: 'Narrow access by IP, time, or MFA.', tint: ORANGE },
      { id: 'remove', label: 'Remove unused credentials', body: 'Delete keys and users no one needs.', tint: VIOLET },
      { id: 'aws', label: 'Use AWS-defined policies', body: 'Start from policies AWS maintains.', tint: ELECTRIC },
      { id: 'groups', label: 'Assign permissions to groups', body: 'Not to individual users.', tint: MINT },
    ],
  },
  script: [
    { text: 'To finish, seven best practices that keep an AWS environment secure and manageable.', reveal: 'intro' },
    { text: 'Use the least privilege model. Grant only the permissions a task actually needs.', reveal: 'least' },
    { text: 'Turn on multi-factor authentication, above all for the root user and administrators.', reveal: 'mfa' },
    { text: 'Change policies with caution, and test them before changing access that people rely on.', reveal: 'caution' },
    { text: 'Use policy conditions to narrow access, by IP address, by time, or by whether MFA was used.', reveal: 'conditions' },
    { text: 'Remove unnecessary credentials. Delete access keys and users that nobody needs any more.', reveal: 'remove' },
    { text: 'Use AWS defined policies as your starting point, since AWS keeps them up to date.', reveal: 'aws' },
    { text: 'And use groups for assigning permissions, rather than setting them user by user.', reveal: 'groups', holdMs: 300 },
    { text: 'One last check on this module.', gate: true },
  ],
  interaction: {
    kind: 'scenario-match',
    prompt: 'Apply the best practices.',
    scenarios: [
      {
        id: 'q1',
        scenario: 'Twelve new support staff start on Monday, all needing the same access. What is the best approach?',
        options: [
          { id: 'a', label: 'Add them to a support group that has the permissions', correct: true, feedback: 'Yes. Permissions are set once on the group, and every member gets them.' },
          { id: 'b', label: 'Attach the policy to each of the twelve users', feedback: 'It works, but twelve copies means twelve places to update or forget.' },
          { id: 'c', label: 'Share one login between them', feedback: 'Never share logins. You lose any record of who did what.' },
        ],
      },
      {
        id: 'q2',
        scenario: 'An access key belonging to a developer who left last year is still active. What should you do?',
        options: [
          { id: 'a', label: 'Leave it, in case it is needed', feedback: 'An unused key is pure risk, with no benefit.' },
          { id: 'b', label: 'Delete it', correct: true, feedback: 'Correct. Remove unnecessary credentials. An active key nobody owns is exactly what attackers look for.' },
          { id: 'c', label: 'Give it to the new developer', feedback: 'Credentials should belong to one person. Create a new user and key instead.' },
        ],
      },
    ],
  },
}

const i30: Slide = {
  id: 'i30-complete',
  navLabel: 'Module complete',
  title: 'Module 2 Complete',
  sourceSlides: [38],
  scene: 'module-outro',
  data: {
    kind: 'module-outro',
    heading: 'Module 2 complete',
    covered: [
      'Root, users, groups and roles',
      'Passwords, access keys, MFA, federation and roles',
      'The six policy types and permission boundaries',
      'How to read an IAM policy, line by line',
    ],
    next: 'Next: Module 3, Elastic Compute Cloud (EC2), where these permissions start controlling real servers.',
  },
  script: [
    { text: 'That is the end of Module Two, Identity and Access Management.', reveal: 'done', holdMs: 300 },
    { text: 'You now know the identities IAM manages, the ways they authenticate, the six types of policy, how permission boundaries set a ceiling, and how to read a policy line by line.', reveal: 'covered' },
    { text: 'Next comes Module Three, Elastic Compute Cloud, where these permissions start controlling real servers. Well done.', reveal: 'next', holdMs: 500 },
  ],
}

export const slidesIam: Slide[] = [
  i01, i02, i03, i04, i05, i06, i07, i08, i09, i10,
  i11, i12, i13, i14, i15, i16, i17, i18, i19, i20,
  i21, i22, i23, i24, i25, i26, i27, i28, i29, i30,
]
