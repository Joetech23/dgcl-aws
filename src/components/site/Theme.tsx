'use client'

import { useEffect, useState } from 'react'

const KEY = 'dgcl-theme'

/**
 * Runs before the page paints, so a dark-mode visitor never sees a white
 * flash. Light is the default; dark only when the visitor has chosen it.
 */
export function ThemeScript() {
  const js = `try{if(localStorage.getItem('${KEY}')==='dark')document.documentElement.classList.add('dark')}catch(e){}`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), [])

  const flip = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(KEY, next ? 'dark' : 'light')
    } catch {
      /* the choice just will not be remembered */
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink/75 transition hover:text-ink ${className}`}
    >
      {/* Sun and moon swap with a small turn, so the change feels physical. */}
      <svg
        width="19"
        height="19"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden
        className={`absolute transition duration-300 ${dark ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      >
        <path d="M16.5 12.2A6.8 6.8 0 0 1 7.8 3.5a6.8 6.8 0 1 0 8.7 8.7Z" />
      </svg>
      <svg
        width="19"
        height="19"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden
        className={`absolute text-gold transition duration-300 ${dark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'}`}
      >
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2v1.8M10 16.2V18M2 10h1.8M16.2 10H18M4.3 4.3l1.3 1.3M14.4 14.4l1.3 1.3M4.3 15.7l1.3-1.3M14.4 5.6l1.3-1.3" />
      </svg>
    </button>
  )
}
