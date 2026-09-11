import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

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

const mono = localFont({
  src: [
    { path: './fonts/plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plex-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'Consolas', 'monospace'],
})

export const metadata: Metadata = {
  title: 'AWS Fundamentals · Section 1 | DGCL Digital Cloud Academy',
  description:
    'An interactive introduction to Amazon Web Services. Built for people coming to the cloud for the first time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
