"use client";

const TESTIMONIALS = [
  { initials: "RK", name: "Rahul Krishnan", role: "Founder, UrbanScale Ventures", quote: "StrixMind cut our lead response time from hours to seconds. Our conversion rate doubled in the first month. The WhatsApp bot alone pays for itself.", avatarBg: "#0A5C68" },
  { initials: "PS", name: "Priya Suresh",   role: "Head of Growth, NovaBridge",   quote: "The multi-agent workflow builder is unlike anything I've seen. We automated our entire onboarding in an afternoon — no developers needed.", avatarBg: "#059669" },
  { initials: "AM", name: "Arjun Menon",    role: "CTO, Tessera Labs",            quote: "Finally a platform where AI actually understands our business. The knowledge base means our bots never say the wrong thing.", avatarBg: "#d97706" },
] as const;

export default function TestimonialsHomePageSection() {
  return (
    <section id="testimonials" style={{ background: "#fff", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>Testimonials</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1 }}>Trusted by teams<br/>who move fast.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name}
              style={{ background: "#D8E8E5", borderRadius: 24, padding: "2rem", border: "1px solid #E5E7EB", position: "relative", overflow: "hidden", transition: "transform 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}
            >
              <div style={{ position: "absolute", top: "0.75rem", right: "1.5rem", fontSize: "2.5rem", color: "rgba(10,92,104,0.12)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none" }}>"</div>
              <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.75, marginBottom: "1.5rem", fontStyle: "italic", fontWeight: 400 }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.1rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
