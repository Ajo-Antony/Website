export default function StoryPageSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>Our story</div>
          <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1.5rem" }}>From frustration to platform.</h2>
          <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.8, marginBottom: "1rem" }}>StrixMind was born when our founders watched brilliant businesses lose deals simply because they couldn't respond fast enough. The tools existed — they were scattered, expensive, and required engineers to operate.</p>
          <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.8 }}>We built StrixMind to change that — one platform where AI does the heavy lifting from day one, accessible to any team regardless of technical expertise.</p>
        </div>
        <div style={{ background: "#D8E8E5", borderRadius: 24, padding: "2rem", border: "1px solid #E5E7EB", boxShadow: "0 8px 32px rgba(10,92,104,0.08)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#64748B", marginBottom: "1.25rem" }}>Timeline</div>
          {[["2022","Founded in Kochi, Kerala"],["2023","First 100 business customers"],["2024","Multi-agent workflow builder launched"],["2025","500+ businesses across 12 industries"]].map(([yr, txt], i, arr) => (
            <div key={yr} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < arr.length - 1 ? "1.25rem" : 0, marginBottom: i < arr.length - 1 ? "1.25rem" : 0, borderBottom: i < arr.length - 1 ? "1px solid rgba(10,92,104,0.1)" : "none" }}>
              <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0A5C68", minWidth: 40, fontFamily: "Inter, monospace" }}>{yr}</div>
              <div style={{ fontSize: "0.9rem", color: "#334155", fontWeight: 400 }}>{txt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
