"use client";

// ── IMAGE GUIDE ─────────────────────────────────────────────────
// Team photos: /public/images/team/member-1.jpg  (400×400 square, cropped face)
// Replace the initials avatars below with <Image> once photos are ready.
// ────────────────────────────────────────────────────────────────

const TEAM = [
  { initials: "AK", name: "Antony Kuriakose", role: "Founder & CEO", bio: "AI systems architect with 10+ years in enterprise automation.", grad: "linear-gradient(135deg,#6c63ff,#a78bfa)" },
  { initials: "PS", name: "Priya Suresh",     role: "Head of Product", bio: "Previously built growth tooling at Razorpay and Freshworks.", grad: "linear-gradient(135deg,#0ea5e9,#38bdf8)" },
  { initials: "RK", name: "Rahul Krishnan",   role: "Lead Engineer",   bio: "Full-stack engineer specialising in AI inference pipelines.", grad: "linear-gradient(135deg,#f472b6,#fb7185)" },
  { initials: "AM", name: "Arjun Menon",      role: "Head of Growth",  bio: "Scaled 3 SaaS companies from zero to ₹10Cr ARR.", grad: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
] as const;

export default function BarbersTeamHomePageSection() {
  return (
    <section id="team" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>The team</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333" }}>
            Built by people who<br />obsess over your growth.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {TEAM.map((member) => (
            <div key={member.name} style={{ padding: "2rem", borderRadius: 22, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(99,88,210,0.10)", textAlign: "center", transition: "transform 0.25s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}>
              {/* Avatar — swap for <Image> when photos ready */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: member.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{member.initials}</div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.9rem", fontWeight: 700, color: "#1a1333", marginBottom: "0.25rem" }}>{member.name}</div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6c63ff", marginBottom: "0.75rem" }}>{member.role}</div>
              <p style={{ fontSize: "0.82rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.65 }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
