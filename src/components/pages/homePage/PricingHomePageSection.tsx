 "use client";
import Link from "next/link";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Plan { name: string; price: string; period: string; billing: string; popular: boolean; desc: string; features: string[]; cta: string; ctaHref: string }
interface PricingProps { eyebrow?: string; heading?: string; subheading?: string; note?: string; plans?: Plan[] }

const D = CONTENT_DEFAULTS["home.pricing"] as Required<PricingProps>;

export default function PricingHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, note = D.note, plans = D.plans,
}: PricingProps) {
  return (
    <section id="pricing" style={{ background: "var(--surface-alt)", padding: "7rem 0", borderTop: "1px solid var(--divider)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, marginBottom: "1rem" }}>
            {heading}
          </h2>
          <p data-strix-fade-up style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
            {subheading}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: 1060, margin: "0 auto" }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: "var(--surface)",
                borderRadius: 28,
                padding: "2.5rem",
                border: plan.popular ? "2px solid var(--accent)" : "1.5px solid var(--border)",
                boxShadow: plan.popular ? "0 24px 64px var(--glass-bg)" : "none",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s ease",
              }}
            >
              {plan.popular && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }} />}

              {plan.popular && (
                <div style={{ position: "absolute", top: "1.4rem", right: "1.4rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#fff", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", padding: "0.28rem 0.75rem", borderRadius: 100 }}>
                  Most Popular
                </div>
              )}

              <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", marginBottom: "0.75rem" }}>{plan.name}</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "2.75rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>{plan.period}</span>}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "1.25rem", fontWeight: 500 }}>{plan.billing}</div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.65 }}>{plan.desc}</p>
              <div style={{ height: "1px", background: "#F1EFFE", marginBottom: "1.5rem" }} />

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.75rem", marginBottom: "2.25rem", padding: 0 }}>
                {plan.features.map(feat => (
                  <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", fontSize: "0.875rem", color: "#3a3458" }}>
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "0.1rem" }} aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {feat}
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
                  ...(plan.popular
                    ? { background: "linear-gradient(135deg,var(--accent),var(--accent-2))", color: "#fff", boxShadow: "0 8px 24px var(--shadow-strong)" }
                    : { background: "#F4F2FE", color: "var(--accent-deep)", border: "1.5px solid var(--glass-bg)" }),
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
          {note} <Link href="/#contact" style={{ color: "var(--accent-deep)", fontWeight: 600, textDecoration: "none" }}>Talk to sales →</Link>
        </p>
      </div>
    </section>
  );
}
