-- Run after 001_supabase_setup.sql on existing Supabase projects.
-- The sign-up screen loads the Free plan before a user is authenticated.

drop policy if exists "Authenticated users can read plans" on public.plans;
drop policy if exists "Anyone can read plans" on public.plans;

create policy "Anyone can read plans" on public.plans
  for select to anon, authenticated using (true);