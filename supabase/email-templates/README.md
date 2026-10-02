# Email setup

Every email the site sends goes out through Resend from
`no-reply@freelearning.dgclgroup.com`. There are two senders:

| What | Sent by | Where the Resend key goes |
| --- | --- | --- |
| Confirmation, login and reset codes, email change | Supabase Auth | Supabase > Authentication > Emails > SMTP Settings |
| Enquiry alert to DGCL, receipt to the learner | The site (`/api/enquiry`) | cPanel > Setup Node.js App > Environment variables |

The key is never written in this repository.

## 1. Supabase: send through Resend

**Authentication > Emails > SMTP Settings**, switch on *Enable Custom SMTP*:

| Field | Value |
| --- | --- |
| Sender email | no-reply@freelearning.dgclgroup.com |
| Sender name | DGCL Digital Cloud Academy |
| Host | smtp.resend.com |
| Port | 465 |
| Username | resend |
| Password | your Resend API key |

Then:

- **Authentication > Rate Limits**: raise "Rate limit for sending emails" (it
  stays at 30 an hour after custom SMTP is switched on).
- **Authentication > Sign In / Providers > Email**: *Confirm email* on, *Email OTP
  length* 6, *Email OTP expiration* 3600 seconds.
- **Authentication > URL Configuration**: *Site URL*
  `https://freelearning.dgclgroup.com`, and add
  `https://freelearning.dgclgroup.com/**` to *Redirect URLs*.

## 2. Supabase: the branded templates

Built by `node scripts/build-email-templates.mjs`. Every email sends a 6-digit
code (`{{ .Token }}`) instead of a link. Edit the script, not these files.

Paste each into **Authentication > Emails > Templates**:

| Supabase template | Subject | File |
| --- | --- | --- |
| Confirm signup | Your DGCL confirmation code | confirm-signup.html |
| Magic Link | Your DGCL login code | login-code.html |
| Reset Password | Reset your DGCL password | reset-password.html |
| Change Email Address | Confirm your new DGCL email address | change-email.html |

The logo loads from `{{ .SiteURL }}/brand/dgcl-logo.png`, which is why the
Site URL above must be the live address.

## 3. The site: enquiry emails

In cPanel > **Setup Node.js App** > the freelearning app > *Environment
variables*, add:

| Name | Value |
| --- | --- |
| RESEND_API_KEY | your Resend API key (required) |
| SALES_EMAIL | where alerts go; default info@dgclgroup.com |
| EMAIL_FROM | optional; default `DGCL Digital Cloud Academy <no-reply@freelearning.dgclgroup.com>` |

Save, then **Restart**. Without `RESEND_API_KEY` enquiries are still saved and
shown in the admin panel; only the emails are skipped.

The templates are in `src/lib/email/enquiry.ts`. Checks:
`node scripts/check-enquiry-email.mjs` (sends nothing).
