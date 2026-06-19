# Section Designer — Editor Redesign

Drop-in replacement files. Copy these into your project at the matching paths
(overwriting the originals), commit, and redeploy.

## Files in this package

- `src/components/pages/adminPage/SectionDesigner/icons.tsx` — NEW
  Dedicated stroke-based SVG icon set for the editor (section categories,
  panel tabs, and UI actions). Nothing here is an emoji.

- `src/components/pages/adminPage/SectionDesigner/SectionDesignerClient.tsx` — MODIFIED
  - Page switcher (Home/About/Services) is now a real segmented control with
    icons instead of emoji-labelled buttons.
  - Each section row gets a tinted icon badge matched to its category
    (hero, services, FAQ, etc.) instead of a raw emoji glyph.
  - "Styled" / "Hidden" badges, the Design button, the visibility toggle,
    and the toast notifications all use SVG icons now.
  - Legend at the bottom is a single tidy status bar.

- `src/components/pages/adminPage/SectionDesigner/DesignPanel.tsx` — MODIFIED
  - The six section tabs (Background, Typography, Layout, Marquee, Slider,
    Images) are now a compact icon rail, Figma/Canva-style, with the active
    tab's name shown as a heading above the panel content.
  - Alignment controls, marquee direction, upload buttons, close/save/reset
    buttons — all emoji replaced with icons, including a proper spinner for
    loading states.

- `src/components/pages/adminPage/AdminShell.tsx` — MODIFIED
  Sidebar nav: the Section Designer item used a 🎨 emoji while every other
  item used an SVG icon — that's fixed, plus "↗ View site" now uses a real
  external-link icon.

- `src/components/ui/SvgIcons.tsx` — MODIFIED (additive only)
  Added `IconPalette` and `IconExternalLink` so AdminShell can be fully
  emoji-free. Nothing existing was changed or removed.

No logic, data shapes, or server actions were touched — this is a visual-only
pass. Verified with `tsc --noEmit` (zero errors).
