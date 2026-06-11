"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const S = {
  section: { minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 72, position: "relative" as const, overflow: "hidden" as const, background: "#D8E8E5" },
  circle: (w: number, top: string | number, right: string | number, dur = 30): React.CSSProperties => ({ position: "absolute", width: w, height: w, borderRadius: "50%", border: "1px solid rgba(10,92,104,0.07)", top, right, animation: `rotate-slow ${dur}s linear infinite`, pointerEvents: "none" as const }),
};

export default function HeroHomePageSection() {
  const countRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const targets = [500, 10, 98];
    countRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = targets[i];
      const start = performance.now();
      const update = (now: number) => {
        const p = Math.min((now - start) / 2000, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(update);
      };
      setTimeout(() => requestAnimationFrame(update), 600 + i * 200);
    });
  }, []);

  return (
    <section style={S.section}>
      <style>{`@keyframes rotate-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes float-card{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div style={S.circle(700,-200,-200)}/>
      <div style={S.circle(500,-100,-100,20)}/>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
        {/* Left */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", border: "1px solid rgba(10,92,104,0.15)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.75rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0A5C68", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
            AI Business Platform
          </div>
          <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}`}</style>

          <h1 style={{ fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#0F172A", marginBottom: "1.5rem" }}>
            Automate Workflows.<br/>
            <span style={{ background: "linear-gradient(135deg,#0A5C68 0%,#14b8a6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Scale Operations.
            </span><br/>
            Grow Without Limits.
          </h1>

          <p style={{ fontSize: "1.125rem", color: "#64748B", lineHeight: 1.75, fontWeight: 400, marginBottom: "2.5rem", maxWidth: 480 }}>
            AI-powered CRM, workflow automation, lead management, customer support, and business intelligence — all in one platform.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "3rem" }}>
            <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, padding: "0.9rem 2.25rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 32px rgba(10,92,104,0.30)", transition: "all 0.3s ease" }}>
              Start Free Trial →
            </Link>
            <Link href="/#demo" style={{ fontSize: "1rem", fontWeight: 600, padding: "0.9rem 2.25rem", background: "rgba(255,255,255,0.7)", border: "1.5px solid #E5E7EB", color: "#0F172A", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", backdropFilter: "blur(8px)" }}>
              Book Demo
            </Link>
          </div>

          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" as const }}>
            {[["500", "+", "Businesses"], ["10", "×", "Lead velocity"], ["98", "%", "Uptime SLA"]].map(([v, s, l], i) => (
              <div key={l}>
                <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <span ref={el => { countRefs.current[i] = el; }}>0</span>
                  <span style={{ color: "#0A5C68" }}>{s}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.25rem", fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — dashboard card */}
        <div style={{ position: "relative" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "2rem", boxShadow: "0 24px 80px rgba(10,92,104,0.14)", border: "1px solid #E5E7EB", animation: "float-card 6s ease-in-out infinite" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>Revenue Dashboard</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#fff", background: "#0A5C68", padding: "0.25rem 0.65rem", borderRadius: 100, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: "pulse-dot 1.5s infinite", display: "inline-block" }} /> Live
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[["₹18.4L","Revenue"],["2,847","Active Leads"],["99.8%","Uptime"],["4.2s","Avg Response"]].map(([v,l]) => (
                <div key={l} style={{ background: "#D8E8E5", borderRadius: 14, padding: "0.875rem", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>{v}</div>
                  <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.15rem" }}>{l}</div>
                </div>
              ))}
            </div>
            {[["WhatsApp rate","82%",82,"#0A5C68"],["Campaign opens","67%",67,"#10b981"],["Lead score","91%",91,"#f59e0b"]].map(([l,pct,w,c]) => (
              <div key={String(l)} style={{ marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748B", marginBottom: "0.3rem", fontWeight: 500 }}><span>{l}</span><span style={{ color: String(c), fontWeight: 700 }}>{pct}</span></div>
                <div style={{ height: 5, background: "#D8E8E5", borderRadius: 100, overflow: "hidden", border: "1px solid #E5E7EB" }}><div style={{ height: "100%", width: `${w}%`, background: String(c), borderRadius: 100 }} /></div>
              </div>
            ))}
          </div>
          {/* Float badges */}
          <div style={{ position: "absolute", bottom: -20, left: -30, background: "#fff", borderRadius: 18, padding: "1rem 1.25rem", border: "1px solid #E5E7EB", boxShadow: "0 12px 40px rgba(10,92,104,0.12)", display: "flex", alignItems: "center", gap: "0.75rem", animation: "float-card 5s ease-in-out infinite 1s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>✓</div>
            <div><div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>Deal closed</div><div style={{ fontSize: "0.68rem", color: "#64748B" }}>₹2.4L — just now</div></div>
          </div>
          <div style={{ position: "absolute", top: -20, right: -20, background: "#fff", borderRadius: 18, padding: "1rem 1.25rem", border: "1px solid #E5E7EB", boxShadow: "0 12px 40px rgba(10,92,104,0.12)", display: "flex", alignItems: "center", gap: "0.75rem", animation: "float-card 7s ease-in-out infinite 2s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,92,104,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🤖</div>
            <div><div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>AI Agent active</div><div style={{ fontSize: "0.68rem", color: "#64748B" }}>12 conversations</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
