import Link from 'next/link'
import Image from 'next/image'
import type { ComponentProps, ReactNode } from 'react'

/**
 * The site's small set of primitives.
 *
 * One primary button style (DGCL blue), one secondary (outlined), one quiet
 * text link. Gold is kept for progress, highlights and the "Most popular"
 * mark, so it always means "this matters" rather than decoration.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'md' | 'lg' | 'sm'

const variants: Record<Variant, string> = {
  primary: 'bg-blue text-white hover:bg-blue-electric active:bg-blue-deep shadow-[0_8px_20px_-10px_rgba(0,0,153,0.7)]',
  secondary: 'border border-line bg-surface text-blue-deep hover:border-blue/40 hover:bg-slate dark:text-ink',
  ghost: 'text-blue-deep hover:bg-slate dark:text-ink',
  gold: 'bg-gold text-blue-deep hover:brightness-105 shadow-[0_8px_20px_-10px_rgba(180,130,0,0.8)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-[14px] gap-2',
  lg: 'h-[52px] px-6 text-[15px] gap-2.5',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `inline-flex shrink-0 items-center justify-center rounded-xl font-display font-bold tracking-[-0.01em] transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`
}

export function ButtonLink({
  variant,
  size,
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-display text-[12px] font-bold uppercase tracking-[0.14em] text-blue-electric ${className}`}>
      {children}
    </p>
  )
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink ${className}`}>
      {children}
    </h2>
  )
}

export function Logo({ className = 'h-9 w-auto', invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Image
      src="/brand/dgcl-logo.png"
      alt="DGCL Digital Cloud Academy"
      width={1639}
      height={959}
      priority
      // The logo's navy lettering vanishes on the dark theme, so it goes white there.
      className={`${className} ${invert ? '' : 'dark:brightness-0 dark:invert'}`}
      style={invert ? { filter: 'brightness(0) invert(1)' } : undefined}
    />
  )
}

/**
 * The header mark. It shows the DGCL logo, a light passes across it, and it
 * becomes the FreeTechPath wordmark; then back again. Both sit in one box so
 * nothing around it moves. Pure CSS (see `.brand-*` in globals.css); with
 * reduced motion it rests on the FreeTechPath wordmark.
 */
export function Brand({ className = 'h-9' }: { className?: string }) {
  return (
    <span className="brand-swap">
      <span className={`brand-face brand-dgcl ${className}`}>
        <Logo className="h-full w-auto" />
        <span aria-hidden className="brand-glint" />
      </span>
      <span aria-hidden className={`brand-face brand-ftp ${className}`}>
        <svg viewBox="0 0 100 100" className="h-[80%] w-auto shrink-0">
          <rect width="100" height="100" rx="22" fill="#0000BC" />
          <path d="M22 72 L42 54 L58 62 L78 32" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="72" r="7" fill="#7DB8FF" />
          <circle cx="78" cy="32" r="10" fill="#FFC000" />
        </svg>
        <span className="ml-2 flex flex-col justify-center whitespace-nowrap leading-none">
          <span className="brand-word font-display text-[17px] font-extrabold tracking-[-0.02em]">FreeTechPath</span>
          <span className="mt-[3px] text-[9.5px] font-semibold text-ink/55">by DGCL Digital Cloud Academy</span>
        </span>
      </span>
    </span>
  )
}

export function Pill({ children, tone = 'blue', className = '' }: { children: ReactNode; tone?: 'blue' | 'gold' | 'mint' | 'grey'; className?: string }) {
  const tones = {
    blue: 'bg-blue/[0.07] text-blue',
    gold: 'bg-gold/20 text-[#7A5A00]',
    mint: 'bg-mint/10 text-[#077A55]',
    grey: 'bg-slate text-ink/60',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-[11.5px] font-bold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

/** Thin progress bar. Gold fill, the one place gold always appears. */
export function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-line/70 ${className}`} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  )
}
