// src/lib/types/sectionDesigner.ts
// ─────────────────────────────────────────────────────────────
// Types for the Section Designer feature.
// Every section on the public site can have a DesignSettings
// object that controls its visual appearance independently.
// ─────────────────────────────────────────────────────────────

export type BackgroundType =
  | "solid"        // flat colour
  | "gradient"     // two-colour gradient
  | "pattern"      // repeating CSS pattern
  | "image";       // uploaded/URL image

export type PatternType =
  | "dots"
  | "grid"
  | "diagonal"
  | "zigzag"
  | "waves"
  | "hexagon"
  | "crosshatch"
  | "circles";

export type GradientDirection =
  | "to bottom"
  | "to right"
  | "to bottom right"
  | "to bottom left"
  | "135deg"
  | "45deg";

export type MarqueeSpeed = "slow" | "medium" | "fast";
export type SliderType   = "fade" | "slide" | "none";
export type TextAlign    = "left" | "center" | "right";
export type SectionWidth = "full" | "wide" | "contained" | "narrow";

export interface DesignSettings {
  // ── Background ─────────────────────────────────────────────
  bgType?:            BackgroundType;
  bgColor?:           string;           // hex
  bgGradientFrom?:    string;
  bgGradientTo?:      string;
  bgGradientDir?:     GradientDirection;
  bgPattern?:         PatternType;
  bgPatternColor?:    string;           // hex, overlay colour for pattern
  bgPatternOpacity?:  number;           // 0-1
  bgImage?:           string;           // URL
  bgImageOpacity?:    number;           // 0-1

  // ── Text ───────────────────────────────────────────────────
  textColor?:         string;
  headingColor?:      string;
  accentColor?:       string;
  textAlign?:         TextAlign;

  // ── Layout ─────────────────────────────────────────────────
  sectionWidth?:      SectionWidth;
  paddingTop?:        number;           // rem
  paddingBottom?:     number;           // rem

  // ── Marquee ────────────────────────────────────────────────
  enableMarquee?:     boolean;
  marqueeSpeed?:      MarqueeSpeed;
  marqueeDirection?:  "left" | "right";
  marqueePauseHover?: boolean;

  // ── Slider / Carousel ──────────────────────────────────────
  enableSlider?:      boolean;
  sliderType?:        SliderType;
  sliderAutoplay?:    boolean;
  sliderInterval?:    number;           // ms

  // ── Section images ─────────────────────────────────────────
  images?:            SectionImage[];

  // ── Border / Divider ───────────────────────────────────────
  borderTop?:         boolean;
  borderBottom?:      boolean;
  borderColor?:       string;
  roundedCorners?:    boolean;

  // ── Custom CSS class override ───────────────────────────────
  customClass?:       string;
}

export interface SectionImage {
  id:      string;
  url:     string;
  alt?:    string;
  caption?: string;
  position?: "background" | "left" | "right" | "top" | "bottom";
}

export interface SectionDesign {
  id:          string;
  section_key: string;
  page:        string;
  label:       string;
  sort_order:  number;
  is_visible:  boolean;
  design:      DesignSettings;
  created_at:  string;
  updated_at:  string;
}

export interface SectionDesignUpdate {
  is_visible?: boolean;
  sort_order?: number;
  design?:     DesignSettings;
}

// Maps section_key → component display info
export interface SectionMeta {
  key:   string;
  label: string;
  page:  string;
  icon:  string;
}
