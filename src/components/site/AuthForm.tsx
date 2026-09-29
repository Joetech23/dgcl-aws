'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn, signInWithGoogle, signUp } from '@/lib/backend'
import { getReferral, normaliseCode } from '@/lib/backend/referral'
import { Field } from './AuthShell'
import { buttonClass } from './ui'
import { IconCheck, IconGoogle } from './icons'

/** Only follow `next` to our own pages, never to another site. */
function safeNext(raw: string | null) {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard/'
}

export function AuthForm({ mode }: { mode: 'signup' | 'login' }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(params.get('error') === 'link' ? 'That sign-in link has expired. Please try again.' : null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const signup = mode === 'signup'

  useEffect(() => {
    const saved = getReferral()
    if (saved) {
      setCode(saved)
      setShowCode(true)
    }
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') ?? '')
    const password = String(f.get('password') ?? '')
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    setBusy(true)
    setError(null)
    const res = signup ? await signUp({ name: String(f.get('name') ?? ''), email, password, referralCode: code }) : await signIn({ email, password })
    if (res.ok === true) router.push(next)
    else if (res.ok === 'confirm') {
      setConfirm(res.email)
      setBusy(false)
    } else {
      setError(res.error)
      setBusy(false)
    }
  }

  async function google() {
    setBusy(true)
    const res = await signInWithGoogle(next)
    if (res.ok === true && !process.env.NEXT_PUBLIC_SUPABASE_URL) router.push(next)
    else if (res.ok === false) {
      setError(res.error)
      setBusy(false)
    }
  }

  if (confirm) {
    return (
      <div className="text-center">
        <span className="anim-pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-white">
          <IconCheck size={30} />
        </span>
        <h1 className="mt-5 font-display text-[26px] font-extrabold text-ink">Check your email</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
          We sent a link to <strong className="text-ink">{confirm}</strong>. Open it on this device to finish creating your account.
        </p>
      </div>
    )
  }

  const other = `${signup ? '/login/' : '/signup/'}${next !== '/dashboard/' ? `?next=${encodeURIComponent(next)}` : ''}`

  return (
    <div>
      <h1 className="font-display text-[30px] font-extrabold leading-tight tracking-[-0.025em] text-ink">{signup ? 'Create your free account' : 'Welcome back'}</h1>
      <p className="mt-2 text-[15px] text-ink/60">{signup ? 'Start the Introduction in under a minute. No card needed.' : 'Log in to pick up where you left off.'}</p>

      <button type="button" onClick={google} disabled={busy} className={buttonClass('secondary', 'lg', 'mt-8 w-full')}>
        <IconGoogle />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-[12.5px] text-ink/40">
        <span className="h-px flex-1 bg-line" />
        or with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {signup ? <Field label="Your name" name="name" autoComplete="name" required placeholder="Ada Okafor" /> : null}
        <Field label="Email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" inputMode="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={signup ? 'new-password' : 'current-password'}
          required
          minLength={8}
          hint={signup ? 'At least 8 characters.' : undefined}
        />
        {signup ? (
          showCode ? (
            <Field label="Partner code (optional)" name="code" value={code} onChange={(e) => setCode(normaliseCode(e.target.value))} placeholder="e.g. TECHHUB10" autoComplete="off" />
          ) : (
            <button type="button" onClick={() => setShowCode(true)} className="text-[13.5px] font-semibold text-blue hover:underline">
              Have a partner code?
            </button>
          )
        ) : null}
        {error ? (
          <p role="alert" className="rounded-xl bg-rose/10 px-3.5 py-2.5 text-[14px] text-rose">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className={buttonClass('primary', 'lg', 'w-full')}>
          {busy ? 'One moment…' : signup ? 'Create free account' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-[14.5px] text-ink/60">
        {signup ? 'Already have an account?' : 'New to DGCL?'}{' '}
        <Link href={other} className="font-display font-bold text-blue hover:underline">
          {signup ? 'Log in' : 'Create a free account'}
        </Link>
      </p>
      {signup ? <p className="mt-6 text-center text-[12.5px] leading-relaxed text-ink/45">By creating an account you agree to DGCL&apos;s terms and privacy policy.</p> : null}
    </div>
  )
}
