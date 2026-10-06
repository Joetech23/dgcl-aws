-- The partner list for the sign-up and enquiry forms.
--
-- Learners pick their partner from a list instead of typing a code. This
-- returns only the active partners' names and codes, nothing else (no email,
-- no reward). Partners are added and switched off in Admin > Partners.
--
-- Run the whole file once in the Supabase SQL editor. Until it is run, the
-- forms simply hide the partner field; partner links keep working.

create or replace function public.list_partners()
returns table (code text, name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.code, p.name from public.partners p where p.active order by p.name;
$$;

grant execute on function public.list_partners() to anon, authenticated;
