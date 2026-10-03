import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

/** Public pages only. Signed-in pages are kept out here and in robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [path: string, priority: number, freq: 'weekly' | 'monthly'][] = [
    ['/', 1, 'weekly'],
    ['/course/', 0.9, 'weekly'],
    ['/plans/', 0.8, 'monthly'],
    ['/partners/', 0.5, 'monthly'],
    ['/signup/', 0.7, 'monthly'],
    ['/login/', 0.3, 'monthly'],
  ]
  const lastModified = new Date()
  return pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE.url}${path}`, lastModified, changeFrequency, priority }))
}
