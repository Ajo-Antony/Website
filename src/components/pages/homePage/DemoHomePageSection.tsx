"use client";
import Link from "next/link";

const BULLETS = [
  { icon: "🎯", title: "Provider-agnostic AI routing", desc: "Route tasks to GPT-4o, Gemini, or Claude based on cost, speed, and accuracy — zero vendor lock-in." },
  { icon: "⚡", title: "Sub-second response latency",  desc: "Edge-deployed agents with smart caching keep every customer interaction instant at any scale." },
  { icon: "🛡️", title: "Enterprise-grade security",    desc: "SOC 2 aligned architecture, end-to-end encryption, role-based access control, and audit logs." },
  { icon: "📚", title: "Real-time knowledge base",     desc: "Upload your docs, FAQs, and SOPs — agents stay accurate, on-brand, and always up-to-date." },
] as const;


export default function DemoHomePageSection() {
  return (
    <section id="demo" style={{ background: "#EEF4FF", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

        {/* Left: copy */}
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            AI Platform
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1.1rem" }}>
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

        {/* Right: platform preview card */}
        <div style={{ background: "#fff", borderRadius: 28, padding: "2rem", boxShadow: "0 24px 80px rgba(0,99,229,0.12)", border: "1.5px solid #E5E7EB", position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0063E5, #6aabff)" }} />

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>StrixMind Platform</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.08)", border: "1px solid rgba(0,99,229,0.2)", padding: "0.28rem 0.75rem", borderRadius: 100 }}>
              Preview
            </div>
          </div>

          {/* Connected modules */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              ["💬", "WhatsApp", "Automated replies & broadcasts"],
              ["📥", "CRM & Leads", "Capture, score, and route"],
              ["✉️", "Email Campaigns", "Sequences & A/B testing"],
              ["🧩", "Workflows", "Multi-agent orchestration"],
            ].map(([icon, label, desc]) => (
              <div key={label} style={{ background: "#F8FAFF", borderRadius: 16, padding: "1.1rem", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{icon}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>{label}</div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.15rem" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.25rem", borderTop: "1px solid #F1F5F9", fontSize: "0.78rem", color: "#64748B", fontWeight: 500 }}>
            One platform. Every channel connected.
          </div>
        </div>
      </div>
    </section>
  );
}
