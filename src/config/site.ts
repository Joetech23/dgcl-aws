/**
 * The site's own name and address. FreeTechPath is DGCL Digital Cloud
 * Academy's free learning site; DGCL is still who teaches and certifies.
 */
export const SITE = {
  name: 'FreeTechPath',
  owner: 'DGCL Digital Cloud Academy',
  /** No trailing slash. Used for canonical links, the sitemap and social cards. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://freelearning.dgclgroup.com').replace(/\/$/, ''),
  title: 'FreeTechPath: free tech training by DGCL Digital Cloud Academy',
  description:
    'Free narrated lessons in AWS Cloud from DGCL Digital Cloud Academy, a UK registered training provider, with live instructor-led classes in AWS Cloud, DevOps Tools, Cybersecurity and Ethical Hacking, and Healthcare Data Analysis, AI and Machine Learning.',
  themeColor: '#000066',
}
