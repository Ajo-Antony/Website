/**
 * ServicesHomePageSection.tsx
 * ─────────────────────────────────────────────────────────────
 * FILE PURPOSE:
 *   Glass-card "Services" grid on the homepage (below Features).
 *   Content is driven by the CMS via CONTENT_DEFAULTS["home.services"].
 *   Each card renders a numbered badge + SVG icon + title + desc.
 *
 * LOCATION:  src/components/pages/homePage/ServicesHomePageSection.tsx
 * ROUTE:     src/app/page.tsx  →  <ServicesHomePageSection />
 *
 * CMS KEY:   "home.services"  (see src/lib/cms/registry.ts)
 *
 * ICON MAPPING (replaces emoji array ICONS):
 *   index 0 → IconTarget   (🎯)
 *   index 1 → IconWhatsapp (💬)
 *   index 2 → IconUsers    (👥)
 *   index 3 → IconRocket   (🚀)
 *   index 4 → IconPuzzle   (🧩)
 *   index 5 → IconChart    (📊)
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import {
  IconTarget, IconWhatsapp, IconUsers, IconRocket, IconPuzzle, IconChart,
} from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface Item { title: string; desc: string }
interface ServicesProps { eyebrow?: string; heading?: string; items?: Item[] }

const D = CONTENT_DEFAULTS["home.services"] as Required<ServicesProps>;

// SVG icons indexed to match the original emoji array order
const ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconTarget, IconWhatsapp, IconUsers, IconRocket, IconPuzzle, IconChart,
];

export default function ServicesHomePageSection({
  eyebrow = D.eyebrow,
  heading = D.heading,
  items = D.items,
}: ServicesProps) {
  return (
    <section id="services" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <style>{`
        .strix-service-card { transition: transform 0.25s, box-shadow 0.25s; }
        .strix-service-card:hover { transform: translateY(-5px); box-shadow: 0 20px 56px rgba(99,88,210,0.18) !important; }
        .strix-svc-icon { transition: background 0.3s, transform 0.3s; }
        .strix-service-card:hover .strix-svc-icon { background: rgba(108,99,255,0.18); transform: scale(1.1) rotate(-4deg); }
        .strix-svc-icon svg { transition: stroke 0.3s; }
        .strix-service-card:hover .strix-svc-icon svg { stroke: #6c63ff; }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
              {eyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", whiteSpace: "pre-line" }}>
              {heading}
            </h2>
          </div>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.7 }}>
            Purpose-built modules that communicate natively — no duct tape, no integrations graveyard.
          </p>
        </div>

        <div data-strix-stagger-grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem" }}>
          {items.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={s.title}
                className="strix-service-card"
                data-strix-grid-item
                style={{ padding: "2.5rem", borderRadius: 24, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 8px 32px rgba(99,88,210,0.10)", cursor: "default", position: "relative", overflow: "hidden" }}
              >
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#9b92c0", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
                {/* SVG icon replaces emoji */}
                <div
                  className="strix-svc-icon"
                  style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(108,99,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}
                >
                  <Icon size={22} color="#6c63ff" />
                </div>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "#1a1333" }}>{s.title}</div>
                <p style={{ fontSize: "0.875rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
