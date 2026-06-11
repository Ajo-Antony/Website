"use client";
import { useState } from "react";

const FAQS = [
  { q: "What is StrixMind?", a: "StrixMind is an AI-powered business operating system that unifies lead generation, WhatsApp automation, CRM, multi-agent workflows, campaign outreach, and revenue analytics into one elegant platform." },
  { q: "How does workflow automation work?", a: "Our visual drag-and-drop workflow builder lets you chain AI agents, triggers, conditions, and actions without writing code. Choose from pre-built templates or build custom flows from scratch in minutes." },
  { q: "Can I connect WhatsApp?", a: "Yes. StrixMind integrates directly with WhatsApp Business API. Deploy intelligent bots, send broadcasts, manage conversations, and automate follow-ups — all from one dashboard." },
  { q: "Do you support AI agents?", a: "Absolutely. StrixMind includes purpose-built AI agents for sales, customer support, HR, and legal. Each agent is trained on your knowledge base and customised to match your brand voice." },
  { q: "Can I self-host StrixMind?", a: "Enterprise plans include a self-hosted deployment option. Contact our team to discuss Hetzner, AWS, or on-premise deployment with full support and SLA guarantees." },
  { q: "What pricing plans are available?", a: "We offer Starter (₹4,999/mo), Growth (₹14,999/mo), and Enterprise (custom). All plans include a 14-day free trial with no credit card required. Annual billing saves 20%." },
] as const;

export default function FaqHomePageSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "#D8E8E5", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1 }}>Frequently asked questions.</h2>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
          {FAQS.map((faq, i) => (
            <div key={i}
              style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB", overflow: "hidden", transition: "box-shadow 0.3s ease", boxShadow: open === i ? "0 8px 32px rgba(10,92,104,0.10)" : "none" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", textAlign: "left", padding: "1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{
                  width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                  background: open === i ? "#0A5C68" : "#D8E8E5",
                  border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", color: open === i ? "#fff" : "#0A5C68",
                  transform: open === i ? "rotate(180deg)" : "none",
                  transition: "all 0.3s ease", flexShrink: 0,
                }}>▼</span>
              </button>

              <div style={{
                maxHeight: open === i ? 200 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease, padding 0.3s ease",
                padding: open === i ? "0 1.5rem 1.5rem" : "0 1.5rem",
                fontSize: "0.9rem", color: "#64748B", lineHeight: 1.7,
              }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
