"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconPlug, IconPuzzle, IconRocket, IconChart } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface Step { icon: string; title: string; desc: string }
interface WorkflowProps { eyebrow?: string; heading?: string; subheading?: string; steps?: Step[] }

const D = CONTENT_DEFAULTS["home.workflow"] as Required<WorkflowProps>;

// SVG icons indexed to match the original emoji order: 🔌 🧩 🚀 📈
const ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconPlug, IconPuzzle, IconRocket, IconChart,
];

export default function WorkflowHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, steps = D.steps,
}: WorkflowProps) {
  return (
    <section id="workflow" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid var(--divider)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div data-strix-divider-h style={{ height: 1, background: "linear-gradient(90deg, transparent, #6c63ff, transparent)", marginBottom: "4rem", opacity: 0.3 }} />

        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div data-strix-tag-badge style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.16)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#1a1333", lineHeight: 1.1, marginBottom: "1rem" }}>
            {heading}
          </h2>
          <p data-strix-fade-up style={{ fontSize: "1.1rem", color: "#5b5478", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
            {subheading}
          </p>
        </div>

        <div data-strix-stagger-grid style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", position: "relative" }}>

          <div
            data-strix-connector
            style={{ position: "absolute", top: 44, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg, #6c63ff, rgba(108,99,255,0.25))", zIndex: 0 }}
          />

          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <div key={step.title} data-strix-grid-item style={{ position: "relative", zIndex: 1 }}>
              <div
                data-strix-step-circle
                style={{ width: 88, height: 88, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#6c63ff,#a78bfa)" : "#fff", border: `2px solid ${i === 0 ? "transparent" : "#E5E0FA"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", boxShadow: i === 0 ? "0 8px 32px rgba(108,99,255,0.4)" : "0 4px 20px rgba(99,88,210,0.08)", transition: "all 0.35s ease" }}
              >
                <Icon size={32} color={i === 0 ? "#fff" : "#6c63ff"} strokeWidth={1.6} />
              </div>

              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#6c63ff", marginBottom: "0.6rem" }}>
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1a1333", marginBottom: "0.75rem", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#5b5478", lineHeight: 1.8 }}>
                {step.desc}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
