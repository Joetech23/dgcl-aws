import Link from 'next/link'
import Image from 'next/image'
import { Container, Logo } from './ui'
import { UKPRN, UKRLP_URL } from './TrustBadge'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface print:hidden">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink/60">
            FreeTechPath is the free learning site of DGCL Digital Cloud Academy, part of Digital Group Consultancy Services Ltd, London.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Image src="/art/aws-partner.png" alt="AWS Partner" width={146} height={146} className="h-12 w-12 rounded-md border border-line bg-white" />
            <span className="text-[12.5px] leading-snug text-ink/55">
              UK registered training provider,{' '}
              <a href={UKRLP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink/75 underline-offset-2 hover:underline">
                UKPRN {UKPRN}
              </a>
            </span>
          </div>
        </div>
        <FooterCol
          title="Learn"
          links={[
            ['/course/', 'The AWS course'],
            ['/signup/', 'Start free'],
            ['/plans/', 'Ways to learn'],
            ['/plans/#instructor-led', 'Instructor-led classes'],
            ['/#courses', 'All DGCL courses'],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ['/login/', 'Log in'],
            ['/dashboard/', 'Dashboard'],
            ['/c/DGCL-AWS-SAMPLE/', 'Verify a certificate'],
            ['/#faq', 'Questions'],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ['https://dgclgroup.com', 'dgclgroup.com'],
            ['mailto:info@dgclgroup.com', 'Contact us'],
            ['/partners/', 'Become a partner'],
          ]}
        />
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-[12.5px] text-ink/45 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Digital Group Consultancy Services Ltd</span>
          <span className="sm:ml-auto">AWS and the AWS logo are trademarks of Amazon.com, Inc.</span>
        </Container>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-display text-[13px] font-bold text-ink">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-[14px] text-ink/60 transition hover:text-blue">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
