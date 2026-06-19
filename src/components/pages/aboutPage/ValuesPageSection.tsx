"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Value { icon: string; title: string; desc: string }
interface ValuesProps { eyebrow?: string; heading?: string; items?: Value[] }
const D = CONTENT_DEFAULTS["about.values"] as Required<ValuesProps>;

export default function ValuesPageSection({ eyebrow = D.eyebrow, heading = D.heading, items = D.items }: ValuesProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#F4F2FE", borderTop: "1px solid #E5E0FA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.09)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1a1333", lineHeight: 1.1, marginBottom: "3rem" }}>{heading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {items.map(v => (
            <div key={v.title} style={{ background: "#fff", borderRadius: 20, padding: "2rem", border: "1px solid #E5E0FA", boxShadow: "0 4px 20px rgba(108,99,255,0.06)", transition: "transform 0.3s ease" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{v.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1333", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{v.title}</div>
              <p style={{ fontSize: "0.875rem", color: "#5b5478", lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
