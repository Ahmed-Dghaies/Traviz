-- Run after the previous migrations to store activity end dates and remove timezones.

alter table public.activities
  add column if not exists end_date date;

update public.activities
set end_date = date
where end_date is null;

alter table public.activities
  alter column end_date set not null,
  alter column end_date set default current_date,
  drop column if exists timezone;