/**
 * SvgIcons.tsx
 * ─────────────────────────────────────────────────────────────
 * FILE PURPOSE:
 *   Centralised SVG icon library that replaces every emoji on the
 *   StrixMind marketing site with a clean, consistent, stroke-based
 *   icon. All icons are inline SVGs — no external dependency needed.
 *
 * HOW TO USE:
 *   import { IconTarget, IconBolt, ... } from "@/components/ui/SvgIcons";
 *   <IconTarget size={24} color="var(--accent)" />
 *
 * ICONS PROVIDED:
 *   IconTarget      → replaces 🎯  (Goals / Provider routing)
 *   IconBolt        → replaces ⚡  (Speed / Workflow automation)
 *   IconShield      → replaces 🔒🛡 (Security / Enterprise)
 *   IconBook        → replaces 📚  (Knowledge base)
 *   IconRobot       → replaces 🤖  (AI Agents)
 *   IconUsers       → replaces 👥  (CRM / Team)
 *   IconWhatsapp    → replaces 💬  (WhatsApp / Messaging)
 *   IconChart       → replaces 📊  (Analytics / Revenue)
 *   IconRocket      → replaces 🚀  (Campaigns / Launch)
 *   IconBriefcase   → replaces 💼  (Projects / Work)
 *   IconEdit        → replaces 📝  (Blog / Writing)
 *   IconGallery     → replaces 🖼️  (Gallery)
 *   IconPuzzle      → replaces 🧩  (Workflows / Modules)
 *   IconInbox       → replaces 📥  (CRM & Leads)
 *   IconMail        → replaces ✉️  (Email Campaigns)
 *   IconOverview    → replaces 📊  (Admin Overview)
 *
 * ANIMATED ICONS:
 *   AnimatedTarget  → pulsing ring animation
 *   AnimatedBolt    → electricity flicker
 *   AnimatedShield  → shield glow
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const defaults: Required<Pick<IconProps, "size" | "color" | "strokeWidth">> = {
  size: 22,
  color: "currentColor",
  strokeWidth: 1.75,
};

// ─── Helpers ──────────────────────────────────────────────────
const svg = (
  content: React.ReactNode,
  { size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth, className, style }: IconProps
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {content}
  </svg>
);

// ─── Icons ────────────────────────────────────────────────────

export const IconTarget = (p: IconProps) =>
  svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>,
    p
  );

export const IconBolt = (p: IconProps) =>
  svg(
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    p
  );

export const IconShield = (p: IconProps) =>
  svg(
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    p
  );

export const IconBook = (p: IconProps) =>
  svg(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>,
    p
  );

export const IconRobot = (p: IconProps) =>
  svg(
    <>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <rect x="9" y="7" width="6" height="4" rx="1" />
      <line x1="12" y1="7" x2="12" y2="2" />
      <circle cx="12" cy="2" r="1" />
      <circle cx="8.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 20h6" />
    </>,
    p
  );

export const IconUsers = (p: IconProps) =>
  svg(
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
    p
  );

export const IconWhatsapp = (p: IconProps) =>
  svg(
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="12" y1="7" x2="12" y2="13" />
    </>,
    p
  );

export const IconChart = (p: IconProps) =>
  svg(
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </>,
    p
  );

export const IconRocket = (p: IconProps) =>
  svg(
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>,
    p
  );

export const IconBriefcase = (p: IconProps) =>
  svg(
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </>,
    p
  );

export const IconPalette = (p: IconProps) =>
  svg(
    <>
      <path d="M12 2.5a9.5 9.5 0 1 0 0 19c1.1 0 1.8-.78 1.8-1.78 0-.46-.18-.9-.48-1.24-.3-.34-.46-.78-.46-1.24 0-1 .8-1.8 1.8-1.8h2.1A3.8 3.8 0 0 0 20.6 11.6C20.6 6.6 16.7 2.5 12 2.5Z" />
      <circle cx="6.8" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const IconExternalLink = (p: IconProps) =>
  svg(
    <>
      <path d="M9.5 4.5h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
      <path d="M14 3.5h6.5V10" />
      <path d="M20.2 3.8 11 13" />
    </>,
    p
  );

export const IconEdit = (p: IconProps) =>
  svg(
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>,
    p
  );

export const IconGallery = (p: IconProps) =>
  svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>,
    p
  );

export const IconPuzzle = (p: IconProps) =>
  svg(
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>,
    p
  );

export const IconInbox = (p: IconProps) =>
  svg(
    <>
      <polyline points="22 13 16 13 14 16 10 16 8 13 2 13" />
      <path d="M5.45 5.11L2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-7.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>,
    p
  );

export const IconMail = (p: IconProps) =>
  svg(
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>,
    p
  );

export const IconOverview = (p: IconProps) =>
  svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>,
    p
  );

export const IconContent = (p: IconProps) =>
  svg(
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </>,
    p
  );

// IconShuffle  → replaces 🔀  (Provider-agnostic AI routing)
export const IconShuffle = (p: IconProps) =>
  svg(
    <>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </>,
    p
  );

// IconPlug  → replaces 🔌  (Connect your stack)
export const IconPlug = (p: IconProps) =>
  svg(
    <>
      <path d="M9 2v6" />
      <path d="M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z" />
      <path d="M12 17v5" />
    </>,
    p
  );

// IconMapPin  → replaces 📍  (Location / office address)
export const IconMapPin = (p: IconProps) =>
  svg(
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>,
    p
  );

// IconClock  → replaces 🕐 ⏰ ⏱️  (Office hours / response time)
export const IconClock = (p: IconProps) =>
  svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>,
    p
  );

// IconPhone  → replaces 📞  (Office hours / call)
export const IconPhone = (p: IconProps) =>
  svg(
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
    p
  );

// IconLock  → replaces 🔒  (Privacy by default)
export const IconLock = (p: IconProps) =>
  svg(
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>,
    p
  );

// IconSprout  → replaces 🌱  (Growth over perfection)
export const IconSprout = (p: IconProps) =>
  svg(
    <>
      <path d="M7 20h10" />
      <path d="M12 20v-7" />
      <path d="M9 13c-3 0-5-2-5-5 3 0 5 2 5 5z" />
      <path d="M12 13c0-4 2.5-7 7-7 0 4-2.5 7-7 7z" />
    </>,
    p
  );

// IconCheckCircle  → replaces ✅ 🎉  (Success / form sent confirmation)
export const IconCheckCircle = (p: IconProps) =>
  svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12.5 11 15.5 16 9" />
    </>,
    p
  );

// ─── Animated Variants ─────────────────────────────────────────

/**
 * AnimatedTarget — concentric-ring pulse around the target icon.
 * Used in sections that formerly had 🎯 where extra motion fits.
 */
