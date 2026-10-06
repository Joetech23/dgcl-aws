'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  PREVIEW_CODE_HINT,
  resendSignupCode,
  resetPasswordWithCode,
  sendLoginCode,
  sendResetCode,
  signIn,
  signInWithGoogle,
  signUp,
  useAccount,
  verifyLoginCode,
  verifySignupCode,
  type AuthResult,
} from '@/lib/backend'
import { getReferral } from '@/lib/backend/referral'
import { PartnerSelect } from './PartnerSelect'
import { Field } from './AuthShell'
import { CodeInput } from './CodeInput'
import { buttonClass } from './ui'
import { IconArrowLeft, IconGoogle } from './icons'

/** Only follow `next` to our own pages, never to another site. */
function safeNext(raw: string | null) {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard/'
}

/**
 * Sign-up and log-in, with one-time codes.
 *
 * Steps: the form; then, when an email is involved, a 6-digit code. Codes are
 * used for confirming a new account, for logging in without a password, and
 * for resetting a forgotten password.
 */
type Step =
  | { kind: 'form' }
  | { kind: 'email'; purpose: 'login' | 'reset' }
  | { kind: 'code'; purpose: 'signup' | 'login' | 'reset'; email: string }

export function AuthForm({ mode }: { mode: 'signup' | 'login' }) {
  const router = useRouter()
  const params = useSearchParams()
  const { mode: backend } = useAccount()
  const next = safeNext(params.get('next'))
  const signup = mode === 'signup'
  const [step, setStep] = useState<Step>({ kind: 'form' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(params.get('error') === 'link' ? 'That link has expired. Please log in again.' : null)
  const [notice, setNotice] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [refCode, setRefCode] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const saved = getReferral()
    if (saved) setRefCode(saved)
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const go = (s: Step) => {
    setStep(s)
    setError(null)
    setNotice(null)
    setCode('')
  }

  async function run(fn: () => Promise<AuthResult>, onOk: () => void) {
    setBusy(true)
    setError(null)
    const res = await fn()
    setBusy(false)
    if (res.ok === false) setError(res.error)
    else onOk()
  }

  /* ---------- the form ---------- */

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
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
    const res = signup ? await signUp({ name: String(f.get('name') ?? ''), email, password, referralCode: refCode }) : await signIn({ email, password })
    setBusy(false)
    if (res.ok === true) router.push(next)
    else if (res.ok === 'confirm') {
      go({ kind: 'code', purpose: 'signup', email: res.email })
      setCooldown(60)
    } else if (!signup && /confirm your email/i.test(res.error)) {
      // Signed up but never confirmed: send a fresh code and ask for it.
      await resendSignupCode(email)
      go({ kind: 'code', purpose: 'signup', email })
      setCooldown(60)
    } else setError(res.error)
  }

  async function google() {
    setBusy(true)
    const res = await signInWithGoogle(next)
    if (res.ok === true && backend === 'preview') router.push(next)
    else if (res.ok === false) {
      setError(res.error)
      setBusy(false)
    }
  }

  /* ---------- the code step ---------- */

  async function checkCode(value: string, password?: string) {
    if (step.kind !== 'code') return
    const email = step.email
    const fn =
      step.purpose === 'signup'
        ? () => verifySignupCode(email, value)
        : step.purpose === 'login'
          ? () => verifyLoginCode(email, value)
          : () => resetPasswordWithCode(email, value, password ?? '')
    await run(fn, () => router.push(next))
  }

  async function resend() {
    if (step.kind !== 'code' || cooldown > 0) return
    const email = step.email
    const fn = step.purpose === 'signup' ? () => resendSignupCode(email) : step.purpose === 'login' ? () => sendLoginCode(email) : () => sendResetCode(email)
    await run(fn, () => {
      setNotice('A new code is on its way.')
      setCooldown(60)
      setCode('')
    })
  }

  const errorBox = error ? (
    <p role="alert" className="rounded-xl bg-rose/10 px-3.5 py-2.5 text-[14px] text-rose">
      {error}
    </p>
  ) : null

  if (step.kind === 'code') {
    const reset = step.purpose === 'reset'
    return (
      <div>
        <BackButton onClick={() => go({ kind: 'form' })} />
        <h1 className="mt-4 font-display text-[28px] font-extrabold leading-tight tracking-[-0.025em] text-ink">{reset ? 'Choose a new password' : 'Check your email'}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
          We sent a 6-digit code to <strong className="font-semibold text-ink">{step.email}</strong>. It expires in one hour.
        </p>
        {backend === 'preview' ? <p className="mt-3 rounded-xl bg-gold/15 px-3.5 py-2.5 text-[13px] font-semibold text-[#7A5A00] dark:text-gold">{PREVIEW_CODE_HINT}</p> : null}
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const pw = reset ? String(new FormData(e.currentTarget).get('password') ?? '') : undefined
            void checkCode(code, pw)
          }}
        >
          <CodeInput value={code} onChange={setCode} onComplete={reset ? undefined : (v) => void checkCode(v)} disabled={busy} />
          {reset ? <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." /> : null}
          {errorBox}
          {notice ? <p className="text-[14px] font-semibold text-mint">{notice}</p> : null}
          <button type="submit" disabled={busy || code.length < 6} className={buttonClass('primary', 'lg', 'w-full')}>
            {busy ? 'Checking…' : reset ? 'Save new password' : 'Continue'}
          </button>
        </form>
        <p className="mt-5 text-center text-[14px] text-ink/60">
          No email? Check your spam folder, or{' '}
          <button type="button" onClick={resend} disabled={cooldown > 0 || busy} className="font-display font-bold text-blue hover:underline disabled:cursor-not-allowed disabled:text-ink/40 disabled:no-underline">
            {cooldown > 0 ? `send a new code in ${cooldown}s` : 'send a new code'}
          </button>
        </p>
      </div>
    )
  }

  if (step.kind === 'email') {
    const reset = step.purpose === 'reset'
    return (
      <div>
        <BackButton onClick={() => go({ kind: 'form' })} />
        <h1 className="mt-4 font-display text-[28px] font-extrabold leading-tight tracking-[-0.025em] text-ink">{reset ? 'Reset your password' : 'Log in with a code'}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
          {reset ? 'Enter your email and we will send you a code to choose a new password.' : 'Enter your email and we will send you a 6-digit code. No password needed.'}
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const email = String(new FormData(e.currentTarget).get('email') ?? '')
            void run(reset ? () => sendResetCode(email) : () => sendLoginCode(email), () => {
              go({ kind: 'code', purpose: step.purpose, email: email.trim().toLowerCase() })
              setCooldown(60)
            })
          }}
        >
          <Field label="Email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" inputMode="email" />
          {errorBox}
          <button type="submit" disabled={busy} className={buttonClass('primary', 'lg', 'w-full')}>
            {busy ? 'Sending…' : 'Send me a code'}
          </button>
        </form>
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

      <form onSubmit={submitForm} className="space-y-4">
        {signup ? <Field label="Your name" name="name" autoComplete="name" required placeholder="John Smith" /> : null}
        <Field label="Email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" inputMode="email" />
        <div>
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={signup ? 'new-password' : 'current-password'}
            required
            minLength={8}
            hint={signup ? 'At least 8 characters. We will email you a code to confirm your address.' : undefined}
          />
          {!signup ? (
            <button type="button" onClick={() => go({ kind: 'email', purpose: 'reset' })} className="mt-2 text-[13.5px] font-semibold text-blue hover:underline">
              Forgot password?
            </button>
          ) : null}
        </div>
        {signup ? <PartnerSelect id="signup-partner" value={refCode} onChange={setRefCode} /> : null}
        {errorBox}
        <button type="submit" disabled={busy} className={buttonClass('primary', 'lg', 'w-full')}>
          {busy ? 'One moment…' : signup ? 'Create free account' : 'Log in'}
        </button>
        {!signup ? (
          <button type="button" onClick={() => go({ kind: 'email', purpose: 'login' })} className={buttonClass('secondary', 'lg', 'w-full')}>
            Email me a code instead
          </button>
        ) : null}
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

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="-ml-1 inline-flex h-10 items-center gap-1.5 rounded-lg px-1 font-display text-[14px] font-bold text-ink/60 hover:text-ink">
      <IconArrowLeft size={18} /> Back
    </button>
  )
}
