"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Faq { q: string; a: string }
interface FaqProps { eyebrow?: string; heading?: string; subheading?: string; ctaLabel?: string; items?: Faq[] }

const D = CONTENT_DEFAULTS["home.faq"] as Required<FaqProps>;

export default function FaqHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, ctaLabel = D.ctaLabel, items = D.items,
}: FaqProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid var(--divider)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "6rem", alignItems: "start" }}>

          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.16)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
              {eyebrow}
            </div>
            <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#1a1333", lineHeight: 1.1, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>
              {heading}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#5b5478", lineHeight: 1.75, marginBottom: "2rem" }}>
              {subheading}
            </p>
            <a href="#contact" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#4c46c4", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.16)", padding: "0.65rem 1.4rem", borderRadius: 100 }}>
              {ctaLabel}
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
            {items.map((faq, i) => (
              <div
                key={i}
                style={{ background: open === i ? "#f8f7ff" : "#fff", borderRadius: 18, border: `1.5px solid ${open === i ? "rgba(108,99,255,0.25)" : "#E5E0FA"}`, overflow: "hidden", transition: "all 0.3s ease", boxShadow: open === i ? "0 8px 32px rgba(108,99,255,0.10)" : "none" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "1.4rem 1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
                >
                  <span style={{ fontSize: "0.975rem", fontWeight: 700, color: "#1a1333", lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 30, height: 30, minWidth: 30, borderRadius: "50%",
                    background: open === i ? "#6c63ff" : "#F1EFFE",
                    border: "1px solid #E5E0FA",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: open === i ? "#fff" : "#6c63ff",
                    transform: open === i ? "rotate(180deg)" : "none",
                    transition: "all 0.3s ease", flexShrink: 0,
                  }}>▼</span>
                </button>

                <div style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                  padding: open === i ? "0 1.5rem 1.4rem" : "0 1.5rem",
                  fontSize: "0.9rem", color: "#5b5478", lineHeight: 1.8,
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
