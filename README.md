# StrixMind — Sign In / Sign Up Update

Drop this folder's contents into your project root (it mirrors your repo's
folder structure, so paths line up automatically) and commit.

## Files in this update
- `src/lib/utils/site-url.ts` — new
- `src/lib/actions/customerAuth.ts` — new (public sign-up/sign-in/OAuth/sign-out)
- `src/app/login/page.tsx` — new
- `src/app/signup/page.tsx` — new
- `src/app/account/page.tsx` — new (protected landing page after sign-in)
- `src/app/auth/callback/route.ts` — new (OAuth + email-confirmation handler)
- `src/app/auth/auth-code-error/page.tsx` — new
- `src/components/auth/OAuthButtons.tsx` — new (Google + Microsoft buttons)
- `src/components/ui/site-header.tsx` — changed (Sign in → `/login`)
- `middleware.ts` — changed (now also guards `/account`, `/login`, `/signup`)
- `sql/003_customer_profiles.sql` — new (run in Supabase SQL Editor)

## One manual step: add an env var
In your project's `.env.local` (and in Vercel → Settings → Environment
Variables for Production), add:

```
NEXT_PUBLIC_SITE_URL=https://strixmind.ai
```

(For local dev, `.env.local` can use `http://localhost:3000` instead.)

## Then follow AUTH_SETUP.md
That file walks through the three external dashboards you need to touch —
Supabase Auth settings, Google Cloud Console, and Azure App registration —
to make Google and Microsoft sign-in actually work. The code is already
build-tested and ready; those are the only steps left.
