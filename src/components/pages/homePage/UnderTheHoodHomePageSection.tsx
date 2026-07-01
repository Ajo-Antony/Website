"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconUsers, IconRobot, IconWhatsapp } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface Engine { title: string; tagline: string; desc: string }
interface UnderTheHoodProps { eyebrow?: string; heading?: string; subheading?: string; engines?: Engine[] }

const D = CONTENT_DEFAULTS["home.underTheHood"] as Required<UnderTheHoodProps>;

// Indexed to the three engines in order: CRM, Automation, Communication
const ICONS: ElementType<{ size?: number; color?: string; strokeWidth?: number }>[] = [
  IconUsers, IconRobot, IconWhatsapp,
];

export default function UnderTheHoodHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, engines = D.engines,
}: UnderTheHoodProps) {
  return (
    <section id="under-the-hood" style={{ background: "var(--surface)", padding: "7rem 0", borderTop: "1px solid var(--divider)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div data-strix-divider-h style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--accent), transparent)", marginBottom: "4rem", opacity: 0.3 }} />

        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div data-strix-tag-badge style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, marginBottom: "1rem" }}>
            {heading}
          </h2>
          <p data-strix-fade-up style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            {subheading}
          </p>
        </div>

        <div data-strix-stagger-grid style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {engines.map((engine, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={engine.title}
                data-strix-grid-item
                style={{ position: "relative", padding: "2.25rem 2rem", borderRadius: "1.25rem", border: "1px solid var(--border)", background: "linear-gradient(180deg, #fbfaff 0%, #ffffff 60%)", transition: "all 0.35s ease" }}
              >
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "1.5rem" }}>
                  Engine {String(i + 1).padStart(2, "0")}
                </div>

                <div
                  data-strix-step-circle
                  style={{ width: 64, height: 64, borderRadius: "1rem", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", boxShadow: "0 8px 28px var(--shadow-strong)" }}
                >
                  <Icon size={28} color="#fff" strokeWidth={1.6} />
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.4rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {engine.title}
                </h3>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)", marginBottom: "0.9rem" }}>
                  {engine.tagline}
                </div>
                <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  {engine.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
