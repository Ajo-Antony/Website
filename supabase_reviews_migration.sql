-- ─────────────────────────────────────────────────────────────
-- Migration: create reviews table with admin approval workflow
-- Run this in: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  initials    text not null default '',
  role        text,
  company     text,
  quote       text not null,
  stars       int  not null default 5 check (stars between 1 and 5),
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);

-- RLS: enable
alter table public.reviews enable row level security;

-- Public can read only approved reviews (shown on site)
create policy "reviews_public_read"
  on public.reviews
  for select
  using (status = 'approved');

-- Anyone can insert (submit a review); no auth required
create policy "reviews_public_insert"
  on public.reviews
  for insert
  with check (true);

-- Authenticated admin can read all reviews (pending, approved, rejected)
create policy "reviews_admin_read"
  on public.reviews
  for select
  using (auth.role() = 'authenticated');

-- Authenticated admin can update (approve / reject)
create policy "reviews_admin_update"
  on public.reviews
  for update
  using (auth.role() = 'authenticated');

-- Authenticated admin can delete
create policy "reviews_admin_delete"
  on public.reviews
  for delete
  using (auth.role() = 'authenticated');

-- Useful index for the admin approval queue
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);
