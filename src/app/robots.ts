import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Signed-in pages, plumbing and the bare player have nothing for a search result.
        disallow: ['/dashboard/', '/learn/', '/classes/', '/account/', '/admin/', '/api/', '/auth/', '/player/', '/dev/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
