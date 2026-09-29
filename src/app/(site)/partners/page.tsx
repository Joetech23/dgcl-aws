import type { Metadata } from 'next'
import { Container, Eyebrow, SectionTitle, buttonClass } from '@/components/site/ui'
import { EnquireButton } from '@/components/site/Enquiry'
import { IconArrowRight, IconAward, IconCheck, IconUser } from '@/components/site/icons'

export const metadata: Metadata = { title: 'Partner programme | DGCL Digital Cloud Academy' }

const STEPS = [
  { title: 'Get your code', body: 'DGCL gives you a short code, like TECHHUB10, and a link that carries it.' },
  { title: 'Share it', body: 'Post the link, or give the code to learners. It is saved for 60 days after a click, so late sign-ups still count.' },
  { title: 'Earn when they join', body: 'Every learner who joins a programme with your code is credited to you, and your agreed reward follows.' },
]

export default function PartnersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blue-deep py-16 text-white lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[48px] border-gold/15" />
        <Container className="relative">
          <Eyebrow className="!text-gold">Partner programme</Eyebrow>
          <h1 className="mt-2 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Send learners to DGCL. Get rewarded when they join.
          </h1>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-white/70">
            For training centres, tech communities, recruiters and creators. You share a link or a code; we take care of the teaching.
          </p>
          <EnquireButton course="Partner programme" className={buttonClass('gold', 'lg', 'mt-8')}>
            Apply to be a partner <IconArrowRight size={18} />
          </EnquireButton>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionTitle>How it works</SectionTitle>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-line bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue font-display text-[15px] font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-4 font-display text-[18px] font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate p-6 sm:p-8">
              <IconUser size={26} className="text-blue" />
              <h3 className="mt-3 font-display text-[18px] font-extrabold text-ink">What your learners get</h3>
              <ul className="mt-4 space-y-2.5">
                {['The Introduction and Modules 1 to 4 free', 'A personal call to find the right programme and price', 'Training from a UK registered provider'].map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] text-ink/75">
                    <IconCheck size={18} className="mt-0.5 shrink-0 text-mint" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-slate p-6 sm:p-8">
              <IconAward size={26} className="text-gold" />
              <h3 className="mt-3 font-display text-[18px] font-extrabold text-ink">What you get</h3>
              <ul className="mt-4 space-y-2.5">
                {['A reward for every learner who joins, agreed with you up front', 'Your own link and code', 'A DGCL contact who reports your referrals to you'].map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] text-ink/75">
                    <IconCheck size={18} className="mt-0.5 shrink-0 text-mint" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
