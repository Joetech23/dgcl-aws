/** @type {import('next').NextConfig} */
const scorm = Boolean(process.env.SCORM_BUILD)

/**
 * One repo, two products.
 *
 * - The web build is the DGCL learning site: landing page, sign-up, dashboard,
 *   and a per-module lesson player.
 * - The SCORM build is the original single-page course for an LMS. It builds
 *   only the `*.scorm.tsx` files in src/app (a layout and a page wrapping the
 *   full CoursePlayer), as a static export.
 *
 * The web build ignores `page.scorm.tsx` because Next only treats files named
 * exactly `page`, `layout`, etc. as routes.
 */
// Sent with every page and file. They tell the browser to refuse the common
// tricks: showing the site inside another site's frame, guessing a file's
// type, leaking full addresses to other sites, and using http once https is known.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const nextConfig = {
  // 'js' is needed for Next's own built-in _document/_app/_error pages (there
  // are no .js files in src/app). It also keeps the list longer than one item:
  // Next passes it to its loaders through a query string, and a one-item list
  // comes back as a string ("pageExtensions.map is not a function").
  ...(scorm ? { output: 'export', pageExtensions: ['scorm.tsx', 'js'] } : {}),
  // CPANEL_BUILD produces a self-contained server (.next-cpanel/standalone)
  // for hosts where you upload a built app instead of building on the server.
  ...(process.env.CPANEL_BUILD ? { output: 'standalone' } : {}),
  // The SCORM build gets its own build directory. Sharing .next with `next dev`
  // meant a packaging run silently broke the running dev server (it starts
  // 404ing its own chunks and the page stops hydrating).
  // NEXT_DIST_DIR lets a second dev server (e.g. a test server with no
  // Supabase keys) run beside the main one without sharing build files.
  distDir: scorm ? '.next-scorm' : process.env.CPANEL_BUILD ? '.next-cpanel' : process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  // NOTE: asset paths are made relative for SCORM by a post-build rewrite in
  // scripts/build-scorm.mjs, not by assetPrefix — next/font rejects a relative
  // assetPrefix ("must start with a leading slash or be an absolute URL").
  trailingSlash: true,
  // Do not announce the framework and version to anyone who asks.
  poweredByHeader: false,
  // Not for the SCORM package: that is a folder of files inside an LMS, which
  // sets its own headers (and must be allowed to frame the course).
  ...(scorm ? {} : { headers: async () => [{ source: '/:path*', headers: securityHeaders }] }),
}
module.exports = nextConfig
