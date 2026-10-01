# Supabase email templates

Built by `node scripts/build-email-templates.mjs`. Every email sends a 6-digit
code (`{{ .Token }}`) instead of a link. Edit the script, not these files.

Paste each into **Supabase > Authentication > Emails > Templates**:

| Supabase template | Subject | File |
| --- | --- | --- |
| Confirm signup | Your DGCL confirmation code | confirm-signup.html |
| Magic Link | Your DGCL login code | login-code.html |
| Reset Password | Reset your DGCL password | reset-password.html |
| Change Email Address | Confirm your new DGCL email address | change-email.html |

The logo loads from `{{ .SiteURL }}/brand/dgcl-logo.png`, so set **Site URL**
(Authentication > URL Configuration) to the live site address.
