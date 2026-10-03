import type { Metadata } from 'next'
import { Curriculum } from '@/components/site/Curriculum'
import { ButtonLink, Container, Eyebrow } from '@/components/site/ui'
import { catalog, FREE_COUNT, TOTAL_MODULES } from '@/config/catalog'
import { IconArrowRight } from '@/components/site/icons'

export const metadata: Metadata = { title: 'The full AWS Cloud course, free to start', alternates: { canonical: '/course/' } }

const hours = Math.round(catalog.reduce((n, m) => n + m.minutes, 0) / 60)

export default function CoursePage() {
  return (
    <Container className="py-12 lg:py-20">
      <div className="max-w-2xl">
        <Eyebrow>AWS Cloud Training</Eyebrow>
        <h1 className="mt-2 font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          The full course, module by module
        </h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-ink/60">
          An Introduction and {TOTAL_MODULES} modules, about {hours} hours of learning. The Introduction and the first {FREE_COUNT} modules are free.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
        {[
          [String(TOTAL_MODULES), 'modules'],
          [`${hours}h`, 'of lessons'],
          [String(FREE_COUNT), 'free to start'],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-line p-4">
            <p className="font-display text-[26px] font-extrabold leading-none text-blue">{n}</p>
            <p className="mt-1.5 text-[13px] text-ink/55">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <Curriculum />
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-blue-deep p-6 text-white">
            <p className="font-display text-[20px] font-extrabold">Start with the Introduction</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">Free account, no card. Your progress is saved on every device.</p>
            <ButtonLink href="/signup/" variant="gold" size="lg" className="mt-5 w-full">
              Start free
              <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/plans/" size="lg" className="mt-2 w-full !bg-white/10 !shadow-none hover:!bg-white/15">
              Ways to learn
            </ButtonLink>
          </div>
        </aside>
      </div>
    </Container>
  )
}
