/**
 * The site's own name and address. Learn Tech Hub is DGCL Digital Cloud
 * Academy's learning site; DGCL is still who teaches and certifies.
 *
 * The address comes from NEXT_PUBLIC_SITE_URL when the site is built (a
 * GitHub repository variable), so the same code can be served from another
 * subdomain without a change here.
 */
export const SITE = {
  name: 'Learn Tech Hub',
  /** One word, for the header mark and the phone's home screen. */
  wordmark: 'LearnTechHub',
  owner: 'DGCL Digital Cloud Academy',
  /** No trailing slash. Used for canonical links, the sitemap and social cards. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://lth.dgclgroup.com').replace(/\/$/, ''),
  title: 'Learn Tech Hub: tech training by DGCL Digital Cloud Academy',
  description:
    'Narrated AWS Cloud lessons with a free start, from DGCL Digital Cloud Academy, a UK registered training provider. Instructor-led training in AWS Cloud, DevOps Tools, Cybersecurity and Ethical Hacking, and Healthcare Data Analysis, AI and Machine Learning.',
  themeColor: '#000066',
}
