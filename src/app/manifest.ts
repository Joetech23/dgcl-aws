import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

/** Lets a learner install the site on their phone or laptop like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} by ${SITE.owner}`,
    short_name: SITE.name,
    description: SITE.description,
    id: '/',
    start_url: '/dashboard/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#FFFFFF',
    theme_color: SITE.themeColor,
    categories: ['education'],
    icons: [
      { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Continue learning', url: '/dashboard/' },
      { name: 'Instructor-led classes', url: '/classes/' },
    ],
  }
}
