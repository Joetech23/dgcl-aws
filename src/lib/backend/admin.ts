'use client'

import { catalog } from '@/config/catalog'
import type { TrackId } from '@/config/tracks'
import { getProgressStore } from '@/lib/progress'
import { SUPABASE_ON, sb } from './supabase'
import { read, write, refresh, type Certificate, type User } from './index'
import { normaliseCode } from './referral'

/**
 * Everything the admin panel reads and writes.
 *
 * With Supabase, row level security lets only admins run these. In preview
 * mode the panel shows a set of sample learners (marked as such) alongside
 * the real account on this browser, so the screens can be judged before any
 * learner has signed up.
 */

export type StudentRow = {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  role: 'student' | 'admin'
  track: TrackId | null
  joinedAt: string
  lastActive: string | null
  referralCode: string | null
  lessonsDone: number
  progress: number
  modulesDone: number
  /** Slugs of the modules this learner has finished. */
  finished: string[]
  streak: number
  certificate: string | null
  sample?: boolean
}

export type LeadStatus = 'new' | 'contacted' | 'joined' | 'closed'
export type LeadRow = {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  track: string | null
  course: string | null
  message: string | null
  referralCode: string | null
  status: LeadStatus
  notes: string | null
  createdAt: string
  sample?: boolean
}

export type PartnerRow = {
  id: string
  name: string
  email: string | null
  code: string
  reward: string | null
  active: boolean
  createdAt: string
}

export type AdminData = {
  students: StudentRow[]
  leads: LeadRow[]
  partners: PartnerRow[]
  certificates: (Certificate & { userId: string })[]
  preview: boolean
}

const built = catalog.filter((m) => m.lesson)
const TOTAL_LESSONS = built.reduce((n, m) => n + m.lesson!.slides.length, 0)

function progressOf(completed: string[]) {
  const set = new Set(completed)
  const lessonsDone = built.reduce((n, m) => n + m.lesson!.slides.filter((s) => set.has(s.id)).length, 0)
  const finished = built.filter((m) => m.lesson!.slides.every((s) => set.has(s.id))).map((m) => m.slug)
  return { lessonsDone, modulesDone: finished.filter((slug) => slug !== 'intro').length, finished, progress: TOTAL_LESSONS ? lessonsDone / TOTAL_LESSONS : 0 }
}

/* ---------------- loading ---------------- */

export async function loadAdmin(): Promise<AdminData> {
  if (SUPABASE_ON) {
    const c = sb()
    const [profiles, progress, leads, partners, certs] = await Promise.all([
      c.from('profiles').select('*').order('created_at', { ascending: false }),
      c.from('progress').select('*'),
      c.from('leads').select('*').order('created_at', { ascending: false }),
      c.from('partners').select('*').order('created_at', { ascending: false }),
      c.from('certificates').select('*').order('issued_at', { ascending: false }),
    ])
    const err = profiles.error ?? leads.error ?? partners.error
    if (err) throw new Error(err.message)
    const byUser = new Map((progress.data ?? []).map((p) => [p.user_id as string, p]))
    const certBy = new Map((certs.data ?? []).map((x) => [x.user_id as string, x.code as string]))
    return {
      preview: false,
      students: (profiles.data ?? []).map((p) => {
        const pr = byUser.get(p.id)
        return {
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          country: p.country,
          role: p.role,
          track: p.track,
          joinedAt: p.created_at,
          lastActive: pr?.updated_at ?? null,
          referralCode: p.referral_code,
          streak: pr?.streak_days ?? 0,
          certificate: certBy.get(p.id) ?? null,
          ...progressOf((pr?.completed as string[]) ?? []),
        }
      }),
      leads: (leads.data ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        country: l.country,
        track: l.track,
        course: l.course,
        message: l.message,
        referralCode: l.referral_code,
        status: l.status,
        notes: l.notes,
        createdAt: l.created_at,
      })),
      partners: (partners.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        code: p.code,
        reward: p.reward,
        active: p.active,
        createdAt: p.created_at,
      })),
      certificates: (certs.data ?? []).map((x) => ({ code: x.code, name: x.name, course: x.course, issuedAt: x.issued_at, userId: x.user_id })),
    }
  }
  return loadPreview()
}

/* ---------------- actions ---------------- */

