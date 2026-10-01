import { notFound } from 'next/navigation'
import { modules } from '@/content/modules'
import { SlideThumb } from '@/components/app/SlideThumb'

/**
 * Development only: every slide of every module, fully built, one after
 * another. scripts/check-slide-fit.mjs reads this page to find text that
 * overflows its box. Not available in production builds.
 */
export default function AllSlides() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="grid gap-4 bg-slate p-4" style={{ gridTemplateColumns: 'repeat(2, 960px)' }}>
      {modules.flatMap((m) =>
        m.slides.map((s) => (
          <div key={s.id} data-slide={s.id} data-module={m.number}>
            <p className="font-mono text-[11px] text-ink/50">{s.id}</p>
            <SlideThumb slide={s} module={m.number} />
          </div>
        )),
      )}
    </div>
  )
}
