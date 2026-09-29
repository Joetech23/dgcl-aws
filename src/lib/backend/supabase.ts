'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase is switched on by two public environment variables. Without them
 * the site runs on the browser mock, so it can be previewed and tested with
 * no backend at all.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const SUPABASE_ON = Boolean(URL && KEY)

let client: SupabaseClient | null = null

export function sb(): SupabaseClient {
  if (!SUPABASE_ON) throw new Error('Supabase is not configured')
  if (!client) client = createBrowserClient(URL!, KEY!)
  return client
}
