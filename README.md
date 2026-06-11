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
