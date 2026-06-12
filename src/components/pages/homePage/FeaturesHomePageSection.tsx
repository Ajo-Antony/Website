"use client";

const FEATURES = [
  {
    num: "01", icon: "🤖", title: "AI Agents",
    desc: "Deploy intelligent agents for sales, customer support, HR, and legal. They learn your business, handle queries 24/7, and escalate only when needed.",
    tags: ["Sales Agent", "Support Agent", "HR Agent", "Legal Agent"],
  },
  {
    num: "02", icon: "⚡", title: "Workflow Automation",
    desc: "Build powerful automations visually. Drag, drop, and chain triggers, conditions, and actions across 500+ integrations — zero code required.",
    tags: ["Drag & Drop Builder", "500+ Integrations", "Custom Triggers"],
  },
  {
    num: "03", icon: "👥", title: "Intelligent CRM",
    desc: "A CRM that updates itself. AI auto-enriches contacts, scores pipeline deals, and surfaces your highest-value follow-ups every single day.",
    tags: ["Lead Scoring", "Contact Enrichment", "Pipeline Tracking"],
  },
  {
    num: "04", icon: "💬", title: "WhatsApp Automation",
    desc: "Connect WhatsApp Business and deploy smart bots that handle bookings, FAQs, follow-ups, and support around the clock — in any Indian language.",
    tags: ["WhatsApp Business API", "Auto-replies", "Broadcast Campaigns"],
  },
  {
    num: "05", icon: "📊", title: "Revenue Analytics",
    desc: "Unified dashboards combining pipeline, campaign, and agent performance data with AI-generated insights and weekly growth forecasts.",
    tags: ["Revenue Dashboard", "Team Performance", "Forecasting"],
  },
  {
    num: "06", icon: "🚀", title: "Campaign Outreach",
    desc: "Multi-channel campaigns across email, SMS, and social media — written, A/B tested, and continuously optimised by AI to maximise conversions.",
    tags: ["Email", "SMS", "Social Media", "A/B Testing"],
  },
] as const;

export default function FeaturesHomePageSection() {
  return (
    <section id="features" style={{ background: "#fff", padding: "7rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.07)", border: "1px solid rgba(10,92,104,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            Platform Features
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1.1rem" }}>
            Everything your business<br />needs to scale with AI.
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            Six fully integrated modules that work together from day one — no separate subscriptions, no integration headaches.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.5rem" }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 24, padding: "2.25rem", transition: "all 0.35s ease", cursor: "default", transitionDelay: `${i * 0.05}s` }}
              onMouseEnter={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "translateY(-6px)";
                d.style.boxShadow = "0 16px 48px rgba(10,92,104,0.13)";
                d.style.borderColor = "rgba(10,92,104,0.2)";
              }}
              onMouseLeave={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "";
                d.style.boxShadow = "";
                d.style.borderColor = "#E5E7EB";
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(10,92,104,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>{f.icon}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(10,92,104,0.4)", marginBottom: "0.6rem" }}>{f.num}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{f.title}</div>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.75 }}>{f.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.4rem", marginTop: "1.5rem" }}>
                {f.tags.map(t => (
                  <span key={t} style={{ fontSize: "0.68rem", fontWeight: 600, color: "#0A5C68", background: "rgba(10,92,104,0.06)", border: "1px solid rgba(10,92,104,0.12)", padding: "0.2rem 0.65rem", borderRadius: 100 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
