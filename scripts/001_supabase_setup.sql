-- Run this file in the Supabase Dashboard SQL Editor for a new project.
-- Supabase manages auth.users; this script creates the application schema around it.

create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('Free', 'Premium', 'Traveler')),
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  features text[] not null default '{}'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan_id uuid references public.plans(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  countries text[] not null default '{}',
  cities text[] not null default '{}',
  start_date date not null,
  end_date date not null,
  people integer not null check (people > 0),
  thumbnail text,
  memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  name text not null,
  category text,
  start_time text,
  end_time text,
  address text,
  url text,
  memo text,
  cost numeric(12, 2),
  currency text,
  image text,
  timezone text,
  "order" integer not null default 0 check ("order" >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  type text not null,
  url text not null,
  uploaded_at timestamptz not null default now(),
  size bigint not null check (size >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.checklist (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique references public.trips(id) on delete cascade,
  memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans (name, description, price, features)
values
  ('Free', 'Everything you need to plan your next trip.', 0, array['Trip planning', 'Itinerary management', 'Travel documents']),
  ('Premium', 'Extra tools for frequent travelers.', 9.99, array['Everything in Free', 'AI travel planning', 'Priority support']),
  ('Traveler', 'A complete planning experience for dedicated travelers.', 19.99, array['Everything in Premium', 'Unlimited trips', 'Advanced organization'])
on conflict (name) do update
set description = excluded.description,
    price = excluded.price,
    features = excluded.features;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, plan_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    (select id from public.plans where name = 'Free')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
drop trigger if exists set_trips_updated_at on public.trips;
create trigger set_trips_updated_at before update on public.trips
  for each row execute procedure public.set_updated_at();
drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at before update on public.activities
  for each row execute procedure public.set_updated_at();
drop trigger if exists set_checklist_updated_at on public.checklist;
create trigger set_checklist_updated_at before update on public.checklist
  for each row execute procedure public.set_updated_at();
drop trigger if exists set_memos_updated_at on public.memos;
create trigger set_memos_updated_at before update on public.memos
  for each row execute procedure public.set_updated_at();

create index if not exists trips_user_id_idx on public.trips(user_id);
create index if not exists activities_trip_id_date_idx on public.activities(trip_id, date, "order");
create index if not exists documents_trip_id_idx on public.documents(trip_id);
create index if not exists checklist_trip_id_idx on public.checklist(trip_id);

alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.activities enable row level security;
alter table public.documents enable row level security;
alter table public.checklist enable row level security;
alter table public.memos enable row level security;

drop policy if exists "Authenticated users can read plans" on public.plans;
create policy "Authenticated users can read plans" on public.plans
  for select to authenticated using (true);

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile" on public.profiles
  for select to authenticated using (id = auth.uid());
drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users manage their own trips" on public.trips;
create policy "Users manage their own trips" on public.trips
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage activities for their trips" on public.activities;
create policy "Users manage activities for their trips" on public.activities
  for all to authenticated
  using (exists (select 1 from public.trips where trips.id = activities.trip_id and trips.user_id = auth.uid()))
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.trips where trips.id = activities.trip_id and trips.user_id = auth.uid())
  );

drop policy if exists "Users manage documents for their trips" on public.documents;
create policy "Users manage documents for their trips" on public.documents
  for all to authenticated
  using (exists (select 1 from public.trips where trips.id = documents.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from public.trips where trips.id = documents.trip_id and trips.user_id = auth.uid()));

drop policy if exists "Users manage checklist items for their trips" on public.checklist;
create policy "Users manage checklist items for their trips" on public.checklist
  for all to authenticated
  using (exists (select 1 from public.trips where trips.id = checklist.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from public.trips where trips.id = checklist.trip_id and trips.user_id = auth.uid()));

drop policy if exists "Users manage memos for their trips" on public.memos;
create policy "Users manage memos for their trips" on public.memos
  for all to authenticated
  using (exists (select 1 from public.trips where trips.id = memos.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from public.trips where trips.id = memos.trip_id and trips.user_id = auth.uid()));