import Image from 'next/image'
import localFont from 'next/font/local'

/**
 * DGCL's certificate of completion, from DGCL-Certificate-Of-Completion-
 * Template.pptx.
 *
 * public/cert/frame.png is the template's slide exported with its text
 * removed: the geometric border, the DGCL and AWS Partner marks, and the
 * Head of Admin signature. Everything that changes per learner is live text
 * laid over it at the template's own positions (measured on its 960 x 540
 * slide), sized in container units so the certificate scales like a picture
 * and prints sharp.
 */

// Self-hosted, like the rest of the site's type: no build-time network.
// Great Vibes stands in for the template's French Script, which cannot be
// licensed for the web; Poppins is the template's own body face.
const script = localFont({ src: '../../app/fonts/great-vibes-400.woff2', display: 'swap' })
const poppins = localFont({
  src: [
    { path: '../../app/fonts/poppins-400.woff2', weight: '400' },
    { path: '../../app/fonts/poppins-600.woff2', weight: '600' },
    { path: '../../app/fonts/poppins-700.woff2', weight: '700' },
  ],
  display: 'swap',
})

export type CertificateProps = {
  name: string
  course: string
  /** Shown as e.g. "29 September 2026". */
  date: string
  code: string
  verifyHost?: string
}

/** 960-wide template coordinates to percentages. */
const x = (px: number) => `${(px / 960) * 100}%`
const y = (px: number) => `${(px / 540) * 100}%`
const INDIGO = '#1D0F8C'
const ORANGE = '#EE6A12'

export function Certificate({ name, course, date, code, verifyHost = 'dgcl.academy' }: CertificateProps) {
  // Long names step down so they always fit the line.
  const nameSize = name.length > 26 ? 4.6 : name.length > 18 ? 5.6 : 6.6
  const courseSize = course.length > 38 ? 1.7 : 2.15

  return (
    <div className={`relative aspect-[16/9] w-full overflow-hidden bg-white text-[#111] ${poppins.className}`} style={{ containerType: 'inline-size' }}>
      <Image src="/cert/frame.png" alt="" fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" priority />

      <p
        className="absolute text-center font-bold uppercase leading-none"
        style={{ left: x(118), width: x(720), top: y(143), fontSize: '4.3cqw', color: INDIGO, letterSpacing: '0.01em' }}
      >
        Certificate of Completion
      </p>
      <p className="absolute text-center" style={{ left: x(200), width: x(556), top: y(185), fontSize: '1.7cqw' }}>
        This certificate is proudly presented to
      </p>

      <p
        className={`absolute text-center leading-none ${script.className}`}
        style={{ left: x(150), width: x(656), top: y(236), fontSize: `${nameSize}cqw` }}
      >
        {name}
      </p>
      <span aria-hidden className="absolute" style={{ left: x(239), width: x(478), top: y(314), height: '0.22cqw', background: ORANGE }} />

      <p className="absolute text-center leading-snug" style={{ left: x(200), width: x(556), top: y(326), fontSize: '1.32cqw' }}>
        Has successfully completed the required training and assessment,
        <br />
        demonstrating the knowledge and skills of the programme, and has achieved:
      </p>

      <div
        className="absolute flex items-center justify-center rounded-full text-center font-bold leading-none text-white"
        style={{
          left: x(164),
          width: x(637),
          top: y(384),
          height: y(37),
          fontSize: `${courseSize}cqw`,
          background: INDIGO,
          boxShadow: `0 0 0 0.25cqw #2B4A8C inset`,
        }}
      >
        {course}
      </div>

      <div
        className="absolute flex items-center justify-center rounded-[0.8cqw] font-semibold uppercase leading-none text-white"
        style={{ left: x(638), width: x(163), top: y(462), height: y(34), fontSize: '1.6cqw', background: `linear-gradient(90deg, ${ORANGE}, #F7860F)` }}
      >
        {date}
      </div>

      <p className="absolute font-medium leading-tight text-[#3a3a3a]" style={{ left: x(372), top: y(466), fontSize: '0.95cqw' }}>
        Certificate ID
        <br />
        <span className="font-semibold tracking-wide text-[#111]">{code}</span>
        <br />
        <span className="text-[#666]">Verify at {verifyHost}/c/</span>
      </p>
    </div>
  )
}

export function formatCertDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
