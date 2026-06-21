"use client";

import { Workflow, Bot, MessageSquareText } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

/**
 * CapabilitiesShowcaseSection
 * ─────────────────────────────────────────────────────────────
 * Static decorative section — NOT part of the admin Section
 * Designer's CMS-managed list (src/lib/actions/sectionDesigner.ts),
 * so it can't currently be reordered/hidden from /admin. Wired
 * directly in src/app/page.tsx, right after the dynamic sections.
 *
 * Copy describes real, built StrixMind platform capabilities
 * (workflow engine, multi-agent orchestration, WhatsApp CRM) —
 * not metrics or testimonials — intentionally, since fabricated
 * social proof was stripped from this site earlier.
 * ─────────────────────────────────────────────────────────────
 */
const STACK_BASE =
  "before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0";

const CARDS = [
  {
    icon: <Workflow className="size-4 text-accent-2" />,
    title: "Workflow Automation",
    description: "Topological graph execution engine",
    date: "Core platform",
    className: `[grid-area:stack] hover:-translate-y-10 ${STACK_BASE}`,
  },
  {
    icon: <Bot className="size-4 text-accent-2" />,
    title: "Multi-Agent AI",
    description: "Six specialised agents, priority task queue",
    date: "Core platform",
    className: `[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 ${STACK_BASE}`,
  },
  {
    icon: <MessageSquareText className="size-4 text-accent-2" />,
    title: "WhatsApp CRM",
    description: "Session-aware messaging, pipelines, forecasting",
    date: "Core platform",
    className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
  },
];

export default function CapabilitiesShowcaseSection() {
  return (
    <section style={{ padding: "7rem 0 9rem", background: "#fbfaff", borderTop: "1px solid #f1effe" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#4c46c4", background: "rgba(108,99,255,0.08)",
            border: "1px solid rgba(108,99,255,0.16)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem",
          }}
        >
          Under the hood
        </div>
        <h2
          style={{
            fontSize: "clamp(1.9rem,3.5vw,2.9rem)", fontWeight: 800, letterSpacing: "-0.03em",
            color: "#1a1333", lineHeight: 1.15, marginBottom: "4rem",
          }}
        >
          One platform, three engines
        </h2>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "2rem" }}>
          <DisplayCards cards={CARDS} />
        </div>
      </div>
    </section>
  );
}
