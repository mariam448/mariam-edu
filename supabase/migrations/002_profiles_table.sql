-- profiles: columns used by app/register/page.tsx upsert
-- Run in Supabase SQL Editor if upsert fails (missing column / RLS).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  email text,
  school text,
  level text,
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists school text;
alter table public.profiles add column if not exists level text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Drop legacy column name if you migrated from teaching_level → level
-- alter table public.profiles drop column if exists teaching_level;

comment on column public.profiles.level is 'Selector value: 1ac, 2ac, 3ac, 1ac-2ac, 2ac-3ac, all';
