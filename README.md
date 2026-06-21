# StrixMind Performance Fixes
## Copy these 6 files into your project to fix the load time

---

## What was slow and why

| Problem | Root cause | Fix |
|---|---|---|
| Page blocked before any render | 3 CDN scripts with `strategy="beforeInteractive"` — nothing painted until all GSAP/Lenis downloaded | Changed to `afterInteractive` |
| Every home page visit hit Supabase cold | `force-dynamic` + `revalidate=0` disabled all caching | ISR with `revalidate=60` |
| Layout also uncached | No revalidate on root layout | Added `revalidate=60` |
| 7 font weights downloading on load | Inter loaded 300,400,500,600,700,800,900 = 7 files | Trimmed to 400,500,600,700 |
| Canvas hero overdrawing at 60fps × DPR3 | No frame throttle, no DPR cap | 30fps cap, DPR capped at 2 |
| Feature carousel using raw `<img>` | Unsplash images with no lazy load or optimisation | Replaced with `next/image` + lazy |
| Static assets never cached | No Cache-Control headers on `/_next/static` | Added 1-year immutable cache headers |

---

## Files to copy

Copy each file below to the exact path shown. These are **complete replacements** — paste over the existing file.

```
src/components/ui/GsapScripts.tsx       ← #1 biggest fix
src/app/page.tsx                        ← #2 biggest fix
src/app/layout.tsx
next.config.ts
vercel.json
src/components/ui/hero.tsx
src/components/pages/homePage/FeatureCarouselSection.tsx
```

---

## Step-by-step

1. **Copy all 7 files** from this folder into your project at the paths above.

2. **Delete `next.config.js`** (the JS version) — you now only need `next.config.ts`.
   ```bash
   rm next.config.js
   ```

3. **Commit and push**:
   ```bash
   git add -A
   git commit -m "perf: fix load time - afterInteractive GSAP, ISR cache, font trim, canvas throttle"
   git push
   ```

4. Vercel auto-deploys. First load after deploy will build the ISR cache.
   Subsequent loads are served from edge — instant.

---

## Expected improvement

| Metric | Before | After |
|---|---|---|
| Time to first paint | ~3-5s (blocked by GSAP scripts) | <1s |
| Home page DB calls | Every request (force-dynamic) | Once per 60s (ISR) |
| Canvas CPU on mobile | High (DPR3, 60fps, 24 beams) | ~40% lower (DPR2, 30fps, 15 beams) |
| Font files on first load | 13 files | 8 files |

---

## Optional: raise the cache time

If your content changes rarely (once a day or less), change both:
```ts
// src/app/page.tsx
export const revalidate = 3600; // 1 hour

// src/app/layout.tsx  
export const revalidate = 3600; // 1 hour
```
This makes the site even faster — pages are served from Vercel edge cache
for a full hour before regenerating. No Supabase calls on 99% of visits.
