'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut, updateProfile, useAccount } from '@/lib/backend'
import { findTrack } from '@/config/tracks'
import { Avatar } from '@/components/app/AppShell'
import { EnquireButton } from '@/components/site/Enquiry'
import { buttonClass } from '@/components/site/ui'
import { formatCertDate } from '@/components/site/Certificate'
import { IconAward, IconCheck } from '@/components/site/icons'

export default function AccountPage() {
  const { user, enrollment, points, streak, certificates } = useAccount()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  if (!user) return null
  const track = findTrack(enrollment?.track)

  return (
    <div className="mx-auto max-w-[720px] space-y-5">
      <h1 className="font-display text-[clamp(1.6rem,3.2vw,2.1rem)] font-extrabold tracking-[-0.025em] text-ink">Account</h1>

      <section className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} className="h-14 w-14 text-[18px]" />
          <div className="min-w-0">
            <p className="font-display text-[17px] font-extrabold capitalize text-ink">{user.name}</p>
            <p className="truncate text-[14px] text-ink/55">{user.email}</p>
          </div>
        </div>
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            await updateProfile({ name: String(f.get('name')), phone: String(f.get('phone')), country: String(f.get('country')) })
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
          }}
        >
          <Field label="Name" name="name" defaultValue={user.name} />
          <Field label="Phone" name="phone" type="tel" defaultValue={user.phone ?? ''} placeholder="+44 7700 900000" />
          <Field label="Country" name="country" defaultValue={user.country ?? ''} placeholder="United Kingdom" />
          <div className="flex items-end">
            <button type="submit" className={buttonClass('secondary', 'md', 'w-full')}>
              {saved ? (
                <>
                  <IconCheck size={16} className="text-mint" /> Saved
                </>
              ) : (
                'Save details'
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:p-6">
        <h2 className="font-display text-[16px] font-extrabold text-ink">Programme</h2>
        {track && enrollment ? (
          <p className="mt-2 text-[14.5px] text-ink/70">
            <strong className="font-semibold text-ink">{track.name}</strong>, since{' '}
            {new Date(enrollment.since).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. All 14 modules are open.
          </p>
        ) : (
          <>
            <p className="mt-2 text-[14.5px] text-ink/70">Free: the Introduction and Modules 1 to 4.</p>
            <EnquireButton className={buttonClass('primary', 'sm', 'mt-4')}>Talk to our team about the full course</EnquireButton>
          </>
        )}
        {user.referralCode ? <p className="mt-3 text-[13px] text-ink/50">Joined with partner code {user.referralCode}.</p> : null}
      </section>

      {certificates.length ? (
        <section className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))] sm:p-6">
          <h2 className="font-display text-[16px] font-extrabold text-ink">Certificates</h2>
          <ul className="mt-3 space-y-2">
            {certificates.map((c) => (
              <li key={c.code}>
                <Link href={`/c/${c.code}/`} className="flex items-center gap-3 rounded-xl border border-line p-3 hover:border-blue/40">
                  <IconAward size={22} className="text-gold" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[14px] font-bold text-ink">{c.course}</span>
                    <span className="block text-[12.5px] text-ink/50">
                      {formatCertDate(c.issuedAt)} · {c.code}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))]">
          <p className="text-[13px] text-ink/55">Points</p>
          <p className="font-display text-[26px] font-extrabold text-ink">{points}</p>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))]">
          <p className="text-[13px] text-ink/55">Streak</p>
          <p className="font-display text-[26px] font-extrabold text-ink">
            {streak} {streak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={async () => {
          await signOut()
          router.push('/')
        }}
        className={buttonClass('secondary', 'lg', 'w-full')}
      >
        Log out
      </button>
    </div>
  )
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="font-display text-[13px] font-bold text-ink">{label}</span>
      <input
        {...props}
        className="mt-1.5 block h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </label>
  )
}
