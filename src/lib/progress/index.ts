'use client'

export type CourseProgress = {
  /** Screen ids the learner has completed. */
  completed: string[]
  /** Where they left off, for resume. */
  bookmark: string | null
  /** 0-100, set by the checkpoint quiz. */
  score: number | null
  /** From screen 01's path choice — lightly personalises later copy. */
  track: 'it' | 'non-it' | null
}

export const EMPTY: CourseProgress = { completed: [], bookmark: null, score: null, track: null }

export interface ProgressStore {
  readonly mode: 'lms' | 'local'
  load(): CourseProgress
  save(p: CourseProgress): void
  /** Called at the end of the course. */
  finish(p: CourseProgress): void
}

const KEY = 'dgcl-aws-section-01'

class LocalProgressStore implements ProgressStore {
  readonly mode = 'local' as const

  load(): CourseProgress {
    // Private windows and blocked-site-data settings throw on access, so the
    // whole thing goes in a try/catch and degrades to a fresh run.
    try {
      const raw = window.localStorage.getItem(KEY)
      return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
    } catch {
      return EMPTY
    }
  }

  save(p: CourseProgress): void {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(p))
    } catch {
      /* nothing we can do, and nothing the learner needs to know */
    }
  }

  finish(p: CourseProgress): void {
    this.save(p)
  }
}

/* ---------- SCORM 1.2 ---------- */

type ScormAPI = {
  LMSInitialize(s: string): string
  LMSFinish(s: string): string
  LMSGetValue(k: string): string
  LMSSetValue(k: string, v: string): string
  LMSCommit(s: string): string
}

/** SCORM 1.2 puts the API on an opener or an ancestor frame, not on window. */
function findAPI(win: Window | null, depth = 0): ScormAPI | null {
  if (!win || depth > 20) return null
  try {
    const candidate = (win as unknown as { API?: ScormAPI }).API
    if (candidate) return candidate
    if (win.opener) {
      const fromOpener = findAPI(win.opener as Window, depth + 1)
      if (fromOpener) return fromOpener
    }
    return win.parent && win.parent !== win ? findAPI(win.parent, depth + 1) : null
  } catch {
    // Cross-origin ancestor: stop climbing rather than throwing.
    return null
  }
}

class ScormProgressStore implements ProgressStore {
  readonly mode = 'lms' as const

  constructor(private api: ScormAPI) {
    this.api.LMSInitialize('')
    if (this.api.LMSGetValue('cmi.core.lesson_status') === 'not attempted') {
      this.api.LMSSetValue('cmi.core.lesson_status', 'incomplete')
    }
    this.api.LMSCommit('')
    window.addEventListener('beforeunload', () => {
      try {
        this.api.LMSCommit('')
        this.api.LMSFinish('')
      } catch {
        /* the LMS is going away anyway */
      }
    })
  }

  load(): CourseProgress {
    try {
      const raw = this.api.LMSGetValue('cmi.suspend_data')
      return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
    } catch {
      return EMPTY
    }
  }

  save(p: CourseProgress): void {
    try {
      this.api.LMSSetValue('cmi.suspend_data', JSON.stringify(p))
      if (p.bookmark) this.api.LMSSetValue('cmi.core.lesson_location', p.bookmark)
      this.api.LMSCommit('')
    } catch {
      /* keep the lesson running even if the LMS rejects a write */
    }
  }

  finish(p: CourseProgress): void {
    try {
      this.api.LMSSetValue('cmi.suspend_data', JSON.stringify(p))
      if (p.score !== null) {
        this.api.LMSSetValue('cmi.core.score.raw', String(p.score))
        this.api.LMSSetValue('cmi.core.score.min', '0')
        this.api.LMSSetValue('cmi.core.score.max', '100')
      }
      this.api.LMSSetValue('cmi.core.lesson_status', 'completed')
      this.api.LMSCommit('')
    } catch {
      /* as above */
    }
  }
}

let store: ProgressStore | null = null

/** Picks the LMS backend when running inside one, localStorage otherwise. */
export function getProgressStore(): ProgressStore {
  if (store) return store
  const api = typeof window !== 'undefined' ? findAPI(window) : null
  store = api ? new ScormProgressStore(api) : new LocalProgressStore()
  return store
}
