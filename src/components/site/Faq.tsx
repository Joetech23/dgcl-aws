import { IconChevron } from './icons'

const QA: [string, string][] = [
  ['Do I need an IT background?', 'No. The course starts from what the cloud is, in plain English. Learners from IT and non-IT jobs take it side by side.'],
  ['Is the free part really free?', 'Yes. The Introduction and Modules 1 and 2 are free for good. You only need an account so we can save your progress. We never ask for a card to start.'],
  ['What do Modules 3 and 4 cost?', 'They are $20 each, in US dollars. You pay once on Stripe’s secure page and the module stays open on your account. Our site never sees your card details.'],
  ['Can I learn on my phone?', 'Yes, and most people do. The lessons are built phone first, with captions under the slide, so you can follow with the sound off.'],
  ['What is the difference between self-paced and instructor-led?', 'Self-paced opens every animated lesson of the course, with a certificate and practice exams, to take at your own speed. Instructor-led adds live classes with a DGCL instructor and a cohort, hands-on labs and career support.'],
  ['How much does it cost?', 'It depends on the programme and your country. Leave your details on any "Ask about" button and a DGCL adviser will call you with a price, usually within one working day.'],
  ['Are DevOps Tools, Cybersecurity and Healthcare Data Analysis here too?', 'Yes, as instructor-led training. Look through what each programme covers, then book a one-to-one consultation with a DGCL adviser.'],
  ['Why is there a $25 consultation fee?', 'It books a one-to-one meeting with a DGCL adviser, who goes through the programme and the training fee for your country with you. If you enrol, the $25 comes off your training fee.'],
  ['Is DGCL a registered training provider?', 'Yes. DGCL Digital Cloud Academy is on the UK Register of Learning Providers, UKPRN 10101893. You can check it yourself at ukrlp.education.gov.uk.'],
  ['I have a partner or coupon code. Where does it go?', 'If you followed a partner link, it is already saved. Otherwise, type the code into the form when you ask about a programme.'],
]

/** Native details/summary: works without JavaScript and with a keyboard. */
export function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {QA.map(([q, a]) => (
        <details key={q} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-4 py-5 font-display text-[16px] font-bold text-ink [&::-webkit-details-marker]:hidden">
            {q}
            <IconChevron size={20} className="ml-auto shrink-0 text-ink/40 transition group-open:rotate-180" />
          </summary>
          <p className="-mt-1 pb-5 pr-8 text-[15px] leading-relaxed text-ink/65">{a}</p>
        </details>
      ))}
    </div>
  )
}
