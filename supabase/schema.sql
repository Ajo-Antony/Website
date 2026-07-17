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
  media_type   text not null default 'image',
  show_on_home boolean not null default false,
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

-- ---------- BOOKINGS (demo booking form on /booking) ----------
create table if not exists bookings (
  id          uuid primary key default gen_random_uuid(),
  slot        text not null,             -- e.g. "Mon 9:00 AM"
  name        text not null,
  email       text not null,
  company     text,
  size        text,                      -- "1–10" | "11–50" | "51–200" | "200+"
  goal        text,
  status      text not null default 'new', -- new | contacted | scheduled | closed
  created_at  timestamptz not null default now()
);

alter table bookings enable row level security;

-- Anyone (anon, from the public booking form) can create a booking.
create policy "public_insert_bookings" on bookings for insert with check (true);

-- Only authenticated admins can read/update/delete bookings.
create policy "admin_read_bookings"   on bookings for select using (auth.role() = 'authenticated');
create policy "admin_update_bookings" on bookings for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_delete_bookings" on bookings for delete using (auth.role() = 'authenticated');

create index if not exists bookings_created_at_idx on bookings (created_at desc);

-- ---------- LIKES & COMMENTS (NEW ENHANCEMENTS) ----------

-- Blog Likes Table
create table if not exists blog_likes (
  id          uuid primary key default gen_random_uuid(),
  blog_id     uuid not null references blog_posts(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  session_id  text not null,
  created_at  timestamptz not null default now(),
  constraint unique_blog_user_like unique (blog_id, user_id),
  constraint unique_blog_session_like unique (blog_id, session_id)
);

-- Blog Comments Table
create table if not exists blog_comments (
  id          uuid primary key default gen_random_uuid(),
  blog_id     uuid not null references blog_posts(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  author_name text not null,
  content     text not null,
  approved    boolean not null default true,
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Gallery Likes Table
create table if not exists gallery_likes (
  id               uuid primary key default gen_random_uuid(),
  gallery_image_id uuid not null references gallery_images(id) on delete cascade,
  user_id          uuid references auth.users(id) on delete set null,
  session_id       text not null,
  created_at       timestamptz not null default now(),
  constraint unique_gallery_user_like unique (gallery_image_id, user_id),
  constraint unique_gallery_session_like unique (gallery_image_id, session_id)
);

-- Gallery Comments Table
create table if not exists gallery_comments (
  id               uuid primary key default gen_random_uuid(),
  gallery_image_id uuid not null references gallery_images(id) on delete cascade,
  user_id          uuid references auth.users(id) on delete set null,
  author_name      text not null,
  content          text not null,
  approved         boolean not null default true,
  hidden           boolean not null default false,
  created_at       timestamptz not null default now()
);

alter table blog_likes enable row level security;
alter table blog_comments enable row level security;
alter table gallery_likes enable row level security;
alter table gallery_comments enable row level security;

-- Blog Likes Policies
create policy "Anyone can view blog likes" on blog_likes for select using (true);
create policy "Anyone can insert blog likes" on blog_likes for insert with check (true);
create policy "Anyone can delete own blog likes" on blog_likes for delete using (true);

-- Blog Comments Policies
create policy "Anyone can view blog comments" on blog_comments for select using (true);
create policy "Anyone can insert blog comments" on blog_comments for insert with check (true);
create policy "Admins can update any blog comments" on blog_comments for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can delete any blog comments" on blog_comments for delete using (auth.role() = 'authenticated');

-- Gallery Likes Policies
create policy "Anyone can view gallery likes" on gallery_likes for select using (true);
create policy "Anyone can insert gallery likes" on gallery_likes for insert with check (true);
create policy "Anyone can delete own gallery likes" on gallery_likes for delete using (true);

-- Gallery Comments Policies
create policy "Anyone can view gallery comments" on gallery_comments for select using (true);
create policy "Anyone can insert gallery comments" on gallery_comments for insert with check (true);
create policy "Admins can update any gallery comments" on gallery_comments for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can delete any gallery comments" on gallery_comments for delete using (auth.role() = 'authenticated');

create index if not exists blog_likes_blog_id_idx on blog_likes (blog_id);
create index if not exists blog_comments_blog_id_idx on blog_comments (blog_id);
create index if not exists gallery_likes_gallery_image_id_idx on gallery_likes (gallery_image_id);
create index if not exists gallery_comments_gallery_image_id_idx on gallery_comments (gallery_image_id);
