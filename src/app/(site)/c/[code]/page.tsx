import type { Metadata } from 'next'
import { CertificateView } from '@/components/site/CertificateView'

export const metadata: Metadata = { title: 'Verify a certificate' }

/** Public: anyone with a certificate's ID can check it here. */
export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <CertificateView code={decodeURIComponent(code)} />
}
