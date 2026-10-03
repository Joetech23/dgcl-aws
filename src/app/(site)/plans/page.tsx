import type { Metadata } from 'next'
import { TrackCards } from '@/components/site/TrackCards'
import { Faq } from '@/components/site/Faq'
import { TrustBadge } from '@/components/site/TrustBadge'
import { Container, Eyebrow } from '@/components/site/ui'
import { IconCheck, IconLock } from '@/components/site/icons'

export const metadata: Metadata = { title: 'Ways to learn: self-paced or instructor-led', alternates: { canonical: '/plans/' } }

const ROWS: [string, boolean, boolean, boolean][] = [
  ['Introduction and Modules 1 to 4', true, true, true],
  ['Modules 5 to 14, animated and narrated', false, true, true],
  ['Quizzes and activities', true, true, true],
  ['DGCL certificate with verify link', false, true, true],
  ['Cloud Practitioner practice exams', false, true, true],
  ['Live classes with an instructor', false, false, true],
  ['Hands-on labs and recordings', false, false, true],
  ['Mentor Q&A and career session', false, false, true],
]

export default function PlansPage() {
  return (
    <>
      <section className="bg-slate/70 pb-16 pt-12 lg:pb-24 lg:pt-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Ways to learn</Eyebrow>
            <h1 className="mt-2 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">Choose how you learn</h1>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink/60">
              The Introduction and Modules 1 to 4 are free for everyone. For the rest, pick a way to learn and leave your details: a DGCL adviser will call you with the price for your country.
            </p>
          </div>
          <div className="mt-14">
            <TrackCards />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">Compare what is included</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left text-[13.5px] sm:text-[14px]">
              <thead className="bg-slate/70 font-display text-[13px] font-bold text-ink">
                <tr>
                  <th className="px-3 py-3.5 font-bold sm:px-4">What you get</th>
                  <th className="w-[58px] px-1 py-3.5 text-center sm:w-auto sm:px-3">Free</th>
                  <th className="w-[64px] px-1 py-3.5 text-center sm:w-auto sm:px-3">
                    <span className="sm:hidden">Self</span>
                    <span className="hidden sm:inline">Self-paced</span>
                  </th>
                  <th className="w-[64px] px-1 py-3.5 text-center text-blue sm:w-auto sm:px-3">
                    <span className="sm:hidden">Live</span>
                    <span className="hidden sm:inline">Instructor-led</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map(([label, ...cells]) => (
                  <tr key={label}>
                    <td className="px-3 py-3.5 text-ink/80 sm:px-4">{label}</td>
                    {cells.map((on, i) => (
                      <td key={i} className="px-1 py-3.5 text-center sm:px-3">
                        {on ? <IconCheck size={18} className="mx-auto text-mint" /> : <IconLock size={15} className="mx-auto text-ink/20" />}
                        <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10">
            <TrustBadge />
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink">Questions</h2>
            <Faq />
          </div>
        </Container>
      </section>
    </>
  )
}
