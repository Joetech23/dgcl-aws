'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount } from '@/lib/backend'
import { ButtonLink, Container, Logo } from './ui'
import { IconClose, IconMenu } from './icons'
import { ThemeToggle } from './Theme'

const NAV = [
  { href: '/course/', label: 'AWS course' },
  { href: '/plans/', label: 'Ways to learn' },
  { href: '/plans/#instructor-led', label: 'Instructor-led' },
  { href: '/#courses', label: 'All courses' },
  { href: '/#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const { user } = useAccount()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 print:hidden bg-surface/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_rgb(var(--line)),0_8px_24px_-18px_rgba(0,0,102,0.35)]' : ''
      }`}
    >
      <Container className="flex h-16 items-center gap-6 lg:h-[72px]">
        <Link href="/" aria-label="DGCL Digital Cloud Academy, home" className="shrink-0">
          <Logo className="h-9 w-auto lg:h-10" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 font-display text-[14px] font-semibold text-ink/70 transition hover:bg-slate hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <ButtonLink href="/dashboard/" size="sm">
              My dashboard
            </ButtonLink>
          ) : (
            <>
              <Link href="/login/" className="rounded-lg px-3 py-2 font-display text-[14px] font-semibold text-ink/75 hover:text-ink">
                Log in
              </Link>
              <ButtonLink href="/signup/" size="sm">
                Start free
              </ButtonLink>
            </>
          )}
        </div>

        <ThemeToggle className="ml-auto md:hidden" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl text-ink md:hidden"
        >
          <IconMenu size={22} />
        </button>
      </Container>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="anim-fade absolute inset-0 bg-black/50" />
          <div className="anim-rise absolute inset-x-0 top-0 rounded-b-3xl bg-surface px-4 pb-6 pt-3 shadow-stage">
            <div className="flex h-12 items-center">
              <Logo className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="ml-auto grid h-11 w-11 place-items-center rounded-xl text-ink"
              >
                <IconClose size={22} />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-3 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/70 py-4 font-display text-[18px] font-bold text-ink"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 grid gap-2">
              {user ? (
                <ButtonLink href="/dashboard/" size="lg" onClick={() => setOpen(false)}>
                  My dashboard
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/signup/" size="lg" onClick={() => setOpen(false)}>
                    Start free
                  </ButtonLink>
                  <ButtonLink href="/login/" size="lg" variant="secondary" onClick={() => setOpen(false)}>
                    Log in
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
