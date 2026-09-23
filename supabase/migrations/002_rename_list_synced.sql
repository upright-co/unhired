-- Renames the provider-specific column after the switch from Brevo to Resend.
-- Safe to re-run: does nothing if 001 already used the new name.
alter table public.assessments rename column brevo_synced_at to list_synced_at;
