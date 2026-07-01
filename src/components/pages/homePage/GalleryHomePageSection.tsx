"use client";
import { IconGallery } from "@/components/ui/SvgIcons";

// ── IMAGE GUIDE ─────────────────────────────────────────────────
// Gallery images: /public/images/gallery/gallery-1.jpg  (800×600)
// Drop images there and replace the placeholder divs with <Image>.
// ────────────────────────────────────────────────────────────────

const GALLERY_ITEMS = [
  { label: "Agent Builder", span: 2 },
  { label: "CRM Dashboard", span: 1 },
  { label: "WhatsApp Bot", span: 1 },
  { label: "Campaign Analytics", span: 1 },
  { label: "Knowledge Base", span: 2 },
] as const;

const GRAD_COLORS = [
  "linear-gradient(135deg,rgba(108,99,255,0.15),rgba(167,139,250,0.08))",
  "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(56,189,248,0.08))",
  "linear-gradient(135deg,rgba(244,114,182,0.15),rgba(251,113,133,0.08))",
  "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(251,191,36,0.08))",
  "linear-gradient(135deg,var(--border),rgba(14,165,233,0.10))",
];

export default function GalleryHomePageSection() {
  return (
    <section id="gallery" style={{ padding: "8rem 0", borderTop: "1px solid var(--glass-bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", background: "rgba(108,99,255,0.07)", border: "1px solid var(--glass-bg)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>Platform</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text)" }}>
            See it in action.
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {GALLERY_ITEMS.map((item, i) => (
            <div key={item.label}
              style={{ gridColumn: `span ${item.span}`, height: item.span === 2 ? 260 : 200, borderRadius: 20, background: GRAD_COLORS[i % GRAD_COLORS.length], border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 24px var(--shadow)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(99,88,210,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px var(--shadow)"; }}
            >
              {/* Replace with <Image src={`/images/gallery/gallery-${i+1}.jpg`} ... /> */}
              <IconGallery size={32} color="var(--accent)" strokeWidth={1.4} style={{ opacity: 0.55 }} />
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>{item.label}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 300 }}>Drop image → /public/images/gallery/</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
