import type { Metadata } from 'next'
import { CertificateView } from '@/components/site/CertificateView'

export const metadata: Metadata = { title: 'Verify a certificate | DGCL Digital Cloud Academy' }

/** Public: anyone with a certificate's ID can check it here. */
export default function VerifyPage({ params }: { params: { code: string } }) {
  return <CertificateView code={decodeURIComponent(params.code)} />
}
