-- Pilot applications: monthly AI budget the applicant expects for 2027 (friction + fit signal).
alter table public.pilot_applications add column if not exists budget text;
