/**
 * icons.tsx
 * ─────────────────────────────────────────────────────────────
 * Section Designer icon library.
 *
 * A self-contained set of stroke-based line icons used exclusively
 * inside the Section Designer editor (section list + design panel).
 * Mirrors the visual language of src/components/ui/SvgIcons.tsx
 * (24×24 viewBox, currentColor stroke, rounded caps/joins) so the
 * editor feels native to the rest of the product, while keeping its
 * own scope — no emoji anywhere in this surface.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (
  content: React.ReactNode,
  { size = 18, className, strokeWidth = 1.75 }: IconProps
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {content}
  </svg>
);

/* ── Page-tab icons ─────────────────────────────────────────── */

export const IconHome = (p: IconProps) =>
  base(
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </>,
    p
  );

export const IconUserCircle = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.2 18.2a6 6 0 0 1 11.6 0" />
    </>,
    p
  );

export const IconGear = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.04A1.7 1.7 0 0 0 11.59 4.5V4.5a2 2 0 1 1 4 0v.09c0 .67.4 1.27 1.02 1.56h.04a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.04c.29.62.89 1.02 1.56 1.02H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.02Z" />
    </>,
    p
  );

/* ── Section-category icons ─────────────────────────────────── */

export const IconBanner = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M7 13.5h6" />
      <path d="M7 16h4" />
    </>,
    p
  );

export const IconLogoGrid = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </>,
    p
  );

export const IconSparkle = (p: IconProps) =>
  base(
    <>
      <path d="M12 3.5 13.5 9 19 10.5 13.5 12 12 17.5 10.5 12 5 10.5 10.5 9 12 3.5Z" />
      <path d="M19 16.5 19.7 18.3 21.5 19 19.7 19.7 19 21.5 18.3 19.7 16.5 19 18.3 18.3 19 16.5Z" />
    </>,
    p
  );

export const IconFlow = (p: IconProps) =>
  base(
    <>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7 7.2 17 7.2" />
      <path d="M6.2 8 11 16" />
      <path d="M17.8 8 13 16" />
    </>,
    p
  );

export const IconCompassTarget = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>,
    p
  );

export const IconQuote = (p: IconProps) =>
  base(
    <>
      <path d="M9.5 8.5c-2.5 0-4 1.8-4 4.2 0 2.1 1.4 3.6 3.2 3.6.4 2.1-.9 3.7-2.7 4.2" />
      <path d="M18 8.5c-2.5 0-4 1.8-4 4.2 0 2.1 1.4 3.6 3.2 3.6.4 2.1-.9 3.7-2.7 4.2" />
    </>,
    p
  );

export const IconTag = (p: IconProps) =>
  base(
    <>
      <path d="M11.7 3.5h6.8a1 1 0 0 1 1 1v6.8a1 1 0 0 1-.3.7l-8.7 8.7a1 1 0 0 1-1.4 0L3.3 14a1 1 0 0 1 0-1.4l8.7-8.7a1 1 0 0 1 .7-.4Z" />
      <circle cx="15.8" cy="8.2" r="1.3" />
    </>,
    p
  );

export const IconUsersGroup = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M15.7 14.2c2.2.2 3.9 1.9 4.3 4.3" />
    </>,
    p
  );

export const IconPaletteSwatch = (p: IconProps) =>
  base(
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6h1.9a3.4 3.4 0 0 0 3.4-3.4c0-4.5-3.9-8.2-8.7-8.2Z" />
      <circle cx="7.5" cy="11" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7.2" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.2" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16.7" cy="11" r="1.2" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const IconHelpCircle = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.1.9-1.1 1.7" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </>,
    p
  );

export const IconMegaphone = (p: IconProps) =>
  base(
    <>
      <path d="M3 11v2a1.5 1.5 0 0 0 1.5 1.5H6l1 4h2l-.7-4h2.2L17 18V6l-6.5 3.5H6A1.5 1.5 0 0 0 4.5 11H3Z" />
      <path d="M19 9.5a3 3 0 0 1 0 5" />
    </>,
    p
  );

export const IconMailEnvelope = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>,
    p
  );

