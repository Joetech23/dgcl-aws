'use client'

import { useEffect, useState } from 'react'
import type { TrackId } from '@/config/tracks'
import { getProgressStore, type CourseProgress, EMPTY } from '@/lib/progress'
import { SUPABASE_ON, sb } from './supabase'
import { getReferral, normaliseCode } from './referral'

/**
 * Accounts, progress, enquiries and certificates.
 *
 * Two backends behind one set of functions:
 * - Supabase, when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   are set (see supabase/migrations/0001_lms.sql for the tables).
 * - A browser-only mock otherwise, so every screen works in a preview with no
 *   backend. The mock never stores a password; any password signs you in.
 *
 * Lesson progress is always written to the browser first (the player stays
 * instant and works offline), then copied to Supabase in the background.
 */

export type Role = 'student' | 'admin'
export type User = {
  id: string
  name: string
  email: string
  createdAt: string
  role: Role
  phone?: string | null
  country?: string | null
  referralCode?: string | null
}
/** A learner's programme, set by DGCL once they join. Opens Modules 5 to 14. */
export type Enrollment = { track: TrackId; since: string }
export type Certificate = { code: string; name: string; course: string; issuedAt: string }
export type Streak = { days: number; lastDay: string }

export type LeadInput = {
  name: string
  email: string
  phone: string
  country: string
  track: string
  course: string
  message?: string
  referralCode?: string
}

export const MOCK_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? 'admin@dgclgroup.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

const K = {
  user: 'dgcl-user',
  enrol: 'dgcl-enrollment',
  streak: 'dgcl-streak',
  leads: 'dgcl-leads',
  certs: 'dgcl-certs',
}
const EVENT = 'dgcl-account-change'

export function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private window: nothing persists, and that is all right */
  }
}

const today = () => new Date().toISOString().slice(0, 10)
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10)
const announce = () => window.dispatchEvent(new Event(EVENT))

/* ================= auth ================= */

export type AuthResult = { ok: true } | { ok: false; error: string } | { ok: 'confirm'; email: string }

function friendly(message: string) {
  // Keep the raw reason in the console for whoever is debugging.
  console.error('[auth]', message)
  if (/invalid login/i.test(message)) return 'That email and password do not match.'
  if (/already registered|already exists/i.test(message)) return 'You already have an account with this email. Log in, or use Continue with Google.'
  if (/email not confirmed/i.test(message)) return 'Please confirm your email first: open the link we sent you.'
  if (/sending (confirmation|magic link)|confirmation email|not authorized/i.test(message))
    return 'We could not send your confirmation email just now. Please try Continue with Google, or try again later.'
  if (/rate limit|too many/i.test(message)) return 'Too many attempts in a short time. Please wait a few minutes and try again.'
  if (/database error/i.test(message)) return 'We could not create your account. Please contact info@dgclgroup.com.'
  if (/password/i.test(message)) return message
  // Unknown: show Supabase's own words rather than hide them.
  return `Sign-up failed: ${message}`
}

