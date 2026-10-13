import type { Metadata } from 'next'
import { BookingStatus } from '@/components/site/BookingStatus'

export const metadata: Metadata = { title: 'Your consultation', robots: { index: false } }

/** Where Stripe sends a learner back after the consultation fee (paid or not). */
export default function BookingPage() {
  return <BookingStatus />
}
