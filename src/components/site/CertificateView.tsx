'use client'

import { useEffect, useState } from 'react'
import { verifyCertificate, SAMPLE_CERTIFICATE, type Certificate as Cert } from '@/lib/backend'
import { Certificate, formatCertDate } from './Certificate'
import { Container, buttonClass } from './ui'
import { IconCheck, IconClose } from './icons'
import { UKPRN } from './TrustBadge'

/**
 * The verify page. Shows the certificate with a clear verified or not-found
 * banner, and a print button that produces a clean landscape PDF.
 */
export function CertificateView({ code }: { code: string }) {
  const [cert, setCert] = useState<Cert | null | undefined>(undefined)
  const [host, setHost] = useState('dgcl.academy')

  useEffect(() => {
    setHost(window.location.host)
    void verifyCertificate(code).then(setCert)
  }, [code])

  const sample = cert?.code === SAMPLE_CERTIFICATE.code

  return (
    <Container className="py-10 lg:py-14">
      {cert === undefined ? (
        <div className="mx-auto aspect-[16/9] max-w-[960px] animate-pulse rounded-xl bg-slate" aria-busy="true" />
      ) : cert ? (
        <>
          <div className="mx-auto flex max-w-[960px] flex-col gap-4 print:hidden sm:flex-row sm:items-center">
            <div className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 ${sample ? 'bg-gold/15' : 'bg-mint/10'}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${sample ? 'bg-gold' : 'bg-mint'}`}>
                <IconCheck size={18} />
              </span>
              <p className="text-[14px] leading-snug text-ink/80">
                {sample ? (
                  <>
                    <strong className="font-semibold text-ink">Sample certificate.</strong> Real certificates show the learner&apos;s name and their own ID.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-ink">Verified.</strong> Issued to {cert.name} by DGCL Digital Cloud Academy (UKPRN {UKPRN}) on {formatCertDate(cert.issuedAt)}.
                  </>
                )}
              </p>
            </div>
            <button type="button" onClick={() => window.print()} className={buttonClass('primary', 'md')}>
              Download PDF
            </button>
          </div>
          <div className="cert-print mx-auto mt-6 max-w-[960px] overflow-hidden rounded-xl shadow-stage ring-1 ring-line print:mt-0 print:max-w-none print:rounded-none print:shadow-none print:ring-0">
            <Certificate name={cert.name} course={cert.course} date={formatCertDate(sample ? new Date().toISOString() : cert.issuedAt)} code={cert.code} verifyHost={host} />
          </div>
          <p className="mx-auto mt-4 max-w-[960px] text-center text-[12.5px] text-ink/45 print:hidden">Tip: choose landscape and turn off headers and footers in the print dialog.</p>
        </>
      ) : (
        <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose/10 text-rose">
            <IconClose size={24} />
          </span>
          <h1 className="mt-4 font-display text-[22px] font-extrabold text-ink">No certificate with that ID</h1>
          <p className="mt-2 text-[15px] text-ink/60">
            Check the ID <span className="font-mono text-ink">{code}</span> was typed exactly as printed. If it still does not match, contact info@dgclgroup.com.
          </p>
        </div>
      )}
    </Container>
  )
}
