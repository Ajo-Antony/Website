"use client";

const STEPS = [
  {
    num: "01",
    icon: "🔌",
    title: "Connect your stack",
    desc: "Link your CRM, WhatsApp, email, calendar, and 500+ tools in seconds using one-click OAuth connectors — no developer needed.",
  },
  {
    num: "02",
    icon: "🧩",
    title: "Configure AI agents",
    desc: "Pick from ready-made templates — sales bot, support agent, lead qualifier — or build fully custom workflows in the visual builder.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Launch campaigns",
    desc: "Set your target audience and growth goal. StrixMind writes the copy, schedules sends, and A/B tests automatically.",
  },
  {
    num: "04",
    icon: "📈",
    title: "Watch it compound",
    desc: "Every interaction trains your agents to be smarter. Revenue compounds, costs fall, and your team focuses on what only humans can do.",
  },
] as const;

export default function WorkflowHomePageSection() {
  return (
    <section id="workflow" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            How It Works
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>
            Up and running in<br />three minutes flat.
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
            No engineers. No complex setup. Just connect, configure, and start growing today.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", position: "relative" }}>
          {/* Connector line */}
          <div style={{ position: "absolute", top: 40, left: "13%", right: "13%", height: "1px", background: "linear-gradient(90deg, #0063E5, #6aabff, #0063E5)", opacity: 0.2 }} />

          {STEPS.map((s, i) => (
            <div key={s.num} style={{ textAlign: "center", position: "relative" }}>
              {/* Step circle */}
              <div
                style={{ width: 80, height: 80, borderRadius: "50%", background: "#EEF4FF", border: "1.5px solid #E5E7EB", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem", position: "relative" as const, zIndex: 1, transition: "all 0.3s ease", cursor: "default", gap: "0.1rem" }}
                onMouseEnter={e => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.background = "#0063E5";
                  d.style.borderColor = "#0063E5";
                  d.style.transform = "scale(1.08)";
                  d.style.boxShadow = "0 8px 24px rgba(0,99,229,0.3)";
                  (d.querySelector(".step-icon") as HTMLElement).style.filter = "brightness(10)";
                  (d.querySelector(".step-num") as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={e => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.background = "#EEF4FF";
                  d.style.borderColor = "#E5E7EB";
                  d.style.transform = "";
                  d.style.boxShadow = "";
                  (d.querySelector(".step-icon") as HTMLElement).style.filter = "";
                  (d.querySelector(".step-num") as HTMLElement).style.color = "#94A3B8";
                }}
              >
                <div className="step-icon" style={{ fontSize: "1.4rem", lineHeight: 1, transition: "filter 0.3s" }}>{s.icon}</div>
                <div className="step-num" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#94A3B8", transition: "color 0.3s" }}>{s.num}</div>
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>{s.title}</div>
              <p style={{ fontSize: "0.875rem", color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
