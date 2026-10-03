import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SITE } from '@/config/site'
import { Pwa } from '@/components/site/Pwa'

/**
 * Typefaces are committed to the repo and loaded from disk, not fetched from
 * Google at build time. Two reasons: the SCORM package has to render correctly
 * inside an LMS with no outbound internet access, and a build that reaches the
 * network is a build that fails when the network does.
 *
 * Latin subset only — ~130KB total.
 */
const display = localFont({
  src: [{ path: './fonts/montserrat-var.woff2', weight: '600 800', style: 'normal' }],
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

const body = localFont({
  src: [{ path: './fonts/raleway-var.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

// Inside the player (slides, captions, activities). Sora has a large
// x-height and open shapes, so it stays readable when a slide is scaled down
// to phone size, where Raleway's thin strokes faded.
const slide = localFont({
  src: [{ path: './fonts/sora-var.woff2', weight: '300 700', style: 'normal' }],
  variable: '--font-slide',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

const mono = localFont({
  src: [
    { path: './fonts/plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plex-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'Consolas', 'monospace'],
})

// Google Search Console: paste the code from its "HTML tag" method into
// NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (a GitHub repository variable; it is not a secret).
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'free AWS course',
    'AWS Cloud training',
    'DevOps tools training',
    'cybersecurity and ethical hacking course',
    'healthcare data analysis AI machine learning',
    'DGCL Digital Cloud Academy',
    'FreeTechPath',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: '/',
    locale: 'en_GB',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'FreeTechPath by DGCL Digital Cloud Academy' }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: ['/og.png'] },
  icons: { apple: '/pwa/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'default' },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#10182E' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${slide.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <Pwa />
      </body>
    </html>
  )
}
