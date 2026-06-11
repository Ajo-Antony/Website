# Deploy StrixMind to Vercel

## One-click deploy (recommended)

1. Push this project to a GitHub repository
2. Go to https://vercel.com/new
3. Import the GitHub repository
4. Set environment variables (see below)
5. Click **Deploy**

Vercel auto-detects Next.js and configures everything.

## Environment variables (set in Vercel dashboard)

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

## Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Custom domain

1. In Vercel dashboard → Project → Settings → Domains
2. Add `strixmind.ai` (or your domain)
3. Update DNS records as instructed by Vercel

## Recommended Vercel settings

- **Framework**: Next.js (auto-detected)
- **Node version**: 20.x
- **Region**: sin1 (Singapore — closest to India)
- **Build command**: `npm run build`
- **Output**: `.next`

## Image setup

Drop images in `public/images/` and reference them as `/images/...` in components.
See `IMAGE_GUIDE.md` for exact paths and sizes.
