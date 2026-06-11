"use client";

// ── IMAGE GUIDE ──────────────────────────────────────────────
// Drop photos at: /public/images/team/member-name.jpg (400×400)
// Then replace the initials avatar div with:
//   <Image src="/images/team/antony.jpg" alt="..." width={72} height={72}
//          style={{ borderRadius:"50%", objectFit:"cover" }} />
// ─────────────────────────────────────────────────────────────
const TEAM = [
  { initials: "AK", name: "Antony Kuriakose", role: "Founder & CEO",   bio: "AI systems architect with 10+ years in enterprise automation.", grad: "linear-gradient(135deg,#0A5C68,#14b8a6)" },
  { initials: "PS", name: "Priya Suresh",     role: "Head of Product", bio: "Previously built growth tooling at Razorpay and Freshworks.", grad: "linear-gradient(135deg,#059669,#34d399)" },
  { initials: "RK", name: "Rahul Krishnan",   role: "Lead Engineer",   bio: "Full-stack engineer specialising in AI inference pipelines.", grad: "linear-gradient(135deg,#d97706,#fbbf24)" },
  { initials: "AM", name: "Arjun Menon",      role: "Head of Growth",  bio: "Scaled 3 SaaS companies from zero to ₹10Cr ARR.", grad: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
] as const;

export default function TeamPageSection() {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>The team</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "3rem" }}>Meet the builders.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {TEAM.map(m => (
            <div key={m.name} style={{ background: "#D8E8E5", borderRadius: 22, padding: "2rem", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(10,92,104,0.14)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: m.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{m.initials}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.25rem", letterSpacing: "-0.01em" }}>{m.name}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0A5C68", marginBottom: "0.75rem" }}>{m.role}</div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.65 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
