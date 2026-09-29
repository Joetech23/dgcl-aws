import { IconArrowRight } from './icons'

export const UKPRN = '10101893'
export const UKRLP_URL = 'https://ukrlp.education.gov.uk/'

/**
 * Registered-provider proof. Short on purpose: the badge says what it is,
 * the number is checkable, and the link lets anyone verify it themselves.
 */
export function TrustBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <a
        href={UKRLP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[12.5px] text-ink/70 transition hover:border-blue/40"
      >
        <Crest className="h-6 w-6" />
        UK registered training provider · UKPRN {UKPRN}
      </a>
    )
  }
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
      <Crest className="h-14 w-14 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[16px] font-extrabold text-ink">Officially registered UK training provider</p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink/60">
          Listed on the UK Register of Learning Providers (UKRLP), the government register used by employers, funders and learners to check a provider is real.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
        <span className="rounded-xl bg-slate px-3 py-2 font-mono text-[13px] font-medium text-ink">UKPRN {UKPRN}</span>
        <a href={UKRLP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-display text-[13px] font-bold text-blue hover:underline">
          Verify on UKRLP <IconArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

/** A simple shield with a tick, drawn rather than copying any government mark. */
function Crest({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden className={`grid place-items-center rounded-full bg-blue text-white ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
  )
}