export async function signUp(input: { name: string; email: string; password: string; referralCode?: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase()
  const referral = normaliseCode(input.referralCode ?? getReferral())
  if (SUPABASE_ON) {
    const { data, error } = await sb().auth.signUp({
      email,
      password: input.password,
      options: {
        data: { name: input.name.trim(), referral_code: referral || null },
        emailRedirectTo: `${window.location.origin}/auth/callback/?next=/dashboard/`,
      },
    })
    if (error) return { ok: false, error: friendly(error.message) }
    await refresh()
    return data.session ? { ok: true } : { ok: 'confirm', email }
  }
  const user: User = {
    id: `u_${Math.random().toString(36).slice(2, 10)}`,
    name: input.name.trim(),
    email,
    createdAt: new Date().toISOString(),
    role: MOCK_ADMIN_EMAILS.includes(email) ? 'admin' : 'student',
    referralCode: referral || null,
  }
  write(K.user, user)
  await refresh()
  return { ok: true }
}

export async function signIn(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase()
  if (SUPABASE_ON) {
    const { error } = await sb().auth.signInWithPassword({ email, password: input.password })
    if (error) return { ok: false, error: friendly(error.message) }
    await refresh()
    return { ok: true }
  }
  const existing = read<User>(K.user)
  if (!existing || existing.email !== email) {
    return signUp({ name: email.split('@')[0].replace(/[._]/g, ' '), email, password: input.password })
  }
  await refresh()
  return { ok: true }
}

export async function signInWithGoogle(next: string): Promise<AuthResult> {
  if (SUPABASE_ON) {
    const { error } = await sb().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback/?next=${encodeURIComponent(next)}` },
    })
    return error ? { ok: false, error: friendly(error.message) } : { ok: true }
  }
  return signUp({ name: 'Google learner', email: 'learner@gmail.com', password: 'google-oauth' })
}

export async function signOut() {
  if (SUPABASE_ON) await sb().auth.signOut()
  write(K.user, null)
  write(K.enrol, null)
  // The next learner on this device starts clean.
  getProgressStore().save(EMPTY)
  await refresh()
}

export async function updateProfile(patch: { name?: string; phone?: string; country?: string }) {
  const s = state
  if (!s.user) return
  if (SUPABASE_ON) {
    await sb().from('profiles').update(patch).eq('id', s.user.id)
  } else {
    write(K.user, { ...s.user, ...patch })
  }
  await refresh()
}

/* ================= enquiries ================= */

export async function saveLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const row = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    country: input.country,
    track: input.track,
    course: input.course,
    message: input.message?.trim() || null,
    referral_code: normaliseCode(input.referralCode ?? '') || null,
    user_id: state.user?.id ?? null,
  }
  if (SUPABASE_ON) {
    const { error } = await sb().from('leads').insert(row)
    return error ? { ok: false, error: 'We could not send that. Please try again.' } : { ok: true }
  }
  const leads = read<unknown[]>(K.leads) ?? []
  write(K.leads, [{ id: `l_${Date.now()}`, status: 'new', notes: null, created_at: new Date().toISOString(), ...row }, ...leads])
  return { ok: true }
}

export async function partnerForCode(code: string): Promise<string | null> {
  const clean = normaliseCode(code)
  if (!clean) return null
  if (SUPABASE_ON) {
    const { data } = await sb().rpc('partner_for_code', { p_code: clean })
    return (data as { name: string }[] | null)?.[0]?.name ?? null
  }
  const partners = read<{ code: string; name: string; active: boolean }[]>('dgcl-partners') ?? []
  return partners.find((p) => p.code === clean && p.active)?.name ?? null
}

/* ================= certificates ================= */

export async function verifyCertificate(code: string): Promise<Certificate | null> {
  const clean = code.trim().toUpperCase()
  if (SUPABASE_ON) {
    const { data } = await sb().rpc('verify_certificate', { p_code: clean })
    const row = (data as { code: string; name: string; course: string; issued_at: string }[] | null)?.[0]
    return row ? { code: row.code, name: row.name, course: row.course, issuedAt: row.issued_at } : null
  }
  if (clean === SAMPLE_CERTIFICATE.code) return SAMPLE_CERTIFICATE
  return (read<Certificate[]>(K.certs) ?? []).find((c) => c.code === clean) ?? null
}

export const SAMPLE_CERTIFICATE: Certificate = {
  code: 'DGCL-AWS-SAMPLE',
  name: 'Your Name',
  course: 'AWS Cloud Training CO2/CO3',
  issuedAt: '2026-09-29T00:00:00Z',
}

/* ================= progress ================= */

export function touchStreak() {
  const s = read<Streak>(K.streak)
  const d = today()
  if (s?.lastDay === d) return
  write(K.streak, { days: s?.lastDay === yesterday() ? s.days + 1 : 1, lastDay: d })
}

let pushTimer: ReturnType<typeof setTimeout> | null = null

/** Call after the learner finishes something. Updates the streak and syncs. */
export function notifyProgress() {
  touchStreak()
  announce()
  if (!SUPABASE_ON || !state.user) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void pushProgress(), 1200)
}

async function pushProgress() {
  const u = state.user
  if (!u) return
  const p = getProgressStore().load()
  const s = read<Streak>(K.streak)
  await sb()
    .from('progress')
    .upsert({
      user_id: u.id,
      completed: p.completed,
      bookmark: p.bookmark,
      streak_days: s?.days ?? 0,
      last_day: s?.lastDay ?? null,
      updated_at: new Date().toISOString(),
    })
}

/* ================= account state ================= */

export type Account = {
  ready: boolean
  user: User | null
  enrollment: Enrollment | null
  progress: CourseProgress
  completed: Set<string>
  streak: number
  /** 10 per lesson finished. */
  points: number
  certificates: Certificate[]
  isAdmin: boolean
  mode: 'supabase' | 'preview'
}

const BLANK: Account = {
  ready: false,
  user: null,
  enrollment: null,
  progress: EMPTY,
  completed: new Set(),
  streak: 0,
  points: 0,
  certificates: [],
  isAdmin: false,
  mode: SUPABASE_ON ? 'supabase' : 'preview',
}

let state: Account = BLANK
const listeners = new Set<(a: Account) => void>()
let loading: Promise<void> | null = null

function derive(user: User | null, enrollment: Enrollment | null, certificates: Certificate[]): Account {
  const progress = getProgressStore().load() ?? EMPTY
  const s = read<Streak>(K.streak)
  const alive = s && (s.lastDay === today() || s.lastDay === yesterday())
  return {
    ready: true,
    user,
    enrollment,
    progress,
    completed: new Set(progress.completed),
    streak: alive ? s.days : 0,
    points: progress.completed.length * 10,
    certificates,
    isAdmin: user?.role === 'admin',
    mode: SUPABASE_ON ? 'supabase' : 'preview',
  }
}

async function load(): Promise<Account> {
  if (!SUPABASE_ON) {
    const user = read<User>(K.user)
    const e = read<Enrollment>(K.enrol)
    const certs = (read<(Certificate & { userId: string })[]>(K.certs) ?? []).filter((c) => c.userId === user?.id)
    return derive(user ? { ...user, role: user.role ?? 'student' } : null, user ? e : null, certs)
  }

  const client = sb()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) return derive(null, null, [])

  const [{ data: profile }, { data: remote }, { data: certs }] = await Promise.all([
    client.from('profiles').select('*').eq('id', auth.user.id).maybeSingle(),
    client.from('progress').select('*').eq('user_id', auth.user.id).maybeSingle(),
    client.from('certificates').select('*').eq('user_id', auth.user.id),
  ])

  // Merge: the union of lessons done here and lessons done on other devices.
  const store = getProgressStore()
  const local = store.load()
  const merged = Array.from(new Set([...(local.completed ?? []), ...((remote?.completed as string[]) ?? [])]))
  if (merged.length !== local.completed.length) store.save({ ...local, completed: merged, bookmark: local.bookmark ?? remote?.bookmark ?? null })
  const s = read<Streak>(K.streak)
  if (remote?.last_day && (!s || remote.last_day > s.lastDay)) write(K.streak, { days: remote.streak_days, lastDay: remote.last_day })

  const user: User = {
    id: auth.user.id,
    email: profile?.email ?? auth.user.email ?? '',
    name: profile?.name || auth.user.user_metadata?.name || (auth.user.email ?? '').split('@')[0],
    createdAt: profile?.created_at ?? auth.user.created_at,
    role: (profile?.role as Role) ?? 'student',
    phone: profile?.phone,
    country: profile?.country,
    referralCode: profile?.referral_code,
  }
  const enrollment = profile?.track ? { track: profile.track as TrackId, since: profile.track_set_at ?? profile.created_at } : null
  const certificates = ((certs as { code: string; name: string; course: string; issued_at: string }[]) ?? []).map((c) => ({
    code: c.code,
    name: c.name,
    course: c.course,
    issuedAt: c.issued_at,
  }))
  const account = derive(user, enrollment, certificates)
  if (merged.length > ((remote?.completed as string[]) ?? []).length) void pushProgress()
  return account
}

export async function refresh() {
  if (!loading) {
    loading = load()
      .then((a) => {
        state = a
        listeners.forEach((l) => l(a))
      })
      .finally(() => {
        loading = null
      })
  }
  return loading
}

/** Re-derive from local data only (fast path after a lesson finishes). */
function recompute() {
  state = derive(state.user, state.enrollment, state.certificates)
  listeners.forEach((l) => l(state))
}

let wired = false
function wire() {
  if (wired || typeof window === 'undefined') return
  wired = true
  window.addEventListener(EVENT, recompute)
  window.addEventListener('storage', () => void refresh())
  if (SUPABASE_ON) sb().auth.onAuthStateChange(() => void refresh())
  void refresh()
}

export function useAccount(): Account {
  const [a, setA] = useState<Account>(state)
  useEffect(() => {
    wire()
    listeners.add(setA)
    setA(state)
    return () => {
      listeners.delete(setA)
    }
  }, [])
  return a
}
