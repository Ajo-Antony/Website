"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What exactly is StrixMind?",
    a: "StrixMind is an AI-powered business operating system built for Indian businesses. It unifies lead generation, WhatsApp automation, CRM, multi-agent workflows, campaign outreach, and revenue analytics into one platform — so your entire growth stack runs from a single dashboard.",
  },
  {
    q: "How does the workflow automation work?",
    a: "Our visual drag-and-drop workflow builder lets you chain AI agents, triggers, conditions, and actions without writing a single line of code. Choose from 50+ pre-built templates or build fully custom flows from scratch. Most teams are live within their first session.",
  },
  {
    q: "Can I connect WhatsApp to StrixMind?",
    a: "Yes. StrixMind integrates natively with WhatsApp Business API. You can deploy intelligent bots, send broadcast messages, manage conversations, handle bookings, and automate follow-ups — all from one unified inbox. We support Hindi, Malayalam, Tamil, Telugu, and 10+ Indian languages.",
  },
  {
    q: "What AI models do you use?",
    a: "StrixMind uses a provider-agnostic AI routing layer, meaning your workflows can use GPT-4o, Google Gemini, or Anthropic Claude depending on the task's requirements for speed, accuracy, and cost. You're never locked into a single provider.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes — all plans include a 14-day free trial with no credit card required. You get full access to the Growth plan features during the trial period so you can evaluate the platform properly before committing.",
  },
  {
    q: "Can StrixMind be self-hosted?",
    a: "Enterprise plans include a self-hosted deployment option on your own infrastructure (Hetzner, AWS, Azure, or on-premise). Our team handles full setup, migration, and ongoing support with SLA guarantees.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Starter plans include email support. Growth plans include priority support with a 4-hour SLA. Enterprise plans come with a dedicated customer success manager, 24/7 phone support, and a guaranteed 99.99% uptime SLA.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most businesses are fully onboarded within 3 minutes for basic automation and under 1 day for complex enterprise workflows. We provide guided setup wizards, video walkthroughs, and live onboarding sessions for all new customers.",
  },
] as const;

export default function FaqHomePageSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "6rem", alignItems: "start" }}>

          {/* Left: sticky heading */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
              FAQ
            </div>
            <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Got questions?<br />We've got<br />answers.
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", lineHeight: 1.75, marginBottom: "2rem" }}>
              Can't find what you're looking for? Our team typically responds within 2 hours.
            </p>
            <a href="#contact" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0063E5", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.65rem 1.4rem", borderRadius: 100 }}>
              Ask us anything →
            </a>
          </div>

          {/* Right: accordion */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ background: open === i ? "#F8FAFF" : "#fff", borderRadius: 18, border: `1.5px solid ${open === i ? "rgba(0,99,229,0.2)" : "#E5E7EB"}`, overflow: "hidden", transition: "all 0.3s ease", boxShadow: open === i ? "0 8px 32px rgba(0,99,229,0.08)" : "none" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "1.4rem 1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
                >
                  <span style={{ fontSize: "0.975rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 30, height: 30, minWidth: 30, borderRadius: "50%",
                    background: open === i ? "#0063E5" : "#F1F5F9",
                    border: "1px solid #E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: open === i ? "#fff" : "#0063E5",
                    transform: open === i ? "rotate(180deg)" : "none",
                    transition: "all 0.3s ease", flexShrink: 0,
                  }}>▼</span>
                </button>

                <div style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                  padding: open === i ? "0 1.5rem 1.4rem" : "0 1.5rem",
                  fontSize: "0.9rem", color: "#64748B", lineHeight: 1.8,
                }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
