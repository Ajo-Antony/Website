"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Faq { q: string; a: string }
interface FaqProps { eyebrow?: string; heading?: string; subheading?: string; ctaLabel?: string; items?: Faq[] }

const D = CONTENT_DEFAULTS["home.faq"] as Required<FaqProps>;

function formatHeadingWithAccent(text: string) {
  if (!text) return "";
  const t = text.trim();
  
  if (t.includes("answers.")) {
    return (
      <>
        Got questions?<br />We've got <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">answers.</span>
      </>
    );
  }
  
  const words = t.split(/\s+/);
  if (words.length <= 1) return text;
  const lastWord = words[words.length - 1];
  const rest = words.slice(0, words.length - 1).join(" ");
  return (
    <>
      {rest}{" "}
      <span style={{ fontFamily: "var(--font-accent)" }} className="italic font-normal text-[var(--accent)]">
        {lastWord}
      </span>
    </>
  );
}

export default function FaqHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, ctaLabel = D.ctaLabel, items = D.items,
}: FaqProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "var(--surface)", borderTop: "1px solid var(--divider)" }} className="py-20 sm:py-28">
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] items-start gap-8 lg:gap-24">

          <div className="lg:sticky lg:top-8">
            <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
              {eyebrow}
            </div>
            <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, marginBottom: "1.25rem", whiteSpace: "pre-line" }}>
              {formatHeadingWithAccent(heading)}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "2rem" }}>
              {subheading}
            </p>
            <a href="#contact" style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--accent-deep)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.65rem 1.4rem", borderRadius: 100 }}>
              {ctaLabel}
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
            {items.map((faq, i) => (
              <div
                key={i}
                style={{ background: open === i ? "var(--surface-alt)" : "var(--surface)", borderRadius: 18, border: "1.5px solid var(--border)", overflow: "hidden", transition: "all 0.3s ease", boxShadow: open === i ? "0 8px 32px var(--shadow)" : "none" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "1.4rem 1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
                >
                  <span style={{ fontSize: "0.975rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 30, height: 30, minWidth: 30, borderRadius: "50%",
                    background: open === i ? "var(--accent)" : "var(--glass-bg)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: open === i ? "rotate(180deg)" : "none",
                    transition: "all 0.3s ease", flexShrink: 0,
                  }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={open === i ? "#fff" : "var(--accent)"} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </button>

                <div style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                  padding: open === i ? "0 1.5rem 1.4rem" : "0 1.5rem",
                  fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.8,
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
