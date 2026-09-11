'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SlideTiming } from '@/lib/course/types'

/**
 * The audio clock.
 *
 * `audio.currentTime` IS the timeline. Everything visible is derived from it,
 * never accumulated on a tick — which is what lets the learner scrub backwards
 * and see the slide correctly rebuild itself, and what makes it impossible for
 * the picture to drift out of step with the voice.
 *
 * A gated line stops playback once it has finished being spoken and refuses to
 * go further until the activity is done. That single behaviour is the whole
 * difference between this and a video.
 */

export type TimelineState = {
  currentMs: number
  durationMs: number
  playing: boolean
  ready: boolean
  /** Index of the line being spoken right now. */
  lineIndex: number
  /** Index of the word being spoken, for transcript highlighting. */
  wordIndex: number
  /** True when playback is held at the gate waiting for the learner. */
  atGate: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (ms: number) => void
  replay: () => void
  setVolume: (v: number) => void
  volume: number
  muted: boolean
  toggleMute: () => void
}

export function useTimeline({
  src,
  timing,
  gateLine,
  gateSatisfied,
  onEnded,
}: {
  src: string
  timing: SlideTiming | null
  /** Index of the script line that gates progress, or -1. */
  gateLine: number
  gateSatisfied: boolean
  onEnded?: () => void
}): TimelineState {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const [currentMs, setCurrentMs] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [volume, setVol] = useState(1)
  const [muted, setMuted] = useState(false)

  const durationMs = timing?.durationMs ?? 0

  // Playback stops once the gated line has finished being spoken — not when it
  // starts, so the learner hears the whole instruction before being asked.
  const gateMs = useMemo(() => {
    if (!timing || gateLine < 0 || gateLine >= timing.lines.length) return Infinity
    return timing.lines[gateLine].endMs
  }, [timing, gateLine])

  const blocked = !gateSatisfied && gateMs !== Infinity

  /* ---------- element ---------- */

  useEffect(() => {
    const audio = new Audio(src)
    audio.preload = 'auto'
    // Kept in the DOM rather than as a detached object: media elements behave
    // more predictably inside an LMS iframe when they are actually mounted, and
    // it makes the clock inspectable by tests and tooling.
    audio.setAttribute('data-course-audio', '')
    audio.style.display = 'none'
    document.body.appendChild(audio)
    audioRef.current = audio

    const onLoaded = () => setReady(true)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnd = () => {
      setPlaying(false)
      onEnded?.()
    }
    // timeupdate keeps the clock alive when rAF is throttled in a hidden tab.
    const onTime = () => setCurrentMs(audio.currentTime * 1000)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('canplay', onLoaded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('timeupdate', onTime)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('canplay', onLoaded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('timeupdate', onTime)
      audio.remove()
      audioRef.current = null
    }
    // onEnded is intentionally not a dependency: re-creating the element on
    // every parent render would restart the narration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  /* ---------- smooth clock ---------- */

  useEffect(() => {
    if (!playing) return
    const tick = () => {
      const audio = audioRef.current
      if (audio) setCurrentMs(audio.currentTime * 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [playing])

  /* ---------- the gate ---------- */

  useEffect(() => {
    if (!blocked) return
    const audio = audioRef.current
    if (!audio) return
    if (currentMs >= gateMs) {
      audio.pause()
      // Hold exactly on the line so the transcript stays where the voice left
      // it, rather than drifting a few hundred ms past.
      if (audio.currentTime * 1000 > gateMs) audio.currentTime = gateMs / 1000
      setCurrentMs(gateMs)
    }
  }, [blocked, currentMs, gateMs])

  /* ---------- controls ---------- */

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    // Replay from the top if they hit play on a finished slide.
    if (durationMs && audio.currentTime * 1000 >= durationMs - 60) audio.currentTime = 0
    if (blocked && audio.currentTime * 1000 >= gateMs) return
    void audio.play().catch(() => setPlaying(false))
  }, [blocked, gateMs, durationMs])

  const pause = useCallback(() => audioRef.current?.pause(), [])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) play()
    else pause()
  }, [play, pause])

  const seek = useCallback(
    (ms: number) => {
      const audio = audioRef.current
      if (!audio) return
      // Never let the scrubber jump past an unsatisfied gate.
      const capped = blocked ? Math.min(ms, gateMs) : ms
      const clamped = Math.max(0, Math.min(capped, durationMs))
      audio.currentTime = clamped / 1000
      setCurrentMs(clamped)
    },
    [blocked, gateMs, durationMs],
  )

  const replay = useCallback(() => {
    seek(0)
    play()
  }, [seek, play])

  const setVolume = useCallback((v: number) => {
    setVol(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (audioRef.current) audioRef.current.muted = !m
      return !m
    })
  }, [])

  /* ---------- derived ---------- */

  const lineIndex = useMemo(() => {
    if (!timing) return 0
    for (let i = timing.lines.length - 1; i >= 0; i--) {
      if (currentMs >= timing.lines[i].startMs) return i
    }
    return 0
  }, [timing, currentMs])

  const wordIndex = useMemo(() => {
    if (!timing) return -1
    const w = timing.words
    let lo = 0
    let hi = w.length - 1
    let found = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (w[mid].ms <= currentMs) {
        found = mid
        lo = mid + 1
      } else hi = mid - 1
    }
    return found
  }, [timing, currentMs])

  const atGate = blocked && currentMs >= gateMs - 20

  return {
    currentMs,
    durationMs,
    playing,
    ready,
    lineIndex,
    wordIndex,
    atGate,
    play,
    pause,
    toggle,
    seek,
    replay,
    setVolume,
    volume,
    muted,
    toggleMute,
  }
}