export function AnimatedTarget({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}>
      <span
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          opacity: 0.3,
          animation: "strix-ring-pulse 2s ease-out infinite",
        }}
      />
      <IconTarget size={size} color={color} />
      <style>{`
        @keyframes strix-ring-pulse {
          0%  { transform: scale(0.85); opacity: 0.45; }
          70% { transform: scale(1.35); opacity: 0; }
          100%{ transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

/**
 * AnimatedBolt — subtle vertical flicker on the lightning bolt.
 */
export function AnimatedBolt({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <span style={{ display: "inline-flex", animation: "strix-bolt-flicker 3s ease-in-out infinite", ...style }}>
      <IconBolt size={size} color={color} />
      <style>{`
        @keyframes strix-bolt-flicker {
          0%, 90%, 100% { opacity: 1; transform: scaleY(1); }
          93%            { opacity: 0.6; transform: scaleY(0.93); }
          96%            { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </span>
  );
}

/**
 * AnimatedShield — slow breathing glow.
 *
 * Previously animated the `filter: drop-shadow(...)` property directly,
 * which the browser cannot run on the compositor thread — every frame
 * had to be repainted on the main thread (this is what PageSpeed's
 * "Avoid non-composited animations" audit flags). Instead we render a
 * static, pre-blurred glow layer behind the icon and animate only its
 * `opacity`/`transform` (via `scale`), both of which the compositor can
 * run independently of the main thread.
 */
export function AnimatedShield({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <span style={{ position: "relative", display: "inline-flex", ...style }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          background: color,
          filter: "blur(6px)",
          opacity: 0,
          animation: "strix-shield-glow 3.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <IconShield size={size} color={color} style={{ position: "relative" }} />
      <style>{`
        @keyframes strix-shield-glow {
          0%, 100% { opacity: 0;   transform: scale(0.7); }
          50%       { opacity: 0.55; transform: scale(1);   }
        }
      `}</style>
    </span>
  );
}