import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

/**
 * Supabase from the server.
 *
 * Two clients:
 * - `asUser(token)` acts as the signed-in learner, so the database's own
 *   row level security still decides what they can see.
 * - `admin()` uses the service role key, which bypasses those rules. It is
 *   used for one thing only: recording a payment Stripe has confirmed.
 *
 * SUPABASE_SERVICE_ROLE_KEY is a server environment variable (cPanel > Setup
 * Node.js App). It must never be given a NEXT_PUBLIC name or sent to a browser.
 */

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** False on the preview/test build, where accounts live in the browser. */
export const supabaseOnServer = () => process.env.NEXT_PUBLIC_BACKEND !== 'preview' && Boolean(SUPA_URL && ANON)

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }

export function admin(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!SUPA_URL || !key) return null
  return createClient(SUPA_URL, key, options)
}

export function asUser(token: string): SupabaseClient {
  return createClient(SUPA_URL!, ANON!, { ...options, global: { headers: { Authorization: `Bearer ${token}` } } })
}

export function bearer(req: NextRequest | Request): string | null {
  const h = req.headers.get('authorization') ?? ''
  const token = h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : ''
  return token || null
}

/** The signed-in learner behind a request, checked with Supabase. */
export async function userFromRequest(req: NextRequest | Request): Promise<{ id: string; email: string | null; token: string } | null> {
  const token = bearer(req)
  if (!token || !supabaseOnServer()) return null
  const { data, error } = await asUser(token).auth.getUser(token)
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null, token }
}

/** The public address this request came in on, for links back to the site. */
export function siteOrigin(req: NextRequest | Request): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost'
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)
  return `${local ? 'http' : 'https'}://${host}`
}

/** True when a browser request comes from another website. */
export function crossSite(req: NextRequest | Request): boolean {
  const origin = req.headers.get('origin')
  const self = req.headers.get('x-forwarded-host') || req.headers.get('host')
  if (!origin || !self) return false
  try {
    return new URL(origin).host !== self
  } catch {
    return true
  }
}
