"use client";

const LOGOS = ["NovaBridge","UrbanScale","Tessera Labs","ZenithCorp","ArcVentures","PeakFlow","BrightStack","NexaGrowth"];

export default function TrustedByHomePageSection() {
  return (
    <section style={{ background: "#F8FAFF", padding: "3rem 0", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#94A3B8", marginBottom: "2rem" }}>
          Trusted by 500+ businesses across India
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3.5rem", flexWrap: "wrap" as const }}>
          {LOGOS.map(l => (
            <span key={l}
              style={{ fontWeight: 800, fontSize: "1rem", color: "rgba(0,99,229,0.25)", letterSpacing: "-0.02em", transition: "color 0.2s", cursor: "default", userSelect: "none" as const }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(0,99,229,0.55)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,99,229,0.25)")}
            >{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
