-- Worksheets table for Mariam EDU
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor) or via Supabase CLI.

create table if not exists public.worksheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional: RLS (Row Level Security). Enable if you add auth later.
-- alter table public.worksheets enable row level security;
-- create policy "Allow read for anon" on public.worksheets for select using (true);
-- create policy "Allow insert for anon" on public.worksheets for insert with check (true);
-- create policy "Allow update for anon" on public.worksheets for update using (true);
-- create policy "Allow delete for anon" on public.worksheets for delete using (true);

comment on table public.worksheets is 'Generated worksheet content: title, level, content (markdown/LaTeX)';
