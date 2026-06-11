"use client";

// ── IMAGE GUIDE ─────────────────────────────────────────────────
// Service icons: /public/images/services/icon-leads.svg etc.
// Or use the inline SVGs below — swap src in <img> once you have assets.
// ────────────────────────────────────────────────────────────────

const SERVICES = [
  { num: "01", title: "Lead Generation",       desc: "AI-powered prospecting that identifies, qualifies, and enriches leads from multiple channels automatically.", color: "#6c63ff", bg: "rgba(108,99,255,0.10)" },
  { num: "02", title: "WhatsApp Automation",   desc: "Intelligent bots handle bookings, follow-ups, and queries on WhatsApp — 24/7 with human-like responses.", color: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
  { num: "03", title: "Intelligent CRM",       desc: "A CRM that updates itself. AI enriches contacts, scores pipeline health, and surfaces the right follow-up.", color: "#6c63ff", bg: "rgba(108,99,255,0.10)" },
  { num: "04", title: "Campaign Outreach",     desc: "Multi-channel campaigns across email, SMS, and social — written, tested, and optimised by AI.", color: "#f472b6", bg: "rgba(244,114,182,0.10)" },
  { num: "05", title: "Multi-Agent Workflows", desc: "Visual drag-and-drop builder for autonomous AI agent chains. No code required.", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  { num: "06", title: "Revenue Analytics",     desc: "Unified dashboards with AI-generated insights, forecasts, and performance recommendations.", color: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
] as const;

export default function ServicesHomePageSection() {
  return (
    <section id="services" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
              What we do
            </div>
            <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333" }}>
              Every growth lever,<br />in one system.
            </h2>
          </div>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.7 }}>
            Purpose-built modules that communicate natively — no duct tape, no integrations graveyard.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem" }}>
          {SERVICES.map((s) => (
            <div key={s.num}
              style={{ padding: "2.5rem", borderRadius: 24, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 8px 32px rgba(99,88,210,0.10)", transition: "transform 0.25s, box-shadow 0.25s", cursor: "default", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(99,88,210,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(99,88,210,0.10)"; }}
            >
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#9b92c0", marginBottom: "1rem" }}>{s.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: s.color }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "#1a1333" }}>{s.title}</div>
              <p style={{ fontSize: "0.875rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
