'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { signOut, useAccount, type Account } from '@/lib/backend'
import { findTrack } from '@/config/tracks'
import { Logo } from '@/components/site/ui'
import { ThemeToggle } from '@/components/site/Theme'
import { EnquireButton } from '@/components/site/Enquiry'
import { Tour, startTour } from './Tour'
import { IconAward, IconBook, IconFlame, IconHome, IconLogout, IconSparkle, IconUser, IconVideo } from '@/components/site/icons'

const NAV = [
  { href: '/dashboard/', label: 'Home', icon: IconHome, tour: 'nav-home' },
  { href: '/learn/', label: 'Self-paced', icon: IconBook, tour: 'nav-self' },
  { href: '/classes/', label: 'Instructor-led', icon: IconVideo, tour: 'nav-live' },
  { href: '/account/', label: 'Account', icon: IconUser, tour: 'nav-account' },
]

/** Sends signed-out visitors to log in, then back here. */
export function useRequireUser(): Account {
  const account = useAccount()
  const router = useRouter()
  const path = usePathname()
  useEffect(() => {
    if (account.ready && !account.user) router.replace(`/login/?next=${encodeURIComponent(path)}`)
  }, [account.ready, account.user, router, path])
  return account
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

export function Avatar({ name, className = 'h-10 w-10 text-[14px]' }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-gold font-display font-extrabold text-blue-deep ${className}`}>
      {initials(name) || 'D'}
    </span>
  )
}

export function StreakPill({ days }: { days: number }) {
  // No streak yet: say nothing rather than show a discouraging zero.
  if (days < 1) return null
  return (
    <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#FFF4E5] px-3.5 font-display text-[13.5px] font-bold text-[#B45309] dark:bg-[#3A2410] dark:text-[#FDBA74]">
      <IconFlame size={17} className="text-ember" />
      {days} {days === 1 ? 'day' : 'days'}
    </span>
  )
}

/**
 * The signed-in frame. Desktop: a sidebar. Phone: a bottom tab bar, which is
 * where thumbs are, and nothing else fixed on screen.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const account = useRequireUser()
  const path = usePathname()
  const router = useRouter()
  const [menu, setMenu] = useState(false)

  if (!account.ready || !account.user) {
    return <div className="min-h-[100dvh] bg-slate" aria-busy="true" />
  }
  const track = findTrack(account.enrollment?.track)
  const active = (href: string) => path.startsWith(href)
  const isAdminPage = path.startsWith('/admin')

  return (
    <div className="min-h-[100dvh] bg-slate lg:flex">
      {/* ---------- desktop sidebar ---------- */}
      <aside className="sticky top-0 hidden h-[100dvh] w-[248px] shrink-0 flex-col border-r border-line bg-surface px-4 pb-5 pt-6 lg:flex">
        <Link href="/" aria-label="DGCL home" className="px-2">
          <Logo className="h-10 w-auto" />
        </Link>
        <p className="mt-8 px-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">Learn</p>
        <nav aria-label="App" className="mt-2 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon, tour }) => (
            <Link
              key={href}
              href={href}
              data-tour={tour}
              aria-current={active(href) ? 'page' : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 font-display text-[14px] font-semibold transition ${
                active(href) ? 'bg-blue/[0.08] text-blue' : 'text-ink/65 hover:bg-slate hover:text-ink'
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          ))}
        </nav>

        {account.isAdmin ? (
          <>
            <p className="mt-6 px-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">DGCL team</p>
            <Link
              href="/admin/"
              className={`mt-2 flex h-11 items-center gap-3 rounded-xl px-3 font-display text-[14px] font-semibold transition ${
                isAdminPage ? 'bg-blue/[0.08] text-blue' : 'text-ink/65 hover:bg-slate hover:text-ink'
              }`}
            >
              <IconSparkle size={19} />
              Admin panel
            </Link>
          </>
        ) : null}

        <div className="mt-auto" data-tour="plan-card">
          {track ? (
            <div className="rounded-2xl border border-line p-4">
              <IconAward size={22} className="text-blue" />
              <p className="mt-2 font-display text-[14px] font-bold text-ink">{track.name} programme</p>
              <p className="mt-0.5 text-[12.5px] text-ink/55">All 14 modules open</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-blue-deep p-4 text-white">
              <p className="font-display text-[14px] font-bold">Open Modules 5 to 14</p>
              <p className="mt-1 text-[12.5px] leading-snug text-white/65">Self-paced lessons or live classes with an instructor.</p>
              <EnquireButton className="mt-3 inline-flex h-9 items-center rounded-lg bg-gold px-3 font-display text-[13px] font-bold text-blue-deep">
                Talk to our team
              </EnquireButton>
            </div>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-[84px] lg:pb-0">
        {/* ---------- top bar ---------- */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur lg:border-0 lg:bg-slate/90">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:h-[76px] lg:px-8">
            <Link href="/dashboard/" className="lg:hidden" aria-label="Dashboard">
              <Logo className="h-9 w-auto" />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:block">
                <StreakPill days={account.streak} />
              </div>
              <span data-tour="theme">
                <ThemeToggle />
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenu((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={menu}
                  className="flex items-center gap-2.5 rounded-full p-0.5 lg:bg-surface lg:py-1 lg:pl-1 lg:pr-4 lg:shadow-[0_1px_0_rgb(var(--line))]"
                >
                  <Avatar name={account.user.name} />
                  <span className="hidden text-left lg:block">
                    <span className="block font-display text-[13.5px] font-bold capitalize leading-tight text-ink">{account.user.name}</span>
                    <span className="block text-[12px] leading-tight text-ink/50">{track ? `${track.name} programme` : 'Free modules'}</span>
                  </span>
                </button>
                {menu ? (
                  <>
                    <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(false)} />
                    <div className="anim-rise absolute right-0 top-[calc(100%+8px)] z-20 w-60 rounded-2xl border border-line bg-surface p-2 shadow-lift">
                      <p className="truncate px-3 py-2 text-[13px] text-ink/55">{account.user.email}</p>
                      <Link href="/account/" onClick={() => setMenu(false)} className="flex h-11 items-center gap-2.5 rounded-xl px-3 text-[14px] font-semibold text-ink hover:bg-slate">
                        <IconUser size={18} /> Account
                      </Link>
                      {account.isAdmin ? (
                        <Link href="/admin/" onClick={() => setMenu(false)} className="flex h-11 items-center gap-2.5 rounded-xl px-3 text-[14px] font-semibold text-ink hover:bg-slate">
                          <IconSparkle size={18} /> Admin panel
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setMenu(false)
                          if (!path.startsWith('/dashboard')) router.push('/dashboard/?tour=1')
                          else startTour()
                        }}
                        className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[14px] font-semibold text-ink hover:bg-slate"
                      >
                        <IconBook size={18} /> Show me around
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut()
                          router.push('/')
                        }}
                        className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[14px] font-semibold text-ink hover:bg-slate"
                      >
                        <IconLogout size={18} /> Log out
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          {account.mode === 'preview' ? <PreviewNotice /> : null}
        </header>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-2">{children}</main>
      </div>

      {/* ---------- phone tab bar ---------- */}
      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {NAV.map(({ href, label, icon: Icon, tour }) => (
          <Link
            key={href}
            href={href}
            data-tour={tour}
            aria-current={active(href) ? 'page' : undefined}
            className={`flex h-[64px] flex-col items-center justify-center gap-1 font-display text-[11px] font-bold ${active(href) ? 'text-blue' : 'text-ink/45'}`}
          >
            <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active(href) ? 'bg-blue/[0.1]' : ''}`}>
              <Icon size={20} />
            </span>
            {label}
          </Link>
        ))}
      </nav>

      <Tour />
    </div>
  )
}

/** Only in preview mode (no Supabase keys yet): data lives in this browser. */
function PreviewNotice() {
  return (
    <p className="hidden border-t border-line/60 bg-gold/10 px-8 py-1.5 text-center text-[12px] font-semibold text-[#7A5A00] dark:text-gold lg:block">
      Preview mode: accounts and progress are saved in this browser until Supabase is connected.
    </p>
  )
}
