import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/site/AuthShell'
import { AuthForm } from '@/components/site/AuthForm'

export const metadata: Metadata = { title: 'Create your free account | DGCL Digital Cloud Academy' }

export default function Page() {
  return (
    <AuthShell>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  )
}
