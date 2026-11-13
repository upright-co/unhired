-- Applications from the Edmonton pilot VSL page (/pilot). One row per application.
-- fit_score is computed at submit time (src/lib/pilot.ts) so Brandon can sort the best fits first.
-- Safe to re-run.

create table if not exists public.pilot_applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  business       text not null,
  website        text,
  industry       text not null,
  team_size      text not null,
  area           text not null,
  hiring         text not null,
  role           text not null,
  time_drain     text,
  owner_present  text not null,
  first_name     text not null,
  last_name      text not null,
  title          text,
  email          text not null,
  phone          text not null,
  fit_score      integer not null default 0,
  status         text not null default 'new',  -- new | picked | waitlist | declined
  notes          text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  referrer       text,
  landing_path   text,
  alerted_at     timestamptz,
  confirmed_at   timestamptz
);

create index if not exists pilot_applications_created_idx on public.pilot_applications (created_at desc);
create index if not exists pilot_applications_fit_idx on public.pilot_applications (fit_score desc);

-- Only the service role (server) reads or writes. No public access.
alter table public.pilot_applications enable row level security;
