-- Seats reserved through the "Reserve my seat" form.
-- Run this once in the Supabase SQL Editor, or with `supabase db push`.

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> '' and char_length(name) <= 200),
  email text not null check (char_length(email) <= 254 and email like '%_@_%'),
  created_at timestamptz not null default now()
);

comment on table public.registrations is
  'Seats reserved on the landing page. Written by the site''s server with the secret key.';

-- One seat per address, whatever its capitalisation. The site treats a repeat as already reserved.
create unique index registrations_email_key on public.registrations (lower(email));

-- The site's export reads oldest first.
create index registrations_created_at_idx on public.registrations (created_at, id);

-- Row level security with no policies: the public (anon) and signed-in keys can neither
-- read nor write. Only the server, using the secret key, can.
alter table public.registrations enable row level security;
revoke all on table public.registrations from anon, authenticated;
grant select, insert, update, delete on table public.registrations to service_role;
