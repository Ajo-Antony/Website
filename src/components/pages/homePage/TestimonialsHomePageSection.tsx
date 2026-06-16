"use client";

const TESTIMONIALS = [
  {
    initials: "RK", name: "Rahul Krishnan", role: "Founder, UrbanScale Ventures",
    quote: "StrixMind cut our lead response time from 6 hours to under 30 seconds. Our close rate doubled within the first month. The WhatsApp bot alone paid for itself in week two.",
    avatarBg: "#0063E5", stars: 5,
  },
  {
    initials: "PS", name: "Priya Suresh", role: "Head of Growth, NovaBridge",
    quote: "The multi-agent workflow builder is unlike anything I've ever seen. We automated our entire onboarding sequence — lead to contract — in a single afternoon, with zero developers.",
    avatarBg: "#059669", stars: 5,
  },
  {
    initials: "AM", name: "Arjun Menon", role: "CTO, Tessera Labs",
    quote: "Finally a platform where the AI actually understands our business context. The knowledge base integration means our bots never give wrong answers. Our support CSAT went from 72% to 94%.",
    avatarBg: "#d97706", stars: 5,
  },
] as const;

export default function TestimonialsHomePageSection() {
  return (
    <section id="testimonials" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            Customer Stories
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1 }}>
            Trusted by teams<br />who move fast.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              style={{ background: "#F8FAFF", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #E5E7EB", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}
              onMouseEnter={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "translateY(-5px)";
                d.style.boxShadow = "0 16px 48px rgba(0,99,229,0.1)";
                d.style.borderColor = "rgba(0,99,229,0.2)";
              }}
              onMouseLeave={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "";
                d.style.boxShadow = "";
                d.style.borderColor = "#E5E7EB";
              }}
            >
              {/* Quote mark */}
              <div style={{ position: "absolute", top: "1rem", right: "1.5rem", fontSize: "3.5rem", color: "rgba(0,99,229,0.08)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none", fontWeight: 700 }}>"</div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1.25rem" }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: "0.9rem" }}>★</span>
                ))}
              </div>

              <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.8, marginBottom: "1.75rem", fontStyle: "italic" }}>"{t.quote}"</p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.15rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
