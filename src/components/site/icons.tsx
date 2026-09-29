/**
 * Line icons, drawn on a 20px grid with a 1.7 stroke so they sit with the
 * Raleway body text. Hand-drawn here rather than pulled from an icon pack, to
 * keep the bundle small and the look consistent.
 */
type P = { className?: string; size?: number }

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const IconArrowRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 10h12M11 5l5 5-5 5" /></svg>
)
export const IconArrowLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M16 10H4M9 5l-5 5 5 5" /></svg>
)
export const IconPlay = ({ className, size }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M6 3.8v12.4a.8.8 0 0 0 1.22.68l9.9-6.2a.8.8 0 0 0 0-1.36l-9.9-6.2A.8.8 0 0 0 6 3.8Z" /></svg>
)
export const IconLock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="4" y="9" width="12" height="8.5" rx="2" /><path d="M7 9V6.5a3 3 0 0 1 6 0V9" /></svg>
)
export const IconCheck = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>
)
export const IconClock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="10" cy="10" r="7" /><path d="M10 6v4l2.5 2" /></svg>
)
export const IconHome = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3.5 9 10 3.5 16.5 9v7a1 1 0 0 1-1 1H12v-4.5H8V17H4.5a1 1 0 0 1-1-1V9Z" /></svg>
)
export const IconBook = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3.5 4.5h4.5A2 2 0 0 1 10 6.5v10a1.5 1.5 0 0 0-1.5-1.5h-5V4.5ZM16.5 4.5H12a2 2 0 0 0-2 2v10a1.5 1.5 0 0 1 1.5-1.5h5V4.5Z" /></svg>
)
export const IconVideo = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="2.5" y="5" width="11" height="10" rx="2" /><path d="m13.5 9 4-2.5v7l-4-2.5" /></svg>
)
export const IconUser = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="10" cy="7" r="3.2" /><path d="M3.8 17a6.2 6.2 0 0 1 12.4 0" /></svg>
)
export const IconFlame = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M10 17.5c3 0 5-2 5-5 0-3.5-3-5-3.5-9-2 1.5-3.5 3.5-3.5 6-1-.5-1.5-1.5-1.5-2.5C5 8.5 5 10.5 5 12.5c0 3 2 5 5 5Z" /></svg>
)
export const IconStar = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="m10 3 2.1 4.4 4.9.6-3.6 3.3.9 4.8L10 13.8 5.7 16.1l.9-4.8L3 8l4.9-.6L10 3Z" /></svg>
)
export const IconAward = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="10" cy="8" r="5" /><path d="m7 12.3-1.5 5.2L10 15.5l4.5 2-1.5-5.2" /></svg>
)
export const IconCalendar = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="4.5" width="14" height="12.5" rx="2" /><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" /></svg>
)
export const IconMenu = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3.5 6h13M3.5 10h13M3.5 14h13" /></svg>
)
export const IconClose = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 5l10 10M15 5 5 15" /></svg>
)
export const IconChevron = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="m6 8 4 4 4-4" /></svg>
)
export const IconSparkle = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M5 5l2 2M13 13l2 2M15 5l-2 2M7 13l-2 2" /></svg>
)
export const IconHand = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M7 10V4.5a1.3 1.3 0 0 1 2.6 0V9M9.6 9V3.5a1.3 1.3 0 0 1 2.6 0V9M12.2 9V5a1.3 1.3 0 0 1 2.6 0v6.5c0 3.3-2.2 5.5-5.3 5.5-2.2 0-3.5-1-4.6-2.6L3 11.3a1.3 1.3 0 0 1 2-1.6l2 1.8" /></svg>
)
export const IconPhone = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="5.5" y="2.5" width="9" height="15" rx="2" /><path d="M9 14.5h2" /></svg>
)
export const IconLogout = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M12 6.5 15.5 10 12 13.5M15.5 10H8" /></svg>
)
export const IconGoogle = ({ className, size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9Z" />
  </svg>
)
