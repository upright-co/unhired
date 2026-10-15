-- Follow-up emails after the assessment report, plus the unsubscribe that CASL requires.
-- Safe to re-run.

alter table public.assessments
  add column if not exists follow_up_step     integer not null default 0, -- follow-ups sent so far
  add column if not exists follow_up_sent_at  timestamptz,                -- when the latest one went out
  add column if not exists follow_ups_stopped text,                       -- why the sequence ended early: 'unsubscribed' | 'stopped_by_brandon' | 'superseded' (a newer report from the same email)
  add column if not exists unsubscribed_at    timestamptz,
  add column if not exists alerted_at         timestamptz;                -- new-lead alert sent to Brandon

-- The daily run only looks at completed reports whose sequence is still going.
create index if not exists assessments_follow_up_due_idx
  on public.assessments (consent_at)
  where status = 'completed' and follow_ups_stopped is null;
