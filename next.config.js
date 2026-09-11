/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // The SCORM build gets its own build directory. Sharing .next with `next dev`
  // meant a packaging run silently broke the running dev server (it starts
  // 404ing its own chunks and the page stops hydrating).
  distDir: process.env.SCORM_BUILD ? '.next-scorm' : '.next',
  images: { unoptimized: true },
  // NOTE: asset paths are made relative for SCORM by a post-build rewrite in
  // scripts/build-scorm.mjs, not by assetPrefix — next/font rejects a relative
  // assetPrefix ("must start with a leading slash or be an absolute URL").
  trailingSlash: true,
}
module.exports = nextConfig
