-- Unhired: AI Hire Assessment storage
-- Run in the Supabase SQL editor (or `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists public.assessments (
  -- Random v4 UUID: also the unguessable id in /report/[id]
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- draft = report generated, email not yet given; completed = email gate passed
  status           text not null default 'draft' check (status in ('draft', 'completed')),

  role_title       text not null,
  industry         text,
  team_size        text,
  description      text,
  answers          jsonb,          -- { answers: [{id, question, answer}], budget: {amount, period} | null }
  report           jsonb,          -- AI Employee Opportunity Report (see src/lib/schemas.ts)
  coverage_percent integer check (coverage_percent between 0 and 100),

  email            text,
  first_name       text,
  business         text,
  phone            text,
  consent_text     text,           -- exact consent wording shown (CASL express consent)
  consent_at       timestamptz,    -- when consent was given

  utm_source       text,
  utm_medium       text,
  utm_campaign     text,

  email_sent_at    timestamptz,    -- report email delivered to Brevo
  brevo_synced_at  timestamptz     -- contact added to Brevo list
);

create index if not exists assessments_created_at_idx on public.assessments (created_at desc);
create index if not exists assessments_email_idx on public.assessments (lower(email));
create index if not exists assessments_status_idx on public.assessments (status);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assessments_set_updated_at on public.assessments;
create trigger assessments_set_updated_at
  before update on public.assessments
  for each row execute function public.set_updated_at();

-- Per-IP rate limiting for the assessment API (IPs are stored as salted hashes).
create table if not exists public.rate_limit_hits (
  id         bigint generated always as identity primary key,
  key        text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_hits_key_created_idx on public.rate_limit_hits (key, created_at desc);

-- Lock both tables down. The app uses the service-role key server-side, which bypasses RLS.
-- No policies = no access for the anon/authenticated keys.
alter table public.assessments enable row level security;
alter table public.rate_limit_hits enable row level security;
