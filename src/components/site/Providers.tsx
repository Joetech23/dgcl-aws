'use client'

import { useEffect, type ReactNode } from 'react'
import { captureReferral } from '@/lib/backend/referral'
import { EnquiryProvider } from './Enquiry'

/** Wraps every site, app and lesson page (never the SCORM package). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    captureReferral()
  }, [])
  return <EnquiryProvider>{children}</EnquiryProvider>
}
