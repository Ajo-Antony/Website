-- ============================================================
-- StrixMind: Work section schema (Gallery, Blog, Projects)
-- Run this once in your Supabase project's SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- GALLERY ----------
create table if not exists gallery_images (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  storage_path text not null,
  caption      text,
  alt          text,
  sort_order   integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------- BLOG ----------
create table if not exists blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text not null default '',
  cover_image   text,
  published     boolean not null default true,
  published_at  timestamptz default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  client       text,
  category     text,
  year         text,
  status       text not null default 'completed', -- completed | in-progress | coming-soon
  summary      text,
  description  text default '',
  cover_image  text,
  tags         text[] default '{}',
  results      jsonb default '[]', -- [{ "label": "...", "value": "..." }]
  link         text,
  featured     boolean not null default false,
  published    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------
alter table gallery_images enable row level security;
alter table blog_posts     enable row level security;
alter table projects       enable row level security;

-- Public (anon) can read only published rows
create policy "public_read_gallery"  on gallery_images for select using (published = true);
create policy "public_read_blog"     on blog_posts     for select using (published = true);
create policy "public_read_projects" on projects       for select using (published = true);

-- Any authenticated user can fully manage content.
-- IMPORTANT: do not build/enable public sign-up in this app — create your
-- one admin user manually in Supabase Dashboard > Authentication > Users.
create policy "admin_all_gallery"  on gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_all_blog"     on blog_posts     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_all_projects" on projects       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- SITE CONTENT (generic CMS for every page's text/images) ----------
create table if not exists site_content (
  key         text primary key,
  value       jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "public_read_site_content" on site_content for select using (true);
create policy "admin_all_site_content"   on site_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- STORAGE BUCKET ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public_read_media"  on storage.objects for select using (bucket_id = 'media');
create policy "admin_upload_media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin_delete_media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
