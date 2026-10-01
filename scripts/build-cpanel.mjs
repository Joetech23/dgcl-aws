/**
 * Builds the site as one zip to upload to cPanel's "Setup Node.js App".
 *
 *   npm run build:cpanel   ->   dist/dgcl-cpanel.zip
 *
 * Shared hosts rarely have the memory to run `next build`, so the build
 * happens here and the server only has to run it. The zip holds Next's
 * standalone server (its own trimmed node_modules included), the static
 * files, public/ (audio, art, certificate frame) and app.js, the startup
 * file cPanel is pointed at. Nothing needs installing on the server.
 *
 * The NEXT_PUBLIC_ values in .env.local (Supabase URL and key) are compiled
 * into the build, so build with the production values in place.
 */
import { execSync } from 'node:child_process'
import { cp, mkdir, rm, writeFile, readFile, stat } from 'node:fs/promises'
import { createWriteStream, existsSync } from 'node:fs'
import path from 'node:path'
import archiver from 'archiver'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, '.next-cpanel')
const STANDALONE = path.join(DIST, 'standalone')
const ZIP = path.join(ROOT, 'dist', 'dgcl-cpanel.zip')

// Locally the Supabase values come from .env.local; in GitHub Actions they
// come from repository secrets, as environment variables.
const env = await readFile(path.join(ROOT, '.env.local'), 'utf8').catch(() => '')
if (!/NEXT_PUBLIC_SUPABASE_URL=\S+/.test(env) && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('! .env.local has no Supabase URL: this build will run in preview mode (browser-only data).')
}

// --package-only re-zips the last build without rebuilding.
if (!process.argv.includes('--package-only')) {
  console.log('> building (this takes a few minutes)')
  await rm(DIST, { recursive: true, force: true })
  execSync('npx next build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, CPANEL_BUILD: '1' } })
}

if (!existsSync(path.join(STANDALONE, 'server.js'))) throw new Error('standalone server.js was not produced')

console.log('> adding static files and public/')
await cp(path.join(DIST, 'static'), path.join(STANDALONE, '.next-cpanel', 'static'), { recursive: true })
await cp(path.join(ROOT, 'public'), path.join(STANDALONE, 'public'), { recursive: true })

// The startup file, written into the zip's top level (see below). cPanel runs
// apps through Passenger, which hands the app its own socket; Next only needs
// a neutral host to bind to. Some hosts set HOSTNAME to the machine's name,
// which Next would otherwise try to bind.
const APP_JS = `// Startup file for cPanel "Setup Node.js App". Do not rename or move.
// The site itself lives in ./site, with its own node_modules. It must stay
// there: CloudLinux manages a node_modules link in this top folder and
// refuses to run an app that brings its own.
process.env.NODE_ENV = 'production'
process.env.HOSTNAME = '0.0.0.0'
require('./site/server.js')
`
await rm(path.join(STANDALONE, 'app.js'), { force: true })

// dist/cpanel is the same content as the zip, as a plain folder: it is what
// the GitHub Actions workflow uploads. tmp/restart.txt changes on every build;
// cPanel (Passenger) restarts the app when that file's timestamp moves.
const STAGE = path.join(ROOT, 'dist', 'cpanel')
console.log('> staging dist/cpanel')
await rm(STAGE, { recursive: true, force: true })
await mkdir(path.join(STAGE, 'tmp'), { recursive: true })
await cp(STANDALONE, path.join(STAGE, 'site'), { recursive: true })
await writeFile(path.join(STAGE, 'app.js'), APP_JS)
await writeFile(path.join(STAGE, 'tmp', 'restart.txt'), `deployed ${new Date().toISOString()}
`)

await mkdir(path.dirname(ZIP), { recursive: true })
await rm(ZIP, { force: true })
console.log('> zipping')
await new Promise((resolve, reject) => {
  const output = createWriteStream(ZIP)
  const archive = archiver('zip', { zlib: { level: 9 } })
  output.on('close', resolve)
  archive.on('error', reject)
  archive.pipe(output)
  // Layout: app.js at the top, everything else under site/.
  // dot: true keeps .next-cpanel, which the server needs.
  archive.glob('**/*', { cwd: STAGE, dot: true })
  archive.finalize()
})

const mb = ((await stat(ZIP)).size / 1e6).toFixed(1)
console.log(`\n✓ dist${path.sep}dgcl-cpanel.zip  (${mb} MB)\n  Startup file: app.js   Node.js: 18.17 or newer (20 recommended)`)