export async function setTrack(userId: string, track: TrackId | null) {
  if (SUPABASE_ON) {
    const { error } = await sb().from('profiles').update({ track }).eq('id', userId)
    if (error) throw new Error(error.message)
  } else {
    const me = read<User>('dgcl-user')
    if (me?.id === userId) write('dgcl-enrollment', track ? { track, since: new Date().toISOString() } : null)
    else patchSample('dgcl-sample-tracks', userId, track)
  }
  await refresh()
}

export async function updateLead(id: string, patch: { status?: LeadStatus; notes?: string }) {
  if (SUPABASE_ON) {
    const { error } = await sb().from('leads').update(patch).eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  const leads = read<Record<string, unknown>[]>('dgcl-leads') ?? []
  if (leads.some((l) => l.id === id)) write('dgcl-leads', leads.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  else patchSample('dgcl-sample-leads', id, patch)
}

export function suggestCode(name: string) {
  const base = normaliseCode(name.split(/\s+/)[0] ?? 'DGCL').slice(0, 8) || 'DGCL'
  return `${base}${Math.floor(10 + Math.random() * 90)}`
}

export async function createPartner(input: { name: string; email: string; code: string; reward: string }) {
  const row = { name: input.name.trim(), email: input.email.trim() || null, code: normaliseCode(input.code), reward: input.reward.trim() || null }
  if (!row.name || !row.code) throw new Error('A partner needs a name and a code.')
  if (SUPABASE_ON) {
    const { error } = await sb().from('partners').insert(row)
    if (error) throw new Error(/duplicate/i.test(error.message) ? 'That code is already taken.' : error.message)
    return
  }
  const partners = read<PartnerRow[]>('dgcl-partners') ?? []
  if (partners.some((p) => p.code === row.code)) throw new Error('That code is already taken.')
  write('dgcl-partners', [{ id: `p_${Date.now()}`, active: true, createdAt: new Date().toISOString(), ...row }, ...partners])
}

export async function setPartnerActive(id: string, active: boolean) {
  if (SUPABASE_ON) {
    const { error } = await sb().from('partners').update({ active }).eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  const partners = read<PartnerRow[]>('dgcl-partners') ?? []
  write('dgcl-partners', partners.map((p) => (p.id === id ? { ...p, active } : p)))
}

function newCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return `DGCL-AWS-${Array.from({ length: 6 }, () => abc[Math.floor(Math.random() * abc.length)]).join('')}`
}

export async function issueCertificate(student: { id: string; name: string }, course = 'AWS Cloud Training CO2/CO3') {
  const code = newCode()
  if (SUPABASE_ON) {
    const { error } = await sb().from('certificates').insert({ code, user_id: student.id, name: student.name, course })
    if (error) throw new Error(error.message)
  } else {
    const certs = read<unknown[]>('dgcl-certs') ?? []
    write('dgcl-certs', [{ code, name: student.name, course, issuedAt: new Date().toISOString(), userId: student.id }, ...certs])
  }
  await refresh()
  return code
}

/* ---------------- preview data ---------------- */

function patchSample(key: string, id: string, value: unknown) {
  const map = read<Record<string, unknown>>(key) ?? {}
  map[id] = value
  write(key, map)
}

const FIRST = ['Ada', 'Tunde', 'Grace', 'Chidi', 'Amara', 'Kwame', 'Fatima', 'James', 'Priya', 'Sophie', 'Emeka', 'Zainab', 'Oliver', 'Ngozi', 'Samuel', 'Aisha', 'Daniel', 'Blessing', 'Liam', 'Esther', 'Musa', 'Hannah', 'Yusuf', 'Chloe']
const LAST = ['Okafor', 'Adeyemi', 'Mensah', 'Eze', 'Bello', 'Owusu', 'Khan', 'Smith', 'Patel', 'Brown', 'Nwosu', 'Ibrahim', 'Taylor', 'Obi', 'Asante', 'Yusuf', 'Wilson', 'Okon', 'Walker', 'Danjuma', 'Abubakar', 'Evans', 'Ali', 'Green']
const COUNTRIES = ['United Kingdom', 'Nigeria', 'Nigeria', 'Ghana', 'United Kingdom', 'Kenya', 'Ireland', 'Nigeria', 'India', 'United Kingdom', 'Canada', 'South Africa']

function sampleStudents(): StudentRow[] {
  const all = built.flatMap((m) => m.lesson!.slides.map((s) => s.id))
  const tracks = read<Record<string, TrackId | null>>('dgcl-sample-tracks') ?? {}
  return FIRST.map((f, i) => {
    const done = all.slice(0, Math.round(((i * 37) % 100) / 100 * all.length))
    const id = `sample-${i + 1}`
    const baseTrack: TrackId | null = i % 5 === 0 ? 'instructor-led' : i % 4 === 0 ? 'self-paced' : null
    return {
      id,
      name: `${f} ${LAST[i]}`,
      email: `${f.toLowerCase()}.${LAST[i].toLowerCase()}@example.com`,
      phone: null,
      country: COUNTRIES[i % COUNTRIES.length],
      role: 'student' as const,
      track: id in tracks ? tracks[id] : baseTrack,
      joinedAt: new Date(Date.now() - (i * 2 + 1) * 864e5).toISOString(),
      lastActive: new Date(Date.now() - ((i * 7) % 20) * 36e5).toISOString(),
      referralCode: i % 3 === 0 ? 'TECHHUB10' : i % 7 === 0 ? 'CAREERUK' : null,
      streak: (i * 3) % 9,
      certificate: null,
      sample: true,
      ...progressOf(done),
    }
  })
}

function sampleLeads(): LeadRow[] {
  const patches = read<Record<string, Partial<LeadRow>>>('dgcl-sample-leads') ?? {}
  const courses = ['AWS Cloud Training', 'DevOps Tools Training', 'Cybersecurity and Ethical Hacking', 'Healthcare Data Analysis, AI and ML']
  const statuses: LeadStatus[] = ['new', 'new', 'contacted', 'joined', 'new', 'closed', 'contacted']
  return FIRST.slice(0, 12).map((f, i) => {
    const id = `sample-lead-${i + 1}`
    return {
      id,
      name: `${f} ${LAST[(i + 5) % LAST.length]}`,
      email: `${f.toLowerCase()}${i}@example.com`,
      phone: `+44 7700 9000${String(i).padStart(2, '0')}`,
      country: COUNTRIES[(i + 3) % COUNTRIES.length],
      track: i % 2 ? 'instructor-led' : 'self-paced',
      course: courses[i % courses.length],
      message: null,
      referralCode: i % 3 === 0 ? 'TECHHUB10' : null,
      status: statuses[i % statuses.length],
      notes: null,
      createdAt: new Date(Date.now() - i * 5 * 36e5).toISOString(),
      sample: true,
      ...patches[id],
    }
  })
}

function loadPreview(): AdminData {
  const me = read<User>('dgcl-user')
  const enrol = read<{ track: TrackId }>('dgcl-enrollment')
  const certs = read<(Certificate & { userId: string })[]>('dgcl-certs') ?? []
  const students = sampleStudents()
  if (me) {
    const p = getProgressStore().load()
    const streak = read<{ days: number }>('dgcl-streak')
    students.unshift({
      id: me.id,
      name: me.name,
      email: me.email,
      phone: me.phone ?? null,
      country: me.country ?? null,
      role: me.role ?? 'student',
      track: enrol?.track ?? null,
      joinedAt: me.createdAt,
      lastActive: new Date().toISOString(),
      referralCode: me.referralCode ?? null,
      streak: streak?.days ?? 0,
      certificate: certs.find((c) => c.userId === me.id)?.code ?? null,
      ...progressOf(p.completed),
    })
  }
  const local = (read<Record<string, unknown>[]>('dgcl-leads') ?? []).map((l) => ({
    id: String(l.id),
    name: String(l.name),
    email: String(l.email),
    phone: (l.phone as string) ?? null,
    country: (l.country as string) ?? null,
    track: (l.track as string) ?? null,
    course: (l.course as string) ?? null,
    message: (l.message as string) ?? null,
    referralCode: (l.referral_code as string) ?? null,
    status: (l.status as LeadStatus) ?? 'new',
    notes: (l.notes as string) ?? null,
    createdAt: String(l.created_at),
  }))
  const partners = read<PartnerRow[]>('dgcl-partners') ?? []
  const withSamples = partners.some((p) => p.code === 'TECHHUB10')
    ? partners
    : [
        ...partners,
        { id: 'sample-p1', name: 'TechHub Lagos (sample)', email: 'partners@example.com', code: 'TECHHUB10', reward: '£50 per learner who joins', active: true, createdAt: new Date(Date.now() - 20 * 864e5).toISOString() },
        { id: 'sample-p2', name: 'CareerUK (sample)', email: null, code: 'CAREERUK', reward: '10% of first payment', active: true, createdAt: new Date(Date.now() - 9 * 864e5).toISOString() },
      ]
  return { preview: true, students, leads: [...local, ...sampleLeads()], partners: withSamples, certificates: certs }
}
