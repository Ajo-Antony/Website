"use client";

const STEPS = [
  { num: "01", icon: "🔌", title: "Connect your stack", desc: "Link CRM, WhatsApp, email, calendar, and 500+ tools in seconds using one-click OAuth connectors — no developer needed." },
  { num: "02", icon: "🧩", title: "Configure AI agents", desc: "Pick from ready-made templates — sales bot, support agent, lead qualifier — or build fully custom workflows in the visual builder." },
  { num: "03", icon: "🚀", title: "Launch campaigns", desc: "Set your target audience and growth goal. StrixMind writes copy, schedules sends, and A/B tests automatically." },
  { num: "04", icon: "📈", title: "Watch it compound", desc: "Every interaction trains agents to be smarter. Revenue compounds, costs fall, and your team focuses on what only humans can do." },
] as const;

export default function WorkflowHomePageSection() {
  return (
    <section id="workflow" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Divider */}
        <div data-strix-divider-h style={{ height: 1, background: "linear-gradient(90deg, transparent, #0063E5, transparent)", marginBottom: "4rem", opacity: 0.3 }} />

        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div data-strix-tag-badge style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            How It Works
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>
            Up and running in three minutes flat.
          </h2>
          <p data-strix-fade-up style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
            No engineers. No complex setup. Just connect, configure, and start growing today.
          </p>
        </div>

        <div data-strix-stagger-grid style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", position: "relative" }}>

          {/* Connector line */}
          <div
            data-strix-connector
            style={{ position: "absolute", top: 44, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg, #0063E5, rgba(0,99,229,0.3))", zIndex: 0 }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-strix-grid-item
              style={{ position: "relative", zIndex: 1 }}
            >
              {/* Step circle */}
              <div
                data-strix-step-circle
                style={{ width: 88, height: 88, borderRadius: "50%", background: i === 0 ? "#0063E5" : "#fff", border: `2px solid ${i === 0 ? "#0063E5" : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", fontSize: "2rem", boxShadow: i === 0 ? "0 0 32px rgba(0,99,229,0.4)" : "0 4px 20px rgba(0,0,0,0.08)", transition: "all 0.35s ease" }}
              >
                {step.icon}
              </div>

              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#0063E5", marginBottom: "0.6rem" }}>
                Step {step.num}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.8 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
