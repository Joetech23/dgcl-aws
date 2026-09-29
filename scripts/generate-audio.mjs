/**
 * Generates the narration.
 *
 * Uses Microsoft's neural voices through Edge's read-aloud service — free, no
 * API key — and writes one MP3 per slide plus a timing file. Real audio files
 * are not a nicety here: they are what makes the timeline seekable and the
 * animation synchronisable. Browser speechSynthesis cannot be scrubbed, so a
 * synced course is impossible on it no matter how it is designed.
 *
 *   node scripts/generate-audio.mjs            # only missing slides
 *   node scripts/generate-audio.mjs --force    # regenerate everything
 *
 * Output, per slide, into public/audio/:
 *   <id>.mp3     the narration
 *   <id>.json    { durationMs, lines[{startMs,endMs}], words[{ms,d,t}] }
 *
 * Swapping to ElevenLabs later means replacing this file. Nothing in the app
 * changes — it only ever reads the two artefacts above.
 */
import { mkdir, writeFile, readFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'
import { EdgeTTS } from 'edge-tts-universal'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'audio')

// British, warm, unhurried. DGCL is a London company and the audience is UK.
const VOICE = 'en-GB-SoniaNeural'
const RATE = '-6%'

const force = process.argv.includes('--force')

/** Edge reports offsets in 100-nanosecond ticks. */
const ticksToMs = (t) => Math.round(t / 10_000)

/**
 * Pulls the script out of the TypeScript content file.
 *
 * The alternative is compiling the TS just to read four arrays of strings,
 * which is a lot of machinery for a build script. The shape it matches is
 * fixed by src/lib/course/types.ts and a mismatch fails loudly below.
 */
async function readSlides() {
  // Every file in the slides folder, not just index.ts: the content is split
  // across several files and a missed file means silent slides.
  const dir = path.join(ROOT, 'src', 'content', 'slides')
  const names = (await readdir(dir)).filter((f) => f.endsWith('.ts')).sort()
  const src = (
    await Promise.all(names.map((f) => readFile(path.join(dir, f), 'utf8')))
  ).join('\n')

  const slides = []
  const slideRe = /id:\s*'([^']+)',\s*\n\s*navLabel:/g
  let m
  while ((m = slideRe.exec(src))) {
    const id = m[1]
    const scriptStart = src.indexOf('script: [', m.index)
    if (scriptStart === -1) continue
    // Walk to the matching close bracket so nested arrays don't end it early.
    let depth = 0
    let i = src.indexOf('[', scriptStart)
    const from = i
    for (; i < src.length; i++) {
      if (src[i] === '[') depth++
      else if (src[i] === ']') {
        depth--
        if (depth === 0) break
      }
    }
    const block = src.slice(from, i + 1)
    const lines = [...block.matchAll(/text:\s*\n?\s*'((?:[^'\\]|\\.)*)'/g)].map((t) =>
      t[1].replace(/\\'/g, "'").replace(/\\n/g, ' '),
    )
    if (lines.length) slides.push({ id, lines })
  }
  return slides
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * Maps each script line onto the word-boundary stream.
 *
 * The whole slide is synthesised as one take so the audio has no seams, then
 * the lines are recovered by counting words. Edge occasionally emits a token
 * that doesn't match our whitespace split, so this clamps rather than trusting
 * the arithmetic blindly.
 */
function mapLines(lines, words, durationMs) {
  const out = []
  let cursor = 0
  for (const line of lines) {
    const count = line.trim().split(/\s+/).length
    const startIdx = Math.min(cursor, Math.max(0, words.length - 1))
    const endIdx = Math.min(cursor + count - 1, words.length - 1)
    const startMs = words.length ? words[startIdx].ms : 0
    const last = words.length ? words[endIdx] : null
    const endMs = last ? last.ms + last.d : durationMs
    out.push({ startMs, endMs })
    cursor += count
  }
  if (out.length) out[out.length - 1].endMs = durationMs
  return out
}

/**
 * Synthesise with a timeout and retries.
 *
 * The Edge service sometimes drops the connection mid-request without an
 * error. The pending promise then never settles, nothing else keeps Node's
 * event loop alive, and the script exits silently halfway through a module.
 * The timeout both keeps the process alive and turns that silent drop into a
 * retry.
 */
async function synthesizeWithRetry(text, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let timer
    try {
      const tts = new EdgeTTS(text, VOICE, { rate: RATE })
      return await Promise.race([
        tts.synthesize(),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('timed out after 90s')), 90_000)
        }),
      ])
    } catch (err) {
      if (attempt === attempts) throw err
      const wait = 2000 * attempt
      process.stdout.write(`retry ${attempt} (${err.message}) … `)
      await new Promise((r) => setTimeout(r, wait))
    } finally {
      clearTimeout(timer)
    }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const slides = await readSlides()
  if (!slides.length) throw new Error('No slides parsed from src/content/slides/')

  console.log(`Voice: ${VOICE} (rate ${RATE})\n`)

  for (const slide of slides) {
    const mp3Path = path.join(OUT, `${slide.id}.mp3`)
    if (!force && (await exists(mp3Path))) {
      console.log(`· ${slide.id} — already generated, skipping`)
      continue
    }

    const text = slide.lines.join(' ')
    process.stdout.write(`· ${slide.id} — ${slide.lines.length} lines … `)

    const { audio, subtitle } = await synthesizeWithRetry(text)

    const buf = Buffer.from(await audio.arrayBuffer())
    await writeFile(mp3Path, buf)

    const words = subtitle.map((w) => ({
      ms: ticksToMs(w.offset),
      d: ticksToMs(w.duration),
      t: w.text,
    }))
    const durationMs = words.length
      ? words[words.length - 1].ms + words[words.length - 1].d + 250
      : 0

    await writeFile(
      path.join(OUT, `${slide.id}.json`),
      JSON.stringify(
        { durationMs, lines: mapLines(slide.lines, words, durationMs), words },
        null,
        0,
      ),
      'utf8',
    )

    console.log(`${(buf.length / 1024).toFixed(0)} KB, ${(durationMs / 1000).toFixed(1)}s`)
  }

  console.log('\n✓ narration written to public/audio/')
}

main().catch((err) => {
  console.error('\nAudio generation failed:', err.message)
  process.exit(1)
})
