'use client'

import { useAccount } from '@/lib/backend'
import { catalog, TOTAL_MODULES } from '@/config/catalog'
import { moduleFraction, moduleState } from '@/lib/access'
import { ModuleCard } from '@/components/app/ModuleCard'
import { EnquireButton } from '@/components/site/Enquiry'
import { buttonClass } from '@/components/site/ui'
import { IconPlay } from '@/components/site/icons'

/** Self-paced: every module of the AWS course as narrated lessons. */
export default function SelfPaced() {
  const { completed, enrollment } = useAccount()
  const groups = [
    { title: 'Free: start anywhere', items: catalog.filter((m) => m.free) },
    { title: enrollment ? 'Your programme' : `Modules 5 to ${TOTAL_MODULES}`, items: catalog.filter((m) => !m.free) },
  ]
  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-blue-electric">
            <IconPlay size={11} /> Self-paced
          </p>
          <h1 className="mt-1 font-display text-[clamp(1.6rem,3.2vw,2.1rem)] font-extrabold tracking-[-0.025em] text-ink">AWS Cloud Training</h1>
          <p className="mt-1 text-[14.5px] text-ink/55">Narrated, animated lessons you take at your own speed. The Introduction plus {TOTAL_MODULES} modules.</p>
        </div>
        {!enrollment ? (
          <EnquireButton track="self-paced" className={buttonClass('secondary', 'md')}>
            Open all {TOTAL_MODULES} modules
          </EnquireButton>
        ) : null}
      </div>
      {groups.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="font-display text-[16px] font-extrabold text-ink">{g.title}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map((m) => (
              <ModuleCard key={m.slug} m={m} state={moduleState(m, completed, enrollment)} fraction={moduleFraction(m, completed)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
