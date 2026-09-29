'use client'

import Link from 'next/link'
import { useAccount } from '@/lib/backend'
import { catalog, LAST_FREE, TOTAL_MODULES } from '@/config/catalog'
import { courses } from '@/config/courses'
import { findTrack } from '@/config/tracks'
import { moduleName } from '@/lib/course/names'
import { freeTrackDone, moduleFraction, moduleState, nextModule } from '@/lib/access'
import { ModuleCard } from '@/components/app/ModuleCard'
import { SlideThumb } from '@/components/app/SlideThumb'
import { EnquireButton } from '@/components/site/Enquiry'
import { ButtonLink, Progress, buttonClass } from '@/components/site/ui'
import { CourseIcon } from '@/components/site/CourseGrid'
import { IconArrowRight, IconAward, IconCheck, IconFlame, IconPlay, IconStar } from '@/components/site/icons'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const a = useAccount()
  if (!a.user) return null

  const { completed, enrollment } = a
  const track = findTrack(enrollment?.track)
  const up = nextModule(completed, enrollment)
  const upState = up ? moduleState(up, completed, enrollment) : null
  const nextSlideIndex = up?.lesson ? Math.max(0, up.lesson.slides.findIndex((s) => !completed.has(s.id))) : 0
  const nextSlide = up?.lesson?.slides[nextSlideIndex] ?? null

  const built = catalog.filter((m) => m.lesson)
  const totalSlides = built.reduce((n, m) => n + m.lesson!.slides.length, 0)
  const doneSlides = built.reduce((n, m) => n + m.lesson!.slides.filter((s) => completed.has(s.id)).length, 0)
  const modulesDone = catalog.filter((m) => m.number > 0 && moduleFraction(m, completed) === 1).length
  const overall = totalSlides ? doneSlides / totalSlides : 0
  const firstName = a.user.name.split(' ')[0]
  const cert = a.certificates[0]

  return (
    <div className="mx-auto max-w-[1180px]">
      <div>
        <p className="text-[14px] text-ink/55">{greeting()},</p>
        <h1 className="font-display text-[clamp(1.6rem,3.2vw,2.1rem)] font-extrabold capitalize tracking-[-0.025em] text-ink">{firstName}</h1>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-5">
          {/* ---------- the one thing to do next ---------- */}
          {upState === 'open' && up && nextSlide ? (
            <section data-tour="continue" className="overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_rgb(var(--line))]">
              <div className="grid md:grid-cols-[1.15fr_1fr]">
                <Link href={`/learn/${up.slug}/`} className="group relative block bg-[#000728] p-2" aria-label={`Continue ${up.title}`}>
                  <SlideThumb slide={nextSlide} module={up.number} className="rounded-xl" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-blue-deep shadow-stage transition group-hover:scale-105">
                      <IconPlay size={22} />
                    </span>
                  </span>
                </Link>
                <div className="flex flex-col p-5 sm:p-6">
                  <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-blue-electric">{doneSlides ? 'Continue learning' : 'Start here'}</p>
                  <h2 className="mt-2 font-display text-[21px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
                    {moduleName(up.number)}: {up.title}
                  </h2>
                  <p className="mt-1.5 text-[14px] text-ink/55">
                    Lesson {nextSlideIndex + 1} of {up.lesson!.slides.length} · {nextSlide.navLabel}
                  </p>
                  <Progress value={moduleFraction(up, completed)} className="mt-5" />
                  <ButtonLink href={`/learn/${up.slug}/`} size="lg" className="mt-6 w-full sm:w-auto sm:self-start">
                    {doneSlides ? 'Continue' : 'Start the Introduction'}
                    <IconArrowRight size={18} />
                  </ButtonLink>
                </div>
              </div>
            </section>
          ) : !enrollment && freeTrackDone(completed) ? (
            <section data-tour="continue" className="relative overflow-hidden rounded-3xl bg-blue-deep p-6 text-white sm:p-8">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[34px] border-gold/20" />
              <p className="relative font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold">Free modules complete</p>
              <h2 className="relative mt-2 max-w-lg font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
                Great work. Ready for Modules 5 to {TOTAL_MODULES}?
              </h2>
              <p className="relative mt-2 max-w-lg text-[15px] text-white/70">
                Networking, databases, serverless, security and more. Learn at your own pace, or live with an instructor. Our team will find the right price for your country.
              </p>
              <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
                <EnquireButton track="self-paced" className={buttonClass('gold', 'lg')}>
                  Continue self-paced
                </EnquireButton>
                <EnquireButton track="instructor-led" className={buttonClass('primary', 'lg', '!bg-white/10 !shadow-none hover:!bg-white/15')}>
                  Join instructor-led classes
                </EnquireButton>
              </div>
            </section>
          ) : (
            <section data-tour="continue" className="rounded-3xl bg-surface p-6 shadow-[0_1px_0_rgb(var(--line))] sm:p-8">
              <IconAward size={28} className="text-blue" />
              <h2 className="mt-3 font-display text-[22px] font-extrabold text-ink">Every available lesson is done</h2>
              <p className="mt-1.5 max-w-lg text-[15px] text-ink/60">
                New modules are being produced. {track?.id === 'instructor-led' ? 'Your live classes cover them in the meantime.' : 'Instructor-led classes cover them now.'}
              </p>
            </section>
          )}

          {/* ---------- stats ---------- */}
          <section data-tour="stats" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <Stat icon={<IconCheck size={18} />} tint="bg-mint/10 text-mint" label="Modules" value={`${String(modulesDone).padStart(2, '0')}/${TOTAL_MODULES}`} sub="done" />
            <Stat icon={<IconStar size={18} />} tint="bg-gold/20 text-[#9A6B00] dark:text-gold" label="Points" value={String(a.points)} sub="earned" />
            <div className="col-span-2 flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-[0_1px_0_rgb(var(--line))] sm:col-span-1 sm:p-5">
              <Ring value={overall} />
              <div>
                <p className="font-display text-[14px] font-bold text-ink">Course progress</p>
                <p className="mt-0.5 text-[12.5px] text-ink/50">
                  {doneSlides} of {totalSlides} lessons
                </p>
              </div>
            </div>
          </section>

          {/* ---------- modules ---------- */}
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[18px] font-extrabold text-ink">Your free modules</h2>
              <Link href="/learn/" className="font-display text-[13.5px] font-bold text-blue hover:underline">
                All {TOTAL_MODULES} modules
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {catalog
                .filter((m) => m.number <= LAST_FREE)
                .map((m) => (
                  <ModuleCard key={m.slug} m={m} state={moduleState(m, completed, enrollment)} fraction={moduleFraction(m, completed)} />
                ))}
            </div>
          </section>
        </div>

        {/* ---------- right column ---------- */}
        <div className="space-y-5">
          {cert ? (
            <section className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))]">
              <IconAward size={26} className="text-gold" />
              <h2 className="mt-2 font-display text-[17px] font-extrabold text-ink">Your certificate is ready</h2>
              <p className="mt-1 text-[13.5px] text-ink/60">{cert.course}</p>
              <ButtonLink href={`/c/${cert.code}/`} size="md" className="mt-4 w-full">
                View and download
              </ButtonLink>
            </section>
          ) : null}

          <section className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))]">
            <h2 className="font-display text-[17px] font-extrabold text-ink">Instructor-led classes</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink/60">Live classes with a DGCL instructor. New cohorts every four months.</p>
            <ul className="mt-4 space-y-2">
              {courses.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: c.tint }}>
                    <CourseIcon kind={c.icon} size={17} />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[13.5px] font-bold text-ink">{c.short}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/classes/" variant="secondary" size="md" className="mt-4 w-full">
              See the classes
            </ButtonLink>
          </section>

          <section data-tour="goals" className="rounded-3xl bg-surface p-5 shadow-[0_1px_0_rgb(var(--line))]">
            <h2 className="font-display text-[17px] font-extrabold text-ink">This week&apos;s goals</h2>
            <div className="mt-4 space-y-5">
              <Goal icon={<IconFlame size={18} className="text-ember" />} title="Learn 3 days in a row" value={Math.min(a.streak, 3)} of={3} reward="+30 points" />
              {up?.lesson ? (
                <Goal
                  icon={<IconCheck size={18} className="text-mint" />}
                  title={`Finish ${moduleName(up.number)}`}
                  value={up.lesson.slides.filter((s) => completed.has(s.id)).length}
                  of={up.lesson.slides.length}
                  reward="+50 points"
                />
              ) : null}
              <Goal icon={<IconStar size={18} className="text-[#9A6B00] dark:text-gold" />} title="Earn 500 points" value={Math.min(a.points, 500)} of={500} reward="Badge" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, tint, label, value, sub }: { icon: React.ReactNode; tint: string; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-[0_1px_0_rgb(var(--line))] sm:p-5">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${tint}`}>{icon}</span>
      <p className="mt-4 text-[13px] text-ink/55">{label}</p>
      <p className="mt-0.5 font-display text-[26px] font-extrabold leading-none tracking-[-0.02em] text-ink">
        {value} <span className="text-[13px] font-semibold tracking-normal text-ink/45">{sub}</span>
      </p>
    </div>
  )
}

function Ring({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgb(var(--line))" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#FFC000"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-[14px] font-extrabold text-ink">{Math.round(value * 100)}%</span>
    </div>
  )
}

function Goal({ icon, title, value, of, reward }: { icon: React.ReactNode; title: string; value: number; of: number; reward: string }) {
  const done = value >= of
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[14px] font-bold text-ink">{title}</p>
          <p className="text-[12px] font-semibold text-blue-electric">{reward}</p>
        </div>
        <span className={`font-display text-[12.5px] font-bold ${done ? 'text-mint' : 'text-ink/45'}`}>
          {value}/{of}
        </span>
      </div>
      <Progress value={value / of} className="mt-2.5" />
    </div>
  )
}
