'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker (public/sw.js) so the site can be installed
 * as an app. Production only: in development it would cache files that
 * change on every save.
 */
export function Pwa() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    const register = () => void navigator.serviceWorker.register('/sw.js').catch(() => {})
    if (document.readyState === 'complete') register()
    else {
      window.addEventListener('load', register, { once: true })
      return () => window.removeEventListener('load', register)
    }
  }, [])
  return null
}
