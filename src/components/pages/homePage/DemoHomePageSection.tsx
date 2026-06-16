"use client";
import Link from "next/link";

const BULLETS = [
  { icon: "🎯", title: "Provider-agnostic AI routing", desc: "Route tasks to GPT-4o, Gemini, or Claude based on cost, speed, and accuracy — zero vendor lock-in." },
  { icon: "⚡", title: "Sub-second response latency",  desc: "Edge-deployed agents with smart caching keep every customer interaction instant at any scale." },
  { icon: "🛡️", title: "Enterprise-grade security",    desc: "SOC 2 aligned architecture, end-to-end encryption, role-based access control, and audit logs." },
  { icon: "📚", title: "Real-time knowledge base",     desc: "Upload your docs, FAQs, and SOPs — agents stay accurate, on-brand, and always up-to-date." },
] as const;

const BARS: [string, string, number, string][] = [
  ["WhatsApp response rate", "82%", 82, "#0063E5"],
  ["Campaign open rate",     "67%", 67, "#10b981"],
  ["Lead qualification",     "91%", 91, "#f59e0b"],
  ["Workflow automation",    "95%", 95, "#0063E5"],
];

export default function DemoHomePageSection() {
  return (
    <section id="demo" style={{ background: "#EEF4FF", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

        {/* Left: copy */}
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            AI Platform
          </div>
          <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1.1rem" }}>
            Watch your business<br />run on autopilot.
          </h2>
          <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.8, marginBottom: "2rem" }}>
            StrixMind's AI layer connects every module so leads are captured, nurtured, qualified, and closed — automatically — while you sleep.
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.1rem", marginBottom: "2.5rem" }}>
            {BULLETS.map(b => (
              <div key={b.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: 12, background: "rgba(0,99,229,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.2rem" }}>{b.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.65 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, padding: "0.95rem 2.5rem", background: "#0063E5", color: "#fff", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 32px rgba(0,99,229,0.25)" }}>
            Book a live demo →
          </Link>
        </div>

        {/* Right: live dashboard card */}
        <div style={{ background: "#fff", borderRadius: 28, padding: "2rem", boxShadow: "0 24px 80px rgba(0,99,229,0.12)", border: "1.5px solid #E5E7EB", position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0063E5, #6aabff)" }} />

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>StrixMind Platform</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#fff", background: "#0063E5", padding: "0.28rem 0.75rem", borderRadius: 100, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block" }} />Live
            </div>
          </div>

          {/* Metric tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              ["2,847", "Active Leads", "#0063E5"],
              ["₹18.4L", "Revenue This Month", "#0F172A"],
              ["99.8%", "Agent Uptime", "#0063E5"],
              ["4.2s", "Avg Response Time", "#0F172A"],
            ].map(([val, label, color]) => (
              <div key={String(label)} style={{ background: "#F8FAFF", borderRadius: 16, padding: "1.1rem", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.04em", color: String(color) }}>{val}</div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.2rem", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          {BARS.map(([label, pct, width, color]) => (
            <div key={String(label)} style={{ marginBottom: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem", fontWeight: 500 }}>
                <span>{label}</span>
                <span style={{ color: String(color), fontWeight: 700 }}>{pct}</span>
              </div>
              <div style={{ height: 7, background: "#F1F5F9", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${width}%`, background: String(color), borderRadius: 100 }} />
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #F1F5F9", fontSize: "0.72rem", color: "#94A3B8", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            All systems operational · 47 AI agents running
          </div>
        </div>
      </div>
    </section>
  );
}
