"use client";

const LOGOS = ["NovaBridge","UrbanScale","Tessera Labs","ZenithCorp","ArcVentures","PeakFlow"];
export default function TrustedByHomePageSection() {
  return (
    <section style={{ background: "#fff", padding: "3.5rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#64748B", marginBottom: "2.5rem" }}>Trusted by forward-thinking businesses</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem", flexWrap: "wrap" as const }}>
          {LOGOS.map(l => <span key={l} style={{ fontWeight: 800, fontSize: "1.1rem", color: "rgba(10,92,104,0.3)", letterSpacing: "-0.02em", transition: "color 0.2s", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(10,92,104,0.6)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(10,92,104,0.3)")}>{l}</span>)}
        </div>
      </div>
    </section>
  );
}
