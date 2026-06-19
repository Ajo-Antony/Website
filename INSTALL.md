# 🎨 Section Designer — Installation Guide

## What this feature adds

A full visual Section Designer in your admin panel at `/admin/section-designer`:

- **Drag-and-drop reordering** of page sections
- **Hide / show toggle** per section (eye icon)
- **Per-section design controls:**
  - Background: Solid colour / Gradient (with presets) / Pattern (8 styles) / Image
  - Typography: Text colour, heading colour, accent colour, text alignment
  - Layout: Section width, padding top/bottom, borders, rounded card style
  - Marquee: Enable infinite scroll, speed (slow/medium/fast), direction, pause on hover
  - Slider: Enable carousel, fade or slide transition, autoplay with interval
  - Images: Upload images to attach to a section (stored in Supabase `media` bucket)

---

## Step 1 — Run the database migration

Go to your **Supabase SQL Editor** and paste + run the contents of:

```
sql/001_section_designer.sql
```

This creates the `section_designs` table and seeds initial rows for all home/about/services sections.

---

## Step 2 — Copy new files into your project

Copy these files into your Next.js project (maintaining their paths):

```
src/lib/types/sectionDesigner.ts
  → Types for DesignSettings, SectionDesign, etc.

src/lib/actions/sectionDesigner.ts
  → Server actions: getSectionDesigns, toggleSectionVisibility,
    updateSectionDesign, reorderSections, uploadSectionImage

src/app/admin/section-designer/page.tsx
  → Admin route: /admin/section-designer

src/components/pages/adminPage/SectionDesigner/SectionDesignerClient.tsx
  → Drag-and-drop list with visibility toggles

src/components/pages/adminPage/SectionDesigner/DesignPanel.tsx
  → Full design control panel (6 tabs)

src/components/pages/homePage/SectionWrapper.tsx
  → Applies design settings to each section on the public page
```

---

## Step 3 — Replace existing files

**Replace** these existing files with the updated versions:

```
src/components/pages/adminPage/AdminShell.tsx
  → Adds "🎨 Section Designer" link to the sidebar nav

src/app/page.tsx
  → Updated to fetch section designs and wrap each section
    in <SectionWrapper> (handles visibility + design)
```

---

## Step 4 — Add CSS to globals.css

Append the contents of `GLOBALS_CSS_ADDITION.css` to your:

```
src/app/globals.css
```

This adds the `@keyframes marquee-scroll` animation and slider CSS.

---

## Step 5 — Install no extra dependencies

This feature uses:
- **HTML5 Drag and Drop API** (built in, no npm package needed)
- **Supabase** (already in your project)
- **React `useTransition`** (already in React 18+)

---

## How it works

### Public site (`src/app/page.tsx`)
The home page now:
1. Fetches `section_designs` rows from Supabase (one query, sorted by `sort_order`)
2. Renders sections **in that order** (respecting admin drag-and-drop)
3. Wraps each section in `<SectionWrapper>` which:
   - Returns `null` if `is_visible = false` (hidden sections don't render)
   - Applies background styles, padding, borders inline
   - Passes CSS variables for marquee animation speed/direction

### Admin (`/admin/section-designer`)
- **Left panel**: Sortable list of sections with drag handles, order badges, visibility toggles, "Design" buttons
- **Right panel** (slides in): 6-tab DesignPanel for the selected section
  - Changes auto-preview in the small preview box
  - "Save Design" upserts to Supabase and calls `revalidatePath` to update the public site

### Database
```sql
section_designs
  id            uuid PK
  section_key   text UNIQUE  -- "home.hero", "home.services", etc.
  page          text         -- "home", "about", "services"
  label         text         -- "Hero", "Services", etc.
  sort_order    integer      -- drag-and-drop position
  is_visible    boolean      -- show/hide on public site
  design        jsonb        -- DesignSettings object
  created_at    timestamptz
  updated_at    timestamptz
```

---

## Extending to About / Services pages

To apply section designs on other pages (about, services), wrap their sections the same way as `page.tsx`:

```tsx
// src/app/about/page.tsx
import { getSectionDesigns } from "@/lib/actions/sectionDesigner";
import SectionWrapper from "@/components/pages/homePage/SectionWrapper";

const designs = await getSectionDesigns("about");
const sectionMap = Object.fromEntries(designs.map(s => [s.section_key, s]));

// Then wrap each section:
<SectionWrapper sectionKey="about.hero" design={sectionMap["about.hero"]?.design} isVisible={sectionMap["about.hero"]?.is_visible !== false}>
  <AboutPageHeroSection {...heroProps} />
</SectionWrapper>
```

---

## Marquee usage in section components

When `enableMarquee` is set, the `SectionWrapper` adds the class `section-marquee-enabled`
and sets `--marquee-speed` and `--marquee-direction` CSS variables.

Your section components can opt in by adding the `marquee-wrapper` and `marquee-track` classes:

```tsx
<div className="marquee-wrapper">
  <div className="marquee-track">
    {/* duplicate items for seamless loop */}
    {items.concat(items).map((item, i) => <div key={i}>{item}</div>)}
  </div>
</div>
```

The `TrustedByHomePageSection` (logos strip) is a natural candidate for marquee mode.
