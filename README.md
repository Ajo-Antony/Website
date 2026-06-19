# StrixMind — Next.js Website

## Folder Structure

```
strixmind/
├── public/
│   └── images/
│       ├── hero/         ← Drop hero/banner images here
│       ├── team/         ← Team member photos here
│       ├── services/     ← Service section images here
│       ├── gallery/      ← Gallery/showcase images here
│       └── clients/      ← Client logos here
│
├── src/
│   ├── app/              ← Next.js App Router pages
│   │   ├── page.tsx      ← Home page
│   │   ├── layout.tsx    ← Root layout
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   └── blog/
│   │
│   ├── components/
│   │   ├── commonSharedComponents/
│   │   │   ├── NavbarCommonSharedComponent.tsx
│   │   │   └── FooterCommonSharedComponent.tsx
│   │   └── pages/
│   │       ├── homePage/
│   │       ├── aboutPage/
│   │       ├── servicesPage/
│   │       └── contactPage/
│   │
│   ├── lib/              ← Utility functions, API helpers
│   ├── hooks/            ← Custom React hooks
│   ├── types/            ← TypeScript interfaces
│   ├── styles/           ← Global CSS / design tokens
│   └── supabase/         ← Supabase client config
```

## Adding Images

Simply drop image files into the relevant folder under `public/images/`:
- Hero backgrounds → `public/images/hero/`
- Team photos → `public/images/team/`
- Then reference them as `/images/team/your-photo.jpg`

## Getting Started

```bash
npm install
npm run dev
```

## Admin Dashboard & "Work" Section (Gallery / Blog / Projects)

There's now a real, login-protected admin dashboard at `/admin` for managing
the Gallery, Blog, and Projects shown publicly at `/work`. It's backed by
Supabase (database + auth + file storage).

### 1. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com) if you don't have one.
2. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API).
3. Open the Supabase SQL Editor, paste the contents of `supabase/schema.sql`, and run it. This creates the `gallery_images`, `blog_posts`, and `projects` tables, sets up Row Level Security, and creates a public `media` storage bucket for uploaded images.

### 2. Create your admin login

This app has **no public sign-up form** — that's intentional, since anyone who
can authenticate gets full write access to your content. Create your one
admin account manually:

1. Supabase Dashboard → Authentication → Users → **Add user**.
2. Enter your email and a password. Confirm the email (or disable email confirmation in Auth settings) so you can log in immediately.
3. Go to **Authentication → Settings** and turn **off** "Enable email signups" so no one else can create an account.

### 3. Log in

Visit `/admin/login` with the email/password you just created. From there
you can:
- **Gallery** — upload images with an optional caption, hide/show or delete them.
- **Blog** — write posts in Markdown, set a cover image, publish/unpublish.
- **Projects** — add case studies (client, category, year, status, tags, results, cover image), mark as Featured to show on the `/work` homepage.

Everything you publish shows up live at `/work`, `/work/gallery`, `/work/blog`,
and `/work/projects` — no redeploy needed.

