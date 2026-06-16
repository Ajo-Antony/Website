"use client";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    billing: "Billed monthly",
    accent: false,
    desc: "Perfect for solo founders and small teams just getting started with AI automation.",
    features: [
      "1,000 leads/month",
      "WhatsApp bot (500 messages)",
      "Basic CRM + pipeline",
      "Email campaign module",
      "2 workflow automations",
      "Email support",
    ],
    cta: "Start free trial",
    ctaHref: "/booking",
    solid: false,
  },
  {
    name: "Growth",
    price: "₹14,999",
    period: "/month",
    billing: "Save 20% annually",
    accent: true,
    desc: "Full AI power for scaling teams ready to automate sales, support, and operations.",
    features: [
      "10,000 leads/month",
      "Unlimited WhatsApp messages",
      "AI CRM + lead scoring",
      "Multi-channel campaigns",
      "5 multi-agent workflows",
      "Real-time analytics dashboard",
      "Priority support (4hr SLA)",
    ],
    cta: "Start free trial",
    ctaHref: "/booking",
    solid: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    billing: "Volume pricing available",
    accent: false,
    desc: "Full-platform access with dedicated infrastructure, custom AI models, and white-glove onboarding.",
    features: [
      "Unlimited leads",
      "Custom AI model routing",
      "Dedicated agent cluster",
      "SSO + SAML authentication",
      "Self-hosted deployment option",
      "99.99% SLA guarantee",
      "Dedicated success manager",
    ],
    cta: "Book a call",
    ctaHref: "/#contact",
    solid: false,
  },
] as const;

export default function PricingHomePageSection() {
  return (
    <section id="pricing" style={{ background: "#EEF4FF", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            Pricing
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>
            Simple, transparent pricing.
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748B", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
            No credit card required. 14-day free trial on all plans. Cancel any time.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: 1060, margin: "0 auto" }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              style={{
                background: "#fff",
                borderRadius: 28,
                padding: "2.5rem",
                border: plan.accent ? "2px solid #0063E5" : "1.5px solid #E5E7EB",
                boxShadow: plan.accent ? "0 24px 64px rgba(0,99,229,0.16)" : "none",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s ease",
              }}
              onMouseEnter={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "translateY(-6px)";
                if (!plan.accent) d.style.boxShadow = "0 16px 48px rgba(0,99,229,0.1)";
              }}
              onMouseLeave={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.transform = "";
                if (!plan.accent) d.style.boxShadow = "none";
              }}
            >
              {/* Accent top bar */}
              {plan.accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #0063E5, #6aabff)" }} />}

              {/* Popular badge */}
              {plan.accent && (
                <div style={{ position: "absolute", top: "1.4rem", right: "1.4rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#fff", background: "#0063E5", padding: "0.28rem 0.75rem", borderRadius: 100 }}>
                  Most Popular
                </div>
              )}

              <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0063E5", marginBottom: "0.75rem" }}>{plan.name}</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1 }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>{plan.period}</span>}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "1.25rem", fontWeight: 500 }}>{plan.billing}</div>

              <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem", lineHeight: 1.65 }}>{plan.desc}</p>
              <div style={{ height: "1px", background: "#F1F5F9", marginBottom: "1.5rem" }} />

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.75rem", marginBottom: "2.25rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", fontSize: "0.875rem", color: "#374151" }}>
                    <span style={{ color: "#0063E5", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0, marginTop: "0.05rem" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  padding: "0.95rem",
                  borderRadius: 100,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  ...(plan.solid
                    ? { background: "#0063E5", color: "#fff", boxShadow: "0 8px 24px rgba(0,99,229,0.3)" }
                    : { background: "#EEF4FF", color: "#0063E5", border: "1.5px solid rgba(0,99,229,0.2)" }),
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "#94A3B8" }}>
          All prices in INR. GST applicable. Annual plans available at 20% discount. <Link href="/#contact" style={{ color: "#0063E5", fontWeight: 600, textDecoration: "none" }}>Talk to sales →</Link>
        </p>
      </div>
    </section>
  );
}
