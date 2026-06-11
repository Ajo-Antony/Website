"use client";

const STEPS = [
  { num:"01", title:"Connect your stack",   desc:"Link CRM, WhatsApp, email, and 500+ tools with one-click OAuth connectors." },
  { num:"02", title:"Configure AI agents",  desc:"Choose pre-built templates or design custom workflows in the visual builder." },
  { num:"03", title:"Launch campaigns",     desc:"Set your audience and goals — StrixMind writes, sends, and optimises." },
  { num:"04", title:"Watch it compound",   desc:"Every interaction makes your agents smarter. Revenue compounds over time." },
] as const;

export default function WorkflowHomePageSection() {
  return (
    <section id="workflow" style={{ background: "#fff", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>How It Works</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>Up and running in<br/>three minutes.</h2>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, marginBottom: "4rem" }}>No engineers required. No complex setup. Just connect, configure, and grow.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem", position: "relative" }}>
          <div style={{ position: "absolute", top: 32, left: "12%", right: "12%", height: 1, background: "#E5E7EB" }} />
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D8E8E5", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.25rem", fontWeight: 800, color: "#0A5C68", position: "relative" as const, zIndex: 1, transition: "all 0.3s ease", cursor: "default" }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = "#0A5C68"; d.style.color = "#fff"; d.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = "#D8E8E5"; d.style.color = "#0A5C68"; d.style.transform = ""; }}>
                {s.num}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{s.title}</div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
