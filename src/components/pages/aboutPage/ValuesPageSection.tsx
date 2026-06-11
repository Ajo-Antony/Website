"use client";

const VALUES = [
  { icon: "🎯", title: "Radical simplicity",    desc: "Complex AI made simple. If your team needs a manual to use a feature, we haven't done our job." },
  { icon: "⚡", title: "Speed is a feature",    desc: "Every decision — design, infra, AI routing — is made to remove milliseconds and friction from your workflow." },
  { icon: "🔒", title: "Privacy by default",    desc: "Your data never trains our models. What's yours stays yours, encrypted end-to-end, always." },
  { icon: "🌱", title: "Growth over perfection", desc: "We ship, learn, and improve. Your feedback directly shapes our next release." },
] as const;

export default function ValuesPageSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#D8E8E5", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>Values</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "3rem" }}>What we believe.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ background: "#fff", borderRadius: 20, padding: "2rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 20px rgba(10,92,104,0.06)", transition: "transform 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}>
              <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{v.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{v.title}</div>
              <p style={{ fontSize: "0.875rem", color: "#64748B", lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
