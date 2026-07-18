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
  MousePointerClick,
  Bot,
  Users,
  Zap,
  Puzzle,
  TrendingUp,
} from "lucide-react";
import { useRef } from "react";

interface Item { title: string; desc: string }
interface ServicesProps { eyebrow?: string; heading?: string; items?: Item[] }

const D = CONTENT_DEFAULTS["home.services"] as Required<ServicesProps>;

function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("crm")) return Users;
  if (t.includes("whatsapp")) return Bot;
  if (t.includes("campaign") || t.includes("outreach")) return Zap;
  if (t.includes("lead") || t.includes("prospect")) return MousePointerClick;
  if (t.includes("workflow") || t.includes("agent")) return Puzzle;
  return TrendingUp;
}

function formatHeadingWithAccent(text: string) {
  if (!text) return "";
  const t = text.trim();
  
  if (t.includes("one system.")) {
    return (
      <>
        Every growth lever,<br />in one <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">system.</span>
      </>
    );
  }
  
  const words = t.split(/\s+/);
  if (words.length <= 1) return text;
  const lastWord = words[words.length - 1];
  const rest = words.slice(0, words.length - 1).join(" ");
  return (
    <>
      {rest}{" "}
      <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">
        {lastWord}
      </span>
    </>
  );
}

export default function ServicesHomePageSection({
  eyebrow = D.eyebrow,
  heading = D.heading,
  items = D.items,
}: ServicesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-strix-grid-item]");
    const step = (card?.offsetWidth ?? 320) + 24; // card width + gap
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="services" style={{ borderTop: "1px solid var(--glass-bg)" }} className="py-20 md:py-32">
      <style>{`
        .strix-service-card { transition: transform 0.25s, box-shadow 0.25s; }
        .strix-service-card:hover { transform: translateY(-5px); box-shadow: 0 20px 56px rgba(99,88,210,0.18) !important; }
        .strix-svc-icon { transition: background 0.3s, transform 0.3s; }
        .strix-service-card:hover .strix-svc-icon { background: var(--glass-bg); transform: scale(1.1) rotate(-4deg); }
        .strix-svc-icon svg { transition: stroke 0.3s; }
        .strix-service-card:hover .strix-svc-icon svg { stroke: var(--accent); }
        .strix-svc-scroller { scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x proximity; }
        .strix-svc-scroller::-webkit-scrollbar { display: none; }
        .strix-svc-nav-btn:hover { background: rgba(20,20,20,0.8) !important; }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="px-5 sm:px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-6 md:gap-16 mb-12 md:mb-14">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-deep)", background: "rgba(108,99,255,0.07)", border: "1px solid var(--glass-bg)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
              {eyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text)", whiteSpace: "pre-line" }}>
              {formatHeadingWithAccent(heading)}
            </h2>
          </div>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.7 }}>
            Purpose-built modules that communicate natively — no duct tape, no integrations graveyard.
          </p>
        </div>

        {/* Carousel wrapper — arrows overlay the scrollable row */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            className="strix-svc-nav-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: "rgba(20,20,20,0.55)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: 20,
              transform: "translate(-50%, -50%)",
            }}
          >
            ‹
          </button>

          <div
            ref={scrollerRef}
            data-strix-stagger-grid
            className="strix-svc-scroller"
            style={{ display: "flex", gap: "1.5rem", overflowX: "auto", scrollBehavior: "smooth", padding: "0.5rem 0.25rem" }}
          >
            {items.map((s, i) => {
              const Icon = getServiceIcon(s.title);
              return (
                <div
                  key={s.title}
                  className="strix-service-card"
                  data-strix-grid-item
                  style={{ flex: "0 0 320px", scrollSnapAlign: "start", padding: "2.5rem", borderRadius: 24, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 8px 32px var(--shadow)", cursor: "default", position: "relative", overflow: "hidden" }}
                >
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-dim)", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
                  {/* SVG icon replaces emoji */}
                  <div
                    className="strix-svc-icon"
                    style={{ width: 44, height: 44, borderRadius: 12, background: "var(--shadow)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}
                  >
                    <Icon size={22} color="var(--accent)" />
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "var(--text)" }}>{s.title}</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            className="strix-svc-nav-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: "rgba(20,20,20,0.55)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: 20,
              transform: "translate(50%, -50%)",
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
