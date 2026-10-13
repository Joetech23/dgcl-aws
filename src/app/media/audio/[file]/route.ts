import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse, type NextRequest } from 'next/server'
import { paidModuleForAudio } from '@/config/pricing'
import { asUser, bearer, supabaseOnServer } from '@/lib/server/supabase'

/**
 * The narration (and its word timings) for paid modules.
 *
 * Free modules' files are ordinary public files under /audio. A paid module's
 * files are kept out of the public folder on the live server (the cPanel
 * build moves them to private/audio) and can only be fetched here, by a
 * signed-in learner who has bought that module or is on a programme. The
 * database decides, through its my_access() function; the lock in the page
 * is only what the learner sees.
 *
 * Without the narration a lesson cannot play: the audio is its clock.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NAME = /^[a-z][a-z0-9-]{1,80}\.(mp3|json)$/
const deny = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET(req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  if (!NAME.test(file)) return deny(404, 'not-found')
  const slug = paidModuleForAudio(file)
  // Free narration is not served from here at all.
  if (!slug) return deny(404, 'not-found')

  // The preview/test build has no real accounts or payments to check.
  if (supabaseOnServer()) {
    const token = bearer(req)
    if (!token) return deny(401, 'sign-in')
    const { data, error } = await asUser(token).rpc('my_access')
    const row = (data as { track: string | null; modules: string[] | null }[] | null)?.[0]
    if (error || !row) return deny(401, 'sign-in')
    if (!row.track && !(row.modules ?? []).includes(slug)) return deny(403, 'not-purchased')
  }

  // turbopackIgnore: these folders are put beside the server by
  // scripts/build-cpanel.mjs. Left to the bundler, a path it cannot work out
  // in advance makes it copy the whole project into the standalone build.
  const root = process.cwd()
  for (const dir of [path.join(/* turbopackIgnore: true */ root, 'private', 'audio'), path.join(/* turbopackIgnore: true */ root, 'public', 'audio')]) {
    try {
      const bytes = await readFile(path.join(/* turbopackIgnore: true */ dir, file))
      return new NextResponse(bytes, {
        headers: {
          'Content-Type': file.endsWith('.mp3') ? 'audio/mpeg' : 'application/json; charset=utf-8',
          'Content-Length': String(bytes.byteLength),
          // Never kept by the browser or a proxy: the next person on this device must be checked too.
          'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    } catch {
      /* try the next folder */
    }
  }
  return deny(404, 'not-found')
}
