"use client";

const FEATURES = [
  { icon: "🔀", title: "Provider-agnostic AI routing", desc: "Route tasks to GPT-4o, Gemini, or Claude based on cost and latency. No vendor lock-in, ever.", color: "#6c63ff", bg: "rgba(108,99,255,0.08)" },
  { icon: "⚡", title: "Sub-second response latency",  desc: "Edge-deployed agents, smart caching, and optimised token management keep every interaction instant.", color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
  { icon: "🛡️", title: "Enterprise-grade security",    desc: "SOC 2 aligned, end-to-end encrypted data pipelines, and role-based access control.", color: "#f472b6", bg: "rgba(244,114,182,0.08)" },
  { icon: "📚", title: "Real-time knowledge base",     desc: "Upload docs and FAQs. Agents reference your knowledge instantly — always accurate, always on-brand.", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
] as const;

export default function FeatureServicesHomePageSection() {
  return (
    <section id="why" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

          {/* Left — features */}
          <div>
            <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
              Advantages
            </div>
            <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", marginBottom: "2.5rem" }}>
              Built different,<br />by design.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {FEATURES.map((f) => (
                <div key={f.title}
                  style={{ display: "flex", gap: "1.25rem", padding: "1.5rem", borderRadius: 18, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", boxShadow: "0 4px 20px rgba(99,88,210,0.08)", transition: "transform 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "")}
                >
                  <div style={{ width: 42, height: 42, minWidth: 42, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.875rem", fontWeight: 700, color: "#1a1333", marginBottom: "0.3rem" }}>{f.title}</div>
                    <p style={{ fontSize: "0.82rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — glass dashboard */}
          <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(28px) saturate(200%)", boxShadow: "0 16px 56px rgba(99,88,210,0.18)", padding: "1.75rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6c63ff,#a78bfa,#0ea5e9)" }} />
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9b92c0", marginBottom: "1.25rem" }}>Live Platform Preview</div>

            {/* Metric tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { val: "2,847", label: "Active Leads", grad: true },
                { val: "₹18.4L", label: "This Month", teal: true },
                { val: "99.8%", label: "Agent Uptime", grad: true },
                { val: "4.2s", label: "Avg Response", teal: true },
              ].map((m) => (
                <div key={m.label} style={{ padding: "1rem", borderRadius: 14, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.8)" }}>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.4rem", fontWeight: 700, ...(m.grad ? { background: "linear-gradient(135deg,#6c63ff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "#0ea5e9" }) }}>{m.val}</div>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", color: "#9b92c0", letterSpacing: "0.08em", marginTop: "0.2rem" }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Bars */}
            {[
              { label: "WhatsApp response rate", pct: 82, color: "linear-gradient(90deg,#0ea5e9,#38bdf8)" },
              { label: "Campaign open rate",     pct: 67, color: "linear-gradient(90deg,#6c63ff,#a78bfa)" },
              { label: "Lead qualification",     pct: 91, color: "linear-gradient(90deg,#f472b6,#fb7185)" },
            ].map((b) => (
              <div key={b.label} style={{ marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "#5b5478", marginBottom: "0.4rem", letterSpacing: "0.06em" }}>
                  <span>{b.label}</span><span>{b.pct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(108,99,255,0.1)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 100 }} />
                </div>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "#9b92c0", letterSpacing: "0.08em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              All systems operational · AI agents active
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
