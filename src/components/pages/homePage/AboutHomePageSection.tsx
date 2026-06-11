export default function AboutHomePageSection() {
  return (
    <section style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>Our mission</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", marginBottom: "1.5rem" }}>
            We make AI<br />accessible to every business.
          </h2>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.8, marginBottom: "1.25rem" }}>
            StrixMind was built because we saw brilliant businesses losing deals to slower competitors who simply had better automation. We decided to change that.
          </p>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.8 }}>
            Our platform gives any team — from solo founders to enterprise ops — the same AI leverage previously reserved for tech giants.
          </p>
        </div>

        {/* Visual card */}
        <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 12px 48px rgba(99,88,210,0.14)", padding: "2.5rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18),transparent 70%)", pointerEvents: "none" }} />
          {[
            { year: "2022", text: "StrixMind founded in Kerala, India" },
            { year: "2023", text: "First 100 business customers" },
            { year: "2024", text: "Multi-agent workflow builder launched" },
            { year: "2025", text: "500+ businesses across 12 industries" },
          ].map((item, i) => (
            <div key={item.year} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < 3 ? "1.5rem" : 0, marginBottom: i < 3 ? "1.5rem" : 0, borderBottom: i < 3 ? "1px solid rgba(108,99,255,0.08)" : "none" }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", fontWeight: 700, color: "#6c63ff", minWidth: 40, paddingTop: "0.1rem" }}>{item.year}</div>
              <div style={{ fontSize: "0.9rem", color: "#5b5478", fontWeight: 300 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
