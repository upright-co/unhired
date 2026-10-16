-- Where each assessment lead first came from, captured in the browser (src/lib/utm.ts)
-- alongside the existing utm_* columns. Safe to re-run.

alter table public.assessments
  add column if not exists referrer     text,  -- host of the external site that sent the first visit; null = direct
  add column if not exists landing_path text;  -- first page they landed on, e.g. /blog/ai-receptionist
