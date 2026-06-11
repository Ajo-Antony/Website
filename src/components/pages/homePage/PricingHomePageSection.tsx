"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Starter", price: "₹4,999", period: "/month", accent: false,
    desc: "Perfect for solo founders and small teams getting started with AI automation.",
    features: ["1,000 leads/month","WhatsApp bot (500 msgs)","Basic CRM","Email campaigns","Email support"],
    cta: "Start free trial", ctaStyle: "ghost",
  },
  {
    name: "Growth", price: "₹14,999", period: "/month", accent: true,
    desc: "Full AI power for scaling your sales and marketing operations.",
    features: ["10,000 leads/month","Unlimited WhatsApp","AI CRM + lead scoring","Multi-channel campaigns","5 AI agent workflows","Priority support"],
    cta: "Start free trial", ctaStyle: "solid",
  },
  {
    name: "Enterprise", price: "Custom", period: "", accent: false,
    desc: "Full-platform access, dedicated infrastructure, and white-glove onboarding.",
    features: ["Unlimited leads","Custom AI model routing","Dedicated agent cluster","SSO + SAML","99.99% SLA guarantee","Dedicated success manager"],
    cta: "Book a call", ctaStyle: "ghost",
  },
] as const;

export default function PricingHomePageSection() {
  return (
    <section id="pricing" style={{ background: "#D8E8E5", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>Pricing</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>Simple, transparent pricing.</h2>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>No credit card required. 14-day free trial. Cancel any time.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: "#fff", borderRadius: 24, padding: "2.25rem",
              border: plan.accent ? "2px solid #0A5C68" : "1px solid #E5E7EB",
              boxShadow: plan.accent ? "0 24px 64px rgba(10,92,104,0.18)" : "none",
              position: "relative", overflow: "hidden",
              transition: "all 0.4s ease",
            }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(-6px)"; d.style.boxShadow = "0 16px 48px rgba(10,92,104,0.14)"; }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = ""; d.style.boxShadow = plan.accent ? "0 24px 64px rgba(10,92,104,0.18)" : "none"; }}
            >
              {plan.accent && (
                <>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#0A5C68,#14b8a6)" }} />
                  <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#fff", background: "#0A5C68", padding: "0.25rem 0.7rem", borderRadius: 100 }}>Most Popular</div>
                </>
              )}

              <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0A5C68", marginBottom: "0.75rem" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1 }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: "0.875rem", color: "#64748B" }}>{plan.period}</span>}
              </div>
              <p style={{ fontSize: "0.875rem", color: "#64748B", margin: "0 0 1.25rem", lineHeight: 1.6 }}>{plan.desc}</p>
              <div style={{ height: 1, background: "#E5E7EB", marginBottom: "1.25rem" }} />

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.7rem", marginBottom: "2rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "#0F172A" }}>
                    <span style={{ color: "#0A5C68", fontWeight: 700, fontSize: "1rem", flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.name === "Enterprise" ? "/#contact" : "/booking"}
                style={{
                  display: "block", textAlign: "center", fontSize: "0.9rem", fontWeight: 700,
                  padding: "0.875rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s ease",
                  ...(plan.ctaStyle === "solid"
                    ? { background: "#0A5C68", color: "#fff", boxShadow: "0 8px 24px rgba(10,92,104,0.3)" }
                    : { background: "#D8E8E5", color: "#0A5C68", border: "1.5px solid rgba(10,92,104,0.2)" })
                }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
