import Link from "next/link";
const BULLETS = [
  { icon:"🎯", title:"Provider-agnostic AI routing", desc:"Route tasks to GPT-4o, Gemini, or Claude based on cost and latency." },
  { icon:"⚡", title:"Sub-second response latency",  desc:"Edge-deployed agents keep every customer interaction instant." },
  { icon:"🛡️", title:"Enterprise-grade security",    desc:"SOC 2 aligned, end-to-end encrypted, role-based access control." },
  { icon:"📚", title:"Real-time knowledge base",     desc:"Upload docs and FAQs — agents stay accurate and on-brand." },
] as const;
const BARS = [["WhatsApp response rate","82%",82,"#0A5C68"],["Campaign open rate","67%",67,"#10b981"],["Lead qualification","91%",91,"#f59e0b"],["Workflow automation","95%",95,"#0A5C68"]];

export default function DemoHomePageSection() {
  return (
    <section id="demo" style={{ background: "#D8E8E5", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>AI Automation Demo</div>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>Watch your business run<br/>on autopilot.</h2>
          <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.75, marginBottom: "1.5rem" }}>StrixMind's AI layer connects every module so actions happen automatically.</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem", marginBottom: "2rem" }}>
            {BULLETS.map(b => (
              <div key={b.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, background: "rgba(10,92,104,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{b.icon}</div>
                <div><div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.2rem" }}>{b.title}</div><div style={{ fontSize: "0.85rem", color: "#64748B" }}>{b.desc}</div></div>
              </div>
            ))}
          </div>
          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, padding: "0.9rem 2.25rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 32px rgba(10,92,104,0.30)" }}>
            Book a live demo →
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 28, padding: "2rem", boxShadow: "0 24px 80px rgba(10,92,104,0.12)", border: "1px solid #E5E7EB" }}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#0A5C68,#14b8a6)", borderRadius: "28px 28px 0 0" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>StrixMind Platform</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#fff", background: "#0A5C68", padding: "0.25rem 0.6rem", borderRadius: 100, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "pulse-dot 1.5s infinite" }} /> Live
            </div>
          </div>
          <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}`}</style>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {[["2,847","Active Leads",true],["₹18.4L","Revenue",false],["99.8%","Agent Uptime",true],["4.2s","Avg Response",false]].map(([v,l,isTeal]) => (
              <div key={String(l)} style={{ background: "#D8E8E5", borderRadius: 16, padding: "1rem", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: isTeal ? "#0A5C68" : "#0F172A" }}>{v}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.2rem", fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
          {BARS.map(([l,pct,w,c]) => (
            <div key={String(l)} style={{ marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem", fontWeight: 500 }}><span>{l}</span><span style={{ color: String(c), fontWeight: 700 }}>{pct}</span></div>
              <div style={{ height: 8, background: "#D8E8E5", borderRadius: 100, overflow: "hidden", border: "1px solid #E5E7EB" }}><div style={{ height: "100%", width: `${w}%`, background: String(c), borderRadius: 100 }} /></div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #E5E7EB", fontSize: "0.72rem", color: "#64748B", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
            All systems operational · 47 AI agents running
          </div>
        </div>
      </div>
    </section>
  );
}
