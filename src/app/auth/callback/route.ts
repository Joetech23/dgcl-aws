import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

/**
 * Where Supabase sends people back after Google sign-in or an email
 * confirmation link. Swaps the one-time code for a session cookie, then
 * continues to `next` (only ever a path on this site).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const raw = url.searchParams.get('next') ?? '/dashboard/'
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard/'

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!code || !supaUrl || !supaKey) return NextResponse.redirect(new URL('/login/', url.origin))

  const store = cookies()
  const supabase = createServerClient(supaUrl, supaKey, {
    cookies: {
      get: (name: string) => store.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => store.set({ name, value, ...options }),
      remove: (name: string, options: CookieOptions) => store.set({ name, value: '', ...options }),
    },
  })
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  return NextResponse.redirect(new URL(error ? '/login/?error=link' : next, url.origin))
}