export const IconBookOpen = (p: IconProps) =>
  base(
    <>
      <path d="M12 6.5c-1.6-1.3-3.7-2-6.5-2v12.5c2.8 0 4.9.7 6.5 2 1.6-1.3 3.7-2 6.5-2V4.5c-2.8 0-4.9.7-6.5 2Z" />
      <path d="M12 6.5v12.5" />
    </>,
    p
  );

export const IconHeart = (p: IconProps) =>
  base(
    <path d="M12 20s-7.5-4.6-9.7-9.2C.9 7.6 2.4 4.5 5.6 4c2-.3 3.7.7 6.4 3.5C14.7 4.7 16.4 3.7 18.4 4c3.2.5 4.7 3.6 3.3 6.8C19.5 15.4 12 20 12 20Z" />,
    p
  );

export const IconListItems = (p: IconProps) =>
  base(
    <>
      <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 6.5h12" />
      <path d="M8.5 12h12" />
      <path d="M8.5 17.5h12" />
    </>,
    p
  );

export const IconFileDoc = (p: IconProps) =>
  base(
    <>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 13h6" />
      <path d="M9 16.5h6" />
    </>,
    p
  );

/* ── Design-panel tab icons ─────────────────────────────────── */

export const IconPaintBucket = (p: IconProps) =>
  base(
    <>
      <path d="M3.5 11.5 11 4l8 8-7.5 7.5a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8Z" />
      <path d="M6.5 8 14 15.5" />
      <path d="M18.5 14.5c.9 1 1.5 1.9 1.5 2.8 0 1.1-.9 2-2 2s-2-.9-2-2c0-.9.6-1.8 1.5-2.8Z" />
    </>,
    p
  );

export const IconTypeAa = (p: IconProps) =>
  base(
    <>
      <path d="M4 17 8.2 6h1.1L13.5 17" />
      <path d="M5.3 13.5h6.7" />
      <path d="M15 17c0-1.6 1.2-2.8 3-3.2 1.2-.3 1.8-.7 1.8-1.4 0-.8-.7-1.4-1.7-1.4-.9 0-1.6.4-2 1.1" />
      <path d="M19.8 13.5V17" />
    </>,
    p
  );

export const IconLayoutGrid = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.2" />
      <rect x="13.5" y="11" width="7" height="9.5" rx="1.2" />
      <rect x="3.5" y="15" width="7" height="5.5" rx="1.2" />
    </>,
    p
  );

export const IconInfinity = (p: IconProps) =>
  base(
    <path d="M7.5 9.5a3.5 3.5 0 1 0 0 5c1.2 0 2-.7 4.5-3.7s3.3-3.8 4.5-3.8a3.5 3.5 0 1 1 0 7c-1.2 0-2-.7-4.5-3.7S9 7 7.5 9.5Z" />,
    p
  );

export const IconCarousel = (p: IconProps) =>
  base(
    <>
      <rect x="8.5" y="5" width="7" height="14" rx="1.4" />
      <path d="M5 8v8" />
      <path d="M2.5 9.2v5.6" />
      <path d="M19 8v8" />
      <path d="M21.5 9.2v5.6" />
    </>,
    p
  );

export const IconImageLandscape = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.3" cy="9.5" r="1.6" />
      <path d="M3.5 16.5 9 11l3.5 3.5L16 11l4.5 5.5" />
    </>,
    p
  );

/* ── UI action icons ────────────────────────────────────────── */

export const IconEyeOpen = (p: IconProps) =>
  base(
    <>
      <path d="M2.5 12S5.7 5.5 12 5.5 21.5 12 21.5 12 18.3 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    p
  );

export const IconEyeOff = (p: IconProps) =>
  base(
    <>
      <path d="M3.5 3.5 20.5 20.5" />
      <path d="M9.9 5.7A9.6 9.6 0 0 1 12 5.5C18.3 5.5 21.5 12 21.5 12a16 16 0 0 1-3.2 3.9" />
      <path d="M6.4 7.4C4 9 2.5 12 2.5 12s3.2 6.5 9.5 6.5c1.3 0 2.5-.3 3.5-.7" />
      <path d="M9.9 12a2.1 2.1 0 0 0 3 2.9" />
    </>,
    p
  );

export const IconClose = (p: IconProps) =>
  base(
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>,
    p
  );

