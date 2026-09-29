-- Admins by email.
--
-- Any account whose email is in public.admin_emails is an admin: new sign-ups
-- are promoted the moment they are created, and existing accounts are
-- promoted when this runs. Run the whole file once in the Supabase SQL editor.
--
-- Add another admin later with one line:
--   insert into public.admin_emails (email) values ('someone@dgclgroup.com');
--   update public.profiles set role = 'admin' where email = 'someone@dgclgroup.com';

create table if not exists public.admin_emails (
  email text primary key check (email = lower(email))
);

-- Readable only from the SQL editor: no policies, so the site cannot see it.
alter table public.admin_emails enable row level security;

insert into public.admin_emails (email) values ('info@dgclgroup.com')
on conflict (email) do nothing;

-- Same as before, plus: listed emails start as admins.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, referral_code, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    nullif(upper(new.raw_user_meta_data ->> 'referral_code'), ''),
    case when exists (select 1 from public.admin_emails a where a.email = lower(new.email)) then 'admin' else 'student' end
  )
  on conflict (id) do nothing;
  insert into public.progress (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

-- The guard that stops learners changing their own role must not block the
-- SQL editor, where there is no signed-in user (auth.uid() is null).
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.track := old.track;
    new.track_set_at := old.track_set_at;
    new.email := old.email;
  end if;
  if new.track is distinct from old.track then
    new.track_set_at := now();
  end if;
  return new;
end;
$$;

-- Promote anyone on the list who already has an account.
update public.profiles p
set role = 'admin'
from public.admin_emails a
where lower(p.email) = a.email and p.role <> 'admin';
