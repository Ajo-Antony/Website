# StrixMind Brand Update — Integration Guide

## What changed

### New files (add these to your project)

| File | What it does |
|------|-------------|
| `src/components/ui/StrixmindLogo.tsx` | SVG logo component — `StrixmindIcon`, `StrixmindWordmark`, default lockup |
| `src/components/pages/homePage/BrandIdentitySection.tsx` | New brand/identity page section from the PDF |

### Updated files (replace existing with these)

| File | Change summary |
|------|---------------|
| `src/app/globals.css` | Brand tokens: `--brand-blue #0063E5`, `--brand-deep #003E8F`, `--brand-light #6aabff` replaces old teal vars |
| `src/app/layout.tsx` | Dark body bg `#051A1C`, updated metadata keywords |
| `src/app/page.tsx` | Adds `<BrandIdentitySection />` between Pricing and FAQ |
| `tailwind.config.ts` | Brand colour extensions: `brand-blue`, `brand-deep`, `brand-light`, `brand-black`, `site-dark` |
| `src/components/ui/StrixmindLogo.tsx` | (new) |
| `src/components/pages/commonSharedComponents/NavbarCommonSharedComponent.tsx` | Dark glass nav, real SVG logo, blue CTA |
| `src/components/pages/commonSharedComponents/FooterCommonSharedComponent.tsx` | Dark footer with real logo, "Brand Identity" link added |
| `src/components/pages/homePage/HeroHomePageSection.tsx` | Real logo SVG, blue accent `#0063E5` replaces teal |
| `src/components/pages/homePage/FeaturesHomePageSection.tsx` | Blue palette (`#0063E5`, `rgba(0,99,229,…)`) |
| `src/components/pages/homePage/DemoHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/WorkflowHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/TrustedByHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/TestimonialsHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/PricingHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/FaqHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/CtaBannerHomePageSection.tsx` | Blue palette |
| `src/components/pages/homePage/ContactHomePageSection.tsx` | Blue palette |

---

## Logo component usage

```tsx
import StrixmindLogo, { StrixmindIcon, StrixmindWordmark } from "@/components/ui/StrixmindLogo";

// Full lockup (icon + wordmark) — dark theme
<StrixmindLogo size={36} variant="full" theme="dark" />

// Icon only
<StrixmindIcon size={32} theme="dark" />

// Wordmark only  
<StrixmindWordmark height={22} theme="dark" />
```

---

## Brand colour palette (from Strixmind_updated_branding.pdf)

| Token | Hex | Usage |
|-------|-----|-------|
| Intelligence Blue | `#0063E5` | Primary CTAs, accent text, active states |
| Deep Blue | `#003E8F` | Hover states, depth shadows |
| Light Blue | `#6aabff` | Text on dark backgrounds, secondary accents |
| Strixmind Black | `#212121` | Logo text, headings on white |
| Site Dark | `#051A1C` | Hero bg, footer, dark sections |

---

## Brand Identity section

The new `BrandIdentitySection` is placed **between Pricing and FAQ** on the homepage (`#brand` anchor). It includes:

- Dark / light logo variants side-by-side
- Full wordmark in both themes + size scale
- Connected node logo with symbolism breakdown
- Logo at 72px / 56px / 40px on dark bg
- Brand colour swatches (#212121, #0063E5, #003E8F)
- Design concept copy from the PDF
- "Future-ready identity" conclusion block with 5 design attributes

---

## Page order (src/app/page.tsx)

```
HeroHomePageSection        ← dark, full-bleed, logo in navbar
TrustedByHomePageSection   ← logo strip
FeaturesHomePageSection    ← 6-card grid
DemoHomePageSection        ← 2-col: copy + live dashboard card
WorkflowHomePageSection    ← 4-step how-it-works
TestimonialsHomePageSection ← 3 testimonial cards
PricingHomePageSection     ← 3 pricing tiers
BrandIdentitySection       ← NEW: logo + branding showcase
FaqHomePageSection         ← accordion
CtaBannerHomePageSection   ← dark CTA banner
ContactHomePageSection     ← contact form
```

---

## Files NOT in this update (unchanged from your repo)

- `src/app/about/`, `src/app/booking/`, `src/app/services/`, `src/app/contact/`
- `src/components/pages/aboutPage/*`
- `src/components/pages/bookingPage/*`
- `src/components/pages/servicesPage/*`
- `src/components/pages/contactPage/*`
- `src/hooks/`, `src/lib/`, `src/supabase/`, `src/types/`
- `next.config.ts`, `postcss.config.js`, `tsconfig.json`

---

## Apply to your other pages (booking, contact, services, about)

Replace any occurrence of:
- `#0A5C68` → `#0063E5`
- `#0e7a8a` → `#0052c2`  
- `#14b8a6` → `#6aabff`
- `rgba(10,92,104,` → `rgba(0,99,229,`
- The old diamond SVG in navbar → `<StrixmindIcon size={22} theme="dark" />`