export const IconCheck = (p: IconProps) =>
  base(<path d="M4.5 12.5 9.5 17.5 19.5 6.5" />, p);

export const IconPencilEdit = (p: IconProps) =>
  base(
    <>
      <path d="M4 20l.9-4 10.5-10.5a2 2 0 0 1 2.8 0l.3.3a2 2 0 0 1 0 2.8L8 19l-4 1Z" />
      <path d="M13.5 6.5 17.5 10.5" />
    </>,
    p
  );

export const IconUploadCloud = (p: IconProps) =>
  base(
    <>
      <path d="M7.5 17.5h-1A4 4 0 0 1 6 9.6 5.5 5.5 0 0 1 16.8 8a4.2 4.2 0 0 1-.8 8.3 22.6 22.6 0 0 1-1 .1" />
      <path d="M12 21v-8" />
      <path d="M9 15.3 12 12.3 15 15.3" />
    </>,
    p
  );

export const IconTrash = (p: IconProps) =>
  base(
    <>
      <path d="M4.5 7h15" />
      <path d="M9 7V5.2A1.2 1.2 0 0 1 10.2 4h3.6A1.2 1.2 0 0 1 15 5.2V7" />
      <path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
      <path d="M10.2 11v6" />
      <path d="M13.8 11v6" />
    </>,
    p
  );

export const IconSpinner = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`animate-spin ${className ?? ""}`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconAlignLeft = (p: IconProps) =>
  base(
    <>
      <path d="M4 6h16" />
      <path d="M4 11h10" />
      <path d="M4 16h14" />
      <path d="M4 21h7" />
    </>,
    p
  );

export const IconAlignCenter = (p: IconProps) =>
  base(
    <>
      <path d="M4 6h16" />
      <path d="M7 11h10" />
      <path d="M5.5 16h13" />
      <path d="M8.5 21h7" />
    </>,
    p
  );

export const IconAlignRight = (p: IconProps) =>
  base(
    <>
      <path d="M4 6h16" />
      <path d="M10 11h10" />
      <path d="M6 16h14" />
      <path d="M13 21h7" />
    </>,
    p
  );

export const IconArrowLeft = (p: IconProps) =>
  base(
    <>
      <path d="M19 12H5" />
      <path d="M10.5 6.5 5 12l5.5 5.5" />
    </>,
    p
  );

export const IconArrowRight = (p: IconProps) =>
  base(
    <>
      <path d="M5 12h14" />
      <path d="M13.5 6.5 19 12l-5.5 5.5" />
    </>,
    p
  );

export const IconDragHandle = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const IconRotateLeft = (p: IconProps) =>
  base(
    <>
      <path d="M4 5v5h5" />
      <path d="M4.6 14a8 8 0 1 0 1.7-8.5L4 10" />
    </>,
    p
  );

export const IconArrowsUpDown = (p: IconProps) =>
  base(
    <>
      <path d="M8 7 8 17" />
      <path d="M5 10 8 7 11 10" />
      <path d="M16 17 16 7" />
      <path d="M13 14 16 17 19 14" />
    </>,
    p
  );

/* ── Section-key → icon lookup ──────────────────────────────── */

export const SECTION_ICON_MAP: Record<string, (p: IconProps) => React.ReactElement> = {
  "home.hero":         IconBanner,
  "home.trustedBy":    IconLogoGrid,
  "home.services":     IconGear,
  "home.whyUs":        IconSparkle,
  "home.mission":      IconCompassTarget,
  "home.testimonials": IconQuote,
  "home.pricing":      IconTag,
  "home.team":         IconUsersGroup,
  "home.brand":        IconPaletteSwatch,
  "home.faq":          IconHelpCircle,
  "home.cta":          IconMegaphone,
  "home.contact":      IconMailEnvelope,
  "about.hero":        IconBanner,
  "about.story":       IconBookOpen,
  "about.values":      IconHeart,
  "about.team":        IconUsersGroup,
  "services.hero":     IconBanner,
  "services.list":     IconListItems,
  "services.cta":      IconMegaphone,
};

export function getSectionIcon(key: string) {
  return SECTION_ICON_MAP[key] ?? IconFileDoc;
}
