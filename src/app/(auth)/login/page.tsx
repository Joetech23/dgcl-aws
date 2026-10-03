import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/site/AuthShell'
import { AuthForm } from '@/components/site/AuthForm'

export const metadata: Metadata = { title: 'Log in' }

export default function Page() {
  return (
    <AuthShell>
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  )
}
