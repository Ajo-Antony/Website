"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconShuffle, IconBolt, IconShield, IconBook } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface Diff { icon: string; title: string; desc: string }
interface Stat { val: string; label: string }
interface Bar { label: string; pct: number }
interface WhyUsProps {
  eyebrow?: string; heading?: string; items?: Diff[];
  previewLabel?: string; stats?: Stat[]; bars?: Bar[]; statusLine?: string;
}

const D = CONTENT_DEFAULTS["home.whyUs"] as Required<WhyUsProps>;
const COLORS = ["var(--accent)", "var(--accent-teal)", "#f472b6", "#f59e0b"];
const BGS = ["var(--glass-bg)", "rgba(14,165,233,0.08)", "rgba(244,114,182,0.08)", "rgba(245,158,11,0.08)"];
const BAR_GRADS = ["linear-gradient(90deg,var(--accent-teal),#38bdf8)", "linear-gradient(90deg,var(--accent),var(--accent-2))", "linear-gradient(90deg,#f472b6,#fb7185)"];

// SVG icons indexed to match the original emoji order: 🔀 ⚡ 🛡️ 📚
const ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconShuffle, IconBolt, IconShield, IconBook,
];

export default function FeatureServicesHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, items = D.items,
  previewLabel = D.previewLabel, stats = D.stats, bars = D.bars, statusLine = D.statusLine,
}: WhyUsProps) {
  return (
    <section id="why" style={{ padding: "8rem 0", borderTop: "1px solid var(--glass-bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

          <div>
            <div style={{ display: "inline-flex", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-deep)", background: "rgba(108,99,255,0.07)", border: "1px solid var(--glass-bg)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
              {eyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text)", marginBottom: "2.5rem", whiteSpace: "pre-line" }}>
              {heading}
            </h2>
 
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((it, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                <div key={it.title}
                  style={{ display: "flex", gap: "1.25rem", padding: "1.5rem", borderRadius: 18, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", boxShadow: "0 4px 20px var(--shadow)" }}
                >
                  <div style={{ width: 42, height: 42, minWidth: 42, borderRadius: 12, background: BGS[i % BGS.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={COLORS[i % COLORS.length]} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>{it.title}</div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.65 }}>{it.desc}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
 
          <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(28px) saturate(200%)", boxShadow: "0 16px 56px rgba(99,88,210,0.18)", padding: "1.75rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent-teal))" }} />
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1.25rem" }}>{previewLabel}</div>
 
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {stats.map((m, i) => (
                <div key={m.label} style={{ padding: "1rem", borderRadius: 14, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.8)" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "1.4rem", fontWeight: 700, ...(i % 2 === 0 ? { background: "linear-gradient(135deg,var(--accent),var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "var(--accent-teal)" }) }}>{m.val}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--text-dim)", letterSpacing: "0.08em", marginTop: "0.2rem" }}>{m.label}</div>
                </div>
              ))}
            </div>
 
            {bars.map((b, i) => (
              <div key={b.label} style={{ marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.4rem", letterSpacing: "0.06em" }}>
                  <span>{b.label}</span><span>{b.pct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(108,99,255,0.1)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${b.pct}%`, background: BAR_GRADS[i % BAR_GRADS.length], borderRadius: 100 }} />
                </div>
              </div>
            ))}
 
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              {statusLine}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
