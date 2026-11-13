-- The pilot questionnaire (/pilot/apply) also asks for annual revenue and why the business
-- should be picked. Safe to re-run.

alter table public.pilot_applications
  add column if not exists revenue    text,  -- ballpark range, e.g. "$1M to $3M"
  add column if not exists why_choose text;  -- their pitch for a spot (urgency signal)
