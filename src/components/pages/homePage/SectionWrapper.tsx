/**
 * SectionWrapper.tsx
 * ─────────────────────────────────────────────────────────────
 * Wraps every public section component and applies the design
 * settings stored in Supabase (colours, gradients, patterns,
 * bg images, padding, borders, marquee, slider CSS variables).
 *
 * USAGE in page.tsx:
 *
 *   <SectionWrapper sectionKey="home.hero" design={designs["home.hero"]}>
 *     <HeroHomePageSection {...heroProps} />
 *   </SectionWrapper>
 *
 * If design is null/undefined (section not in DB or defaults)
 * the wrapper renders transparently without any style overrides.
 * ─────────────────────────────────────────────────────────────
 */

import type { SectionDesign, DesignSettings, PatternType } from "@/lib/types/sectionDesigner";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  sectionKey: string;
  design?: DesignSettings | null;
  isVisible?: boolean;
  children: ReactNode;
}

export default function SectionWrapper({ sectionKey, design, isVisible = true, children }: Props) {
  // Section hidden in admin → render nothing on public site
  if (!isVisible) return null;
  // No custom design → render children as-is
  if (!design || Object.keys(design).length === 0) return <>{children}</>;

  const wrapperStyle = buildSectionStyle(design);
  const containerClass = buildContainerClass(design);
  const wrapperClass = buildWrapperClass(design);

  // Marquee CSS variables
  const marqueeVars = design.enableMarquee
    ? ({
        "--marquee-speed": design.marqueeSpeed === "fast" ? "15s" : design.marqueeSpeed === "slow" ? "40s" : "25s",
        "--marquee-direction": design.marqueeDirection === "right" ? "reverse" : "normal",
      } as CSSProperties)
    : {};

  return (
    <div
      className={`relative ${wrapperClass}`}
      style={{ ...wrapperStyle, ...marqueeVars }}
      data-section={sectionKey}
    >
      {/* Background image overlay (handles opacity) */}
      {design.bgType === "image" && design.bgImage && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${design.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: design.bgImageOpacity ?? 1,
          }}
        />
      )}

      {/* Section content */}
      <div className={`relative z-10 ${containerClass}`}>
        {children}
      </div>
    </div>
  );
}

// ── Build inline style ─────────────────────────────────────────
function buildSectionStyle(d: DesignSettings): CSSProperties {
  const style: CSSProperties = {};

  // Padding
  if (d.paddingTop    !== undefined) style.paddingTop    = `${d.paddingTop}rem`;
  if (d.paddingBottom !== undefined) style.paddingBottom = `${d.paddingBottom}rem`;

  // Text colours (CSS vars so they cascade into children)
  if (d.textColor)    style.color = d.textColor;
  if (d.textAlign)    style.textAlign = d.textAlign;

  // Border
  if ((d.borderTop || d.borderBottom) && d.borderColor) {
    if (d.borderTop)    style.borderTop    = `1px solid ${d.borderColor}`;
    if (d.borderBottom) style.borderBottom = `1px solid ${d.borderColor}`;
  }
  if (d.roundedCorners) {
    style.borderRadius = "1.5rem";
    style.overflow = "hidden";
    style.margin = "0 1rem";
  }

  // Background
  const bgType = d.bgType ?? "solid";

  if (bgType === "solid" && d.bgColor) {
    style.backgroundColor = d.bgColor;
  } else if (bgType === "gradient" && (d.bgGradientFrom || d.bgGradientTo)) {
    const dir = d.bgGradientDir ?? "to bottom";
    style.background = `linear-gradient(${dir}, ${d.bgGradientFrom ?? "#ffffff"}, ${d.bgGradientTo ?? "#f3f4f6"})`;
  } else if (bgType === "pattern") {
    if (d.bgColor) style.backgroundColor = d.bgColor;
    const pc = d.bgPatternColor ?? "#6c63ff";
    const po = Math.round((d.bgPatternOpacity ?? 0.15) * 255).toString(16).padStart(2, "0");
    const col = `${pc}${po}`;
    const patternMap: Record<PatternType, string> = {
      dots:       `radial-gradient(circle, ${col} 1.5px, transparent 1.5px)`,
      grid:       `linear-gradient(${col} 1px, transparent 1px), linear-gradient(90deg, ${col} 1px, transparent 1px)`,
      diagonal:   `repeating-linear-gradient(45deg, ${col} 0, ${col} 1px, transparent 0, transparent 50%)`,
      zigzag:     `repeating-linear-gradient(135deg, ${col} 0, ${col} 2px, transparent 0, transparent 10px)`,
      waves:      `repeating-radial-gradient(ellipse at 0% 50%, transparent 0%, transparent 45%, ${col} 50%, transparent 55%)`,
      hexagon:    `radial-gradient(circle, ${col} 30%, transparent 31%)`,
      crosshatch: `repeating-linear-gradient(45deg, ${col} 0, ${col} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${col} 0, ${col} 1px, transparent 0, transparent 50%)`,
      circles:    `radial-gradient(circle at 50% 50%, transparent 30%, ${col} 30%, ${col} 32%, transparent 32%)`,
    };
    style.backgroundImage = patternMap[d.bgPattern ?? "dots"];
    style.backgroundSize = "24px 24px";
  }
  // For image type, we use the overlay div instead (for opacity control)

  return style;
}

// ── Build container class ─────────────────────────────────────
function buildContainerClass(d: DesignSettings): string {
  const widthMap: Record<string, string> = {
    full:      "w-full",
    wide:      "max-w-7xl mx-auto px-6",
    contained: "max-w-6xl mx-auto px-6",
    narrow:    "max-w-4xl mx-auto px-6",
  };
  return widthMap[d.sectionWidth ?? "contained"] ?? widthMap.contained;
}

// ── Build wrapper class ────────────────────────────────────────
function buildWrapperClass(d: DesignSettings): string {
  const classes: string[] = [];
  if (d.enableMarquee) classes.push("section-marquee-enabled");
  if (d.enableSlider)  classes.push("section-slider-enabled");
  if (d.textColor)     classes.push("[&_p]:text-inherit [&_span]:text-inherit");
  return classes.join(" ");
}
