/**
 * Builds the SCORM 1.2 package.
 *
 *   1. Static-export the app with relative asset URLs (an LMS serves the SCO
 *      from an arbitrary subdirectory, so root-absolute paths break).
 *   2. Drop in an imsmanifest.xml describing a single SCO.
 *   3. Zip the lot into dist/.
 *
 * The SCORM runtime calls themselves live in src/lib/progress — the app talks
 * to window.API directly. The surface actually used is five methods, so a
 * runtime library would have been more dependency than it was worth.
 */
import { execSync } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { mkdir, writeFile, rm, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import archiver from 'archiver'

const ROOT = path.resolve(import.meta.dirname, '..')
// With a custom distDir the static export lands in that directory, not in
// out/. Zipping out/ silently produced a package with no audio and no art, so
// the location is explicit and asserted below.
const OUT = path.join(ROOT, '.next-scorm')
const DIST = path.join(ROOT, 'dist')
const ID = 'dgcl-aws-section-01'
const TITLE = 'AWS Fundamentals — Section 1'

const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${ID}-manifest" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="${ID}-org">
    <organization identifier="${ID}-org">
      <title>${TITLE}</title>
      <item identifier="${ID}-item" identifierref="${ID}-res" isvisible="true">
        <title>${TITLE}</title>
        <adlcp:masteryscore>67</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="${ID}-res" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
`

/**
 * Turn root-absolute asset URLs into relative ones.
 *
 * An LMS unpacks the SCO into an arbitrary subdirectory and serves index.html
 * from there, so "/_next/..." resolves against the LMS domain root and 404s.
 * The export is a single route at the archive root, so a plain "./" prefix is
 * correct for every file. Webpack's own runtime path is patched too, otherwise
 * any chunk it fetches at runtime would still go to the domain root.
 */
async function makeRelative(dir) {
  // Everything served from public/ is referenced root-absolutely too, not just
  // /_next/ — next/image emits src="/brand/…" and the scenes reference /art/….
  const ROOTS = ['_next', 'brand', 'art', 'audio', 'video']

  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name)
    if (ext !== '.html' && ext !== '.js' && ext !== '.css') continue

    const file = path.join(entry.parentPath ?? entry.path, entry.name)
    const before = await readFile(file, 'utf8')

    // A relative URL inside a stylesheet resolves against the STYLESHEET, not
    // the document, so a CSS file nested at _next/static/css/x.css has to climb
    // back to the archive root. HTML and JS both resolve against the document,
    // where "./" is correct.
    const depth = path.relative(dir, path.dirname(file)).split(path.sep).filter(Boolean).length
    const prefix = ext === '.css' ? (depth ? '../'.repeat(depth) : './') : './'

    let after = before
    for (const root of ROOTS) {
      for (const open of ['"', "'", '(']) {
        after = after.replaceAll(`${open}/${root}/`, `${open}${prefix}${root}/`)
      }
    }
    after = after.replaceAll('="/favicon', `="${prefix}favicon`)

    if (after !== before) await writeFile(file, after, 'utf8')
  }
}

/**
 * Fail loudly rather than shipping a broken SCO.
 *
 * A package that is merely small and well-formed still looks like a success;
 * this checks the things a learner would actually notice missing.
 */
async function assertComplete(dir) {
  const files = (await readdir(dir, { recursive: true })).map(String)
  const problems = []
  if (!files.includes('index.html')) problems.push('no index.html')
  if (!files.some((f) => f.endsWith('.mp3'))) problems.push('no narration audio')
  if (!files.some((f) => f.includes('audio') && f.endsWith('.json')))
    problems.push('no narration timings')
  if (!files.some((f) => f.includes('brand'))) problems.push('no brand assets')
  if (problems.length) {
    throw new Error(`Refusing to package — ${problems.join(', ')}`)
  }
  const mp3s = files.filter((f) => f.endsWith('.mp3')).length
  console.log(`  ${files.length} files, ${mp3s} narration tracks`)
}

async function main() {
  console.log('› static export (relative asset paths)')
  execSync('npx next build', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, SCORM_BUILD: '1' },
  })

  console.log('› rewriting asset paths to relative')
  await makeRelative(OUT)

  console.log('› imsmanifest.xml')
  await writeFile(path.join(OUT, 'imsmanifest.xml'), manifest, 'utf8')

  await assertComplete(OUT)

  await rm(DIST, { recursive: true, force: true })
  await mkdir(DIST, { recursive: true })

  const zipPath = path.join(DIST, `${ID}.zip`)
  console.log('› zipping')
  await new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', resolve)
    archive.on('error', reject)
    archive.pipe(output)
    // Contents at the archive root — an LMS expects imsmanifest.xml at the top.
    archive.directory(OUT, false)
    archive.finalize()
  })

  console.log(`\n✓ ${path.relative(ROOT, zipPath)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
