# Payments: switching them on

What can be paid for online (prices are in `src/config/pricing.ts`):

| What | Price | Who pays |
| --- | --- | --- |
| Module 3 (EC2), Module 4 (S3) | $20 each, once | A signed-in learner, from the locked module |
| One-to-one consultation | $25 | Anyone who sends an instructor-led enquiry |

The learner pays on Stripe's own page. Card details never reach this site.
The site opens a module, or marks a consultation as paid, only after Stripe
confirms the payment to the server.

Until the steps below are done, nothing can be bought: a priced module says
online payment is not switched on yet, and an instructor-led enquiry is still
sent to DGCL without the fee.

## 1. Database (once)

In the Supabase SQL editor, run `supabase/migrations/0004_payments.sql`.

## 2. Keys on the server

In cPanel > **Setup Node.js App** > the app > **Environment variables**, add:

| Name | Where it comes from |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe > Developers > API keys > Secret key |
| `STRIPE_WEBHOOK_SECRET` | Step 3 below |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project settings > API > `service_role` |

Save, then **Restart** the app. Never put these in the repository, in GitHub
variables, or in a name that starts with `NEXT_PUBLIC`.

Start with Stripe's **test** key (`sk_test_...`). Swap to the live key only
after step 4 passes.

## 3. Webhook in Stripe

Stripe > Developers > Webhooks > **Add endpoint**:

- URL: `https://lth.dgclgroup.com/api/stripe/webhook/` (keep the final slash)
- Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`

Copy the endpoint's **Signing secret** (`whsec_...`) into
`STRIPE_WEBHOOK_SECRET` and restart the app. Test mode and live mode each have
their own endpoint and their own secret.

The webhook is what records a payment when the learner closes the tab before
coming back to the site. With it missing, a payment is still recorded when
they do come back.

## 4. Test before going live

With the test key in place, use Stripe's test card `4242 4242 4242 4242`, any
future date and any CVC.

1. Sign in as a learner, open Module 3, press **Unlock for $20**, pay.
   You should land back on the module, see "Payment received", and the lesson
   should play.
2. Send an instructor-led enquiry and pay the $25. You should land on
   "Your consultation is booked", and the enquiry in Admin > Enquiries should
   say "Consultation fee paid".
3. In Stripe > Developers > Webhooks, the endpoint should show both
   deliveries as succeeded.
4. Admin > Overview > "Paid online" should show both payments.

Then replace the two Stripe values with the live ones and restart.

## Opening a module without online payment

Admin > Learners: the small **+ M3** and **+ M4** buttons under a learner's
programme open that module for them (for a bank transfer, or a gift). Putting
a learner on a programme opens every module.

## Refunds

Refund in the Stripe dashboard. A refund does not close the module by itself;
if it should, delete that learner's row from the `purchases` table in Supabase.

## How it is protected

- Prices are fixed on the server. The browser only says which module.
- A module opens only from a payment Stripe has confirmed: the server reads
  the payment back from Stripe, and checks the webhook's signature.
- Learners cannot add a purchase themselves: the database has no rule that
  lets them, only the server's service key can.
- A paid module's narration is not a public file. It is served only to a
  signed-in learner the database says has bought it or is on a programme.
