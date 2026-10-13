-- Payments: $20 modules and the $25 consultation fee.
--
-- Run the whole file once in the Supabase SQL editor. It is safe to run again.
--
-- What it adds:
--   * purchases: one row per module a learner has paid for. Learners can read
--     their own rows and nothing else. Nobody can add a row from the website:
--     only the server does, after Stripe confirms the payment (it uses the
--     service role key), or an admin, for a learner who paid another way.
--   * leads: whether the consultation fee was paid. The public enquiry form
--     can never mark its own enquiry as paid.
--   * my_access(): what the signed-in learner may open. The server asks this
--     before it hands over a paid module's narration.

-- ---------- purchases ----------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Matches a module slug in src/config/pricing.ts, e.g. 'm03-ec2'.
  module_slug text not null,
  amount_cents int not null default 0,
  currency text not null default 'usd',
  stripe_session_id text unique,
  stripe_payment_intent text,
  -- 'stripe' = paid online. 'admin' = opened by DGCL (bank transfer, a gift).
  source text not null default 'stripe' check (source in ('stripe', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists purchases_user_idx on public.purchases (user_id);

alter table public.purchases enable row level security;

drop policy if exists "purchases: own or admin read" on public.purchases;
create policy "purchases: own or admin read" on public.purchases
  for select using (user_id = auth.uid() or public.is_admin());

-- Admins may open a module for a learner by hand, and undo it. Such rows can
-- never carry a Stripe reference, so they cannot be confused with real sales.
drop policy if exists "purchases: admin grant" on public.purchases;
create policy "purchases: admin grant" on public.purchases
  for insert with check (public.is_admin() and source = 'admin' and stripe_session_id is null);

drop policy if exists "purchases: admin remove" on public.purchases;
create policy "purchases: admin remove" on public.purchases
  for delete using (public.is_admin() and source = 'admin');

-- There is deliberately no insert, update or delete policy for learners.

-- ---------- consultation fee on enquiries ----------
alter table public.leads add column if not exists consultation_paid boolean not null default false;
alter table public.leads add column if not exists paid_at timestamptz;
alter table public.leads add column if not exists amount_cents int;
alter table public.leads add column if not exists stripe_session_id text;

-- The public form may send an enquiry, but only an unpaid one.
drop policy if exists "leads: anyone can send" on public.leads;
create policy "leads: anyone can send" on public.leads
  for insert with check (
    status = 'new'
    and notes is null
    and (user_id is null or user_id = auth.uid())
    and consultation_paid = false
    and paid_at is null
    and amount_cents is null
    and stripe_session_id is null
  );

-- ---------- what may this learner open? ----------
create or replace function public.my_access()
returns table (track text, modules text[])
language sql
stable
security definer
set search_path = public
as $$
  select
    p.track,
    coalesce((select array_agg(distinct x.module_slug) from public.purchases x where x.user_id = auth.uid()), '{}')
  from public.profiles p
  where p.id = auth.uid();
$$;

revoke all on function public.my_access() from public;
grant execute on function public.my_access() to authenticated;
