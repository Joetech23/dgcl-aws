-- DGCL Cloud Academy LMS: accounts, progress, enquiries, partners, certificates.
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Row level
-- security is on for every table: learners see only their own rows, admins
-- see everything, and the public can only send an enquiry or check a
-- certificate / referral code through the functions at the bottom.
--
-- Make someone an admin (after they have signed up once):
--   update public.profiles set role = 'admin' where email = 'you@dgclgroup.com';

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  phone text,
  country text,
  role text not null default 'student' check (role in ('student', 'admin')),
  -- Set by an admin when the learner joins a programme; opens Modules 5 to 14.
  track text check (track in ('self-paced', 'instructor-led')),
  track_set_at timestamptz,
  referral_code text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- A new auth user gets a profile, with the name and referral code they signed up with.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    nullif(upper(new.raw_user_meta_data ->> 'referral_code'), '')
  )
  on conflict (id) do nothing;
  insert into public.progress (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Learners may edit their own details, but never their role or track.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null in the SQL editor and server jobs: those are trusted.
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

drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_fields();

alter table public.profiles enable row level security;
drop policy if exists "profiles: own or admin read" on public.profiles;
create policy "profiles: own or admin read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles: own or admin update" on public.profiles;
create policy "profiles: own or admin update" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- ---------- progress ----------
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed text[] not null default '{}',
  bookmark text,
  streak_days int not null default 0,
  last_day date,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;
drop policy if exists "progress: own or admin read" on public.progress;
create policy "progress: own or admin read" on public.progress
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "progress: own write" on public.progress;
create policy "progress: own write" on public.progress
  for insert with check (user_id = auth.uid());
drop policy if exists "progress: own update" on public.progress;
create policy "progress: own update" on public.progress
  for update using (user_id = auth.uid());

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- partners (referral codes) ----------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  code text not null unique check (code = upper(code)),
  -- Free text, e.g. "£50 per learner who joins", so DGCL can set any deal.
  reward text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;
drop policy if exists "partners: admin all" on public.partners;
create policy "partners: admin all" on public.partners
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- enquiries (the "talk to sales" form) ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  country text,
  track text,
  course text,
  message text,
  referral_code text,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'contacted', 'joined', 'closed')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
-- Anyone may send an enquiry; nobody but an admin can read them back.
drop policy if exists "leads: anyone can send" on public.leads;
create policy "leads: anyone can send" on public.leads
  for insert with check (status = 'new' and notes is null and (user_id is null or user_id = auth.uid()));
drop policy if exists "leads: admin read" on public.leads;
create policy "leads: admin read" on public.leads
  for select using (public.is_admin());
drop policy if exists "leads: admin update" on public.leads;
create policy "leads: admin update" on public.leads
  for update using (public.is_admin());

-- ---------- certificates ----------
create table if not exists public.certificates (
  code text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  course text not null,
  issued_at timestamptz not null default now()
);

alter table public.certificates enable row level security;
drop policy if exists "certificates: own or admin read" on public.certificates;
create policy "certificates: own or admin read" on public.certificates
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "certificates: admin issue" on public.certificates;
create policy "certificates: admin issue" on public.certificates
  for insert with check (public.is_admin());

-- ---------- public lookups ----------
-- Anyone can check a certificate by its code (the verify page).
create or replace function public.verify_certificate(p_code text)
returns table (code text, name text, course text, issued_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select c.code, c.name, c.course, c.issued_at from public.certificates c where c.code = upper(p_code);
$$;

-- Anyone can check that a referral code is real, and see the partner's name.
create or replace function public.partner_for_code(p_code text)
returns table (name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.name from public.partners p where p.code = upper(p_code) and p.active;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.partner_for_code(text) to anon, authenticated;
