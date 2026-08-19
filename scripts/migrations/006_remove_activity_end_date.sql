-- Run after migration 005 to return activities to a single-date schedule model.

alter table public.activities
  drop column if exists end_date;