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
    className: `[grid-area:stack] translate-x-4 translate-y-6 sm:translate-x-16 sm:translate-y-10 hover:-translate-y-1 ${STACK_BASE}`,
  },
  {
    icon: <MessageSquareText className="size-4 text-accent-2" />,
    title: "WhatsApp CRM",
    description: "Session-aware messaging, pipelines, forecasting",
    date: "Core platform",
    className: "[grid-area:stack] translate-x-8 translate-y-12 sm:translate-x-32 sm:translate-y-20 hover:translate-y-10",
  },
];

export default function CapabilitiesShowcaseSection() {
  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--divider)", overflowX: "hidden" }} className="py-20 sm:py-28 md:pb-36">
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }} className="px-5 sm:px-8">
        <div
          style={{
            display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--accent-deep)", background: "var(--glass-bg)",
            border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem",
          }}
        >
          Under the hood
        </div>
        <h2
          style={{
            fontSize: "clamp(1.9rem,3.5vw,2.9rem)", fontWeight: 800, letterSpacing: "-0.03em",
            color: "var(--text)", lineHeight: 1.15, marginBottom: "3.5rem",
          }}
        >
          One platform, three engines
        </h2>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "1.5rem" }}>
          <DisplayCards cards={CARDS} />
        </div>
      </div>
    </section>
  );
}
