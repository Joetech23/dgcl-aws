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
}
module.exports = nextConfig
