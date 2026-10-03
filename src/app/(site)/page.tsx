import Image from 'next/image'
import { catalog, FREE_COUNT, TOTAL_MODULES } from '@/config/catalog'
import { modules } from '@/content/modules'
import { courses } from '@/config/courses'
import { SITE } from '@/config/site'
import { moduleName } from '@/lib/course/names'
import { LessonPreview } from '@/components/site/LessonPreview'
import { Curriculum } from '@/components/site/Curriculum'
import { Certificate, formatCertDate } from '@/components/site/Certificate'
import { TrackCards } from '@/components/site/TrackCards'
import { TrustBadge } from '@/components/site/TrustBadge'
import { Faq } from '@/components/site/Faq'
import { CourseGrid, CourseIcon } from '@/components/site/CourseGrid'
import { ButtonLink, Container, Eyebrow, Logo, SectionTitle } from '@/components/site/ui'
import { IconArrowRight, IconAward, IconCheck, IconClock, IconHand, IconPhone, IconPlay } from '@/components/site/icons'

const freeModules = catalog.filter((m) => m.free)
const lessonCount = modules.reduce((n, m) => n + m.slides.length, 0)

// What search engines read: who runs the site and what it teaches.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': `${SITE.url}/#org` },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE.url}/#org`,
      name: SITE.owner,
      alternateName: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/brand/dgcl-logo.png`,
      email: 'info@dgclgroup.com',
      sameAs: ['https://dgclgroup.com'],
      address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
    },
    ...courses.map((c) => ({
      '@type': 'Course',
      name: c.title,
      description: c.summary,
      url: `${SITE.url}/${c.online ? 'course/' : '#courses'}`,
      provider: { '@id': `${SITE.url}/#org` },
      ...(c.online ? { isAccessibleForFree: true } : {}),
    })),
  ],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ---------- hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="site-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-10 hidden h-[520px] w-[520px] rounded-full bg-blue/[0.07] blur-3xl dark:bg-blue/20 lg:block" />
        <Container className="relative grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[12.5px] font-semibold text-ink/70">
              <span className="rounded-full bg-mint/10 px-2 py-0.5 font-display text-[11px] font-extrabold text-[#077A55] dark:text-mint">NEW</span>
              AWS Cloud Training is online, with {FREE_COUNT} modules free
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.3rem,5.2vw,3.7rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink">
              Launch your tech career.{' '}
              <span className="relative whitespace-nowrap text-blue">
                Start free.
                <svg aria-hidden viewBox="0 0 220 12" className="absolute -bottom-2 left-0 h-3 w-full text-gold" preserveAspectRatio="none">
                  <path d="M2 9c50-6 120-8 216-3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink/65">
              AWS Cloud, DevOps Tools, Cybersecurity and Ethical Hacking, and Healthcare Data Analysis, AI and Machine
              Learning, taught by DGCL Digital Cloud Academy. Begin today with AWS Cloud Training: short narrated lessons
              that stop and ask you to try things, ready for your phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup/" size="lg">
                Start AWS free
                <IconArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="#courses" size="lg" variant="secondary">
                Explore all {courses.length} courses
              </ButtonLink>
            </div>

            {/* the four paths, at a glance */}
            <ul aria-label="DGCL courses" className="mt-8 grid grid-cols-2 gap-2 sm:max-w-[34rem]">
              {courses.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.online ? '/signup/' : '#courses'}
                    className={`flex h-full min-h-[56px] items-center gap-2.5 rounded-xl border bg-surface px-3 py-2.5 transition hover:-translate-y-0.5 hover:shadow-lift ${
                      c.online ? 'border-blue/30' : 'border-line'
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white" style={{ background: c.tint }}>
                      <CourseIcon kind={c.icon} size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[13px] font-bold leading-tight text-ink">{c.short}</span>
                      <span className={`mt-0.5 block text-[11.5px] leading-tight ${c.online ? 'font-semibold text-[#077A55] dark:text-mint' : 'text-ink/50'}`}>
                        {c.online ? 'Online now, free start' : 'Live instructor classes'}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <TrustBadge compact />
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-display text-[12.5px] font-bold text-ink/55">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              Inside AWS Cloud Training · {lessonCount} narrated lessons
            </p>
            <LessonPreview />
          </div>
        </Container>
      </section>

      {/* ---------- trust ---------- */}
      <section className="border-y border-line bg-slate/60">
        <Container className="grid items-center gap-4 py-8 lg:grid-cols-[1fr_auto]">
          <TrustBadge />
          <div className="flex items-center justify-center gap-3 lg:flex-col lg:items-start">
            <Image src="/art/aws-partner.png" alt="AWS Partner" width={146} height={146} className="h-14 w-14 rounded-md border border-line bg-white" />
            <p className="max-w-[12rem] text-[13px] leading-snug text-ink/55">AWS Partner. Training aligned to industry certifications.</p>
          </div>
        </Container>
      </section>

      {/* ---------- all DGCL courses ---------- */}
      <section id="courses" className="scroll-mt-20 py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Our courses</Eyebrow>
              <SectionTitle className="mt-2">Four tech domains, one academy</SectionTitle>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
              AWS Cloud Training is online now with a free start. Every domain is also taught in live instructor classes, and their recordings are being added here.
            </p>
          </div>
          <div className="mt-10">
            <CourseGrid />
          </div>
        </Container>
      </section>

      {/* ---------- free modules ---------- */}
      <section className="border-t border-line bg-slate/60 py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>AWS Cloud Training · free to start</Eyebrow>
              <SectionTitle className="mt-2">The Introduction and {FREE_COUNT} modules, on us</SectionTitle>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
              Create an account and start straight away, in any order. No payment details, no trial that runs out.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {freeModules.map((m) => (
              <a
                key={m.slug}
                href={`/signup/?next=/learn/${m.slug}/`}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-blue/30 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[13px] font-extrabold text-blue">{moduleName(m.number)}</span>
                  {m.lesson ? (
                    <span className="inline-flex items-center gap-1 text-[12.5px] text-ink/45">
                      <IconClock size={14} />
                      {m.minutes} min
                    </span>
                  ) : (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 font-display text-[11px] font-bold text-[#7A5A00] dark:text-gold">Coming soon</span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-[17px] font-extrabold leading-snug text-ink">{m.title}</h3>
                <ul className="mt-4 flex-1 space-y-2">
                  {m.outcomes.map((o) => (
                    <li key={o} className="flex gap-2 text-[13.5px] leading-snug text-ink/65">
                      <IconCheck size={15} className="mt-0.5 shrink-0 text-mint" />
                      {o}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-blue">
                  {m.lesson ? 'Start free' : 'Sign up to be told'}
                  <IconArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="bg-blue-deep py-16 text-white lg:py-24">
        <Container>
          <Eyebrow className="!text-gold">How it works</Eyebrow>
          <SectionTitle className="mt-2 max-w-2xl !text-white">Not a video you sit through. A lesson that waits for you.</SectionTitle>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {[
              { icon: <IconPlay size={20} />, title: 'Watch', body: 'A calm voice talks you through each idea while the slide builds, one point at a time.' },
              { icon: <IconHand size={22} />, title: 'Try it', body: 'The lesson pauses and hands over to you: sort, match, choose. It carries on when you finish.' },
              { icon: <IconAward size={22} />, title: 'Prove it', body: 'Finish the course and pass the final check to earn your DGCL certificate.' },
            ].map((s, n) => (
              <div key={s.title}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold">{s.icon}</span>
                  <span className="font-mono text-[12px] text-white/40">0{n + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-[20px] font-extrabold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-white/70">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 sm:p-5">
            <IconPhone size={22} className="shrink-0 text-gold" />
            <p className="text-[14.5px] leading-relaxed text-white/80">
              Made for your phone first. The slide keeps its shape on any screen, with captions under it, so you can learn on the bus with the sound off.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------- the whole path ---------- */}
      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>The full AWS course</Eyebrow>
            <SectionTitle className="mt-2">An Introduction and {TOTAL_MODULES} modules, to the exam</SectionTitle>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/60">
              Start with the Introduction and Modules 1 to {FREE_COUNT}, free. When you are ready, open Modules 5 to {TOTAL_MODULES} self-paced, or learn them live with an instructor.
            </p>
            <ButtonLink href="#plans" variant="secondary" className="mt-6">
              See the ways to learn
            </ButtonLink>
          </div>
          <Curriculum />
        </Container>
      </section>

      {/* ---------- ways to learn ---------- */}
      <section id="plans" className="scroll-mt-20 bg-slate/70 py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Ways to learn</Eyebrow>
            <SectionTitle className="mt-2">Keep going your way</SectionTitle>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/60">
              Pick self-paced or instructor-led and leave your details. A DGCL adviser will call you with the price for your country, usually within one working day.
            </p>
          </div>
          <div className="mt-12">
            <TrackCards />
          </div>
        </Container>
      </section>

      {/* ---------- certificate ---------- */}
      <section className="py-16 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Certificate</Eyebrow>
            <SectionTitle className="mt-2">Something to show for it</SectionTitle>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/60">
              Every DGCL certificate carries your name and its own ID, so an employer can check it is real in one click. Add it to LinkedIn or your CV the day you finish.
            </p>
            <ul className="mt-6 space-y-3">
              {['Issued by a UK registered training provider', 'A verify link that never expires', 'Download it as a PDF, ready to print'].map((t) => (
                <li key={t} className="flex gap-2.5 text-[15px] text-ink/75">
                  <IconCheck size={18} className="mt-0.5 shrink-0 text-mint" />
                  {t}
                </li>
              ))}
            </ul>
            <ButtonLink href="/c/DGCL-AWS-SAMPLE/" variant="secondary" className="mt-6">
              See a sample certificate
            </ButtonLink>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 hidden -rotate-2 rounded-3xl bg-blue/[0.06] dark:bg-blue/15 sm:block" />
            <div className="relative overflow-hidden rounded-xl shadow-stage ring-1 ring-line">
              <Certificate name="Your Name" course="AWS Cloud Training CO2/CO3" date={formatCertDate(new Date().toISOString())} code="DGCL-AWS-SAMPLE" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- faq ---------- */}
      <section id="faq" className="scroll-mt-20 border-t border-line py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <SectionTitle className="mt-2">Good to know</SectionTitle>
            <p className="mt-4 text-[15px] text-ink/60">
              Something else? Email{' '}
              <a href="mailto:info@dgclgroup.com" className="font-semibold text-blue underline-offset-2 hover:underline">
                info@dgclgroup.com
              </a>
              .
            </p>
          </div>
          <Faq />
        </Container>
      </section>

      {/* ---------- closing ---------- */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-3xl bg-blue-deep px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.06]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[30px] border-gold/20" />
          <Logo invert className="relative mx-auto h-12 w-auto" />
          <h2 className="relative mx-auto mt-6 max-w-xl font-display text-[clamp(1.7rem,4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.025em]">
            Your first cloud lesson takes two minutes.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[16px] text-white/75">Start with the Introduction now. It is free, and it works on your phone.</p>
          <ButtonLink href="/signup/" variant="gold" size="lg" className="relative mt-8">
            Start free
            <IconArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
