"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconTarget, IconBolt, IconLock, IconSprout } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface Value { icon: string; title: string; desc: string }
interface ValuesProps { eyebrow?: string; heading?: string; items?: Value[] }
const D = CONTENT_DEFAULTS["about.values"] as Required<ValuesProps>;

// SVG icons indexed to match the original emoji order: 🎯 ⚡ 🔒 🌱
const ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconTarget, IconBolt, IconLock, IconSprout,
];

export default function ValuesPageSection({ eyebrow = D.eyebrow, heading = D.heading, items = D.items }: ValuesProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#F4F2FE", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.1, marginBottom: "3rem" }}>{heading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {items.map((v, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <div key={v.title} style={{ background: "var(--surface)", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)", boxShadow: "0 4px 20px var(--glass-bg)", transition: "transform 0.3s ease" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--shadow)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Icon size={22} color="var(--accent)" strokeWidth={1.7} />
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{v.title}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{v.desc}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
