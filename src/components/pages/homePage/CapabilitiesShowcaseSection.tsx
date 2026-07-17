"use client";

import { 
  Workflow, Bot, MessageSquareText,
  Cpu, MousePointerClick, Puzzle, Code2, Database, Zap,
  Hammer, TrendingUp, Users, Building2, Lightbulb,
  Layers, ShieldCheck, Heart 
} from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";
import { motion } from "framer-motion";

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

const MATRIX_COLUMNS = [
  {
    title: "SKILL LEVEL",
    items: [
      { name: "AI Builders", icon: Cpu },
      { name: "No Code", icon: MousePointerClick },
      { name: "Beginners", icon: Puzzle },
      { name: "Developers", icon: Code2 },
      { name: "Postgres Devs", icon: Database },
      { name: "Vibe Coders", icon: Zap },
    ]
  },
  {
    title: "WHO IT'S FOR",
    items: [
      { name: "Hackathon Contestants", icon: Hammer },
      { name: "Startups", icon: TrendingUp },
      { name: "Agencies", icon: Users },
      { name: "Enterprise", icon: Building2 },
      { name: "Innovation Teams", icon: Lightbulb },
    ]
  },
  {
    title: "APP TYPE",
    items: [
      { name: "Hosted Postgres", icon: Database },
      { name: "B2B SaaS", icon: Layers },
      { name: "FinServ", icon: ShieldCheck },
      { name: "Healthcare", icon: Heart },
      { name: "Agents", icon: Bot },
    ]
  }
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

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "3rem" }}>
          <DisplayCards cards={CARDS} />
        </div>

        {/* Dynamic Classification Grid — custom layout modeled exactly on the user's attachment */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
          <div className="bg-zinc-950 border border-zinc-800/80 shadow-[0_24px_64px_rgba(0,0,0,0.5)] rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden">
            {/* Ambient grid background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(108,99,255,0.06),transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,210,180,0.03),transparent_40%)] pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 relative z-10">
              {MATRIX_COLUMNS.map((column, colIdx) => (
                <div key={column.title} className="space-y-6">
                  {/* Column Header */}
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-mono font-black tracking-[0.18em] text-zinc-500 uppercase">
                      {column.title}
                    </h3>
                    <div className="h-[2px] w-8 bg-accent/30 mt-2 rounded-full" />
                  </div>

                  {/* List Items */}
                  <ul className="space-y-4">
                    {column.items.map((item, itemIdx) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: colIdx * 0.1 + itemIdx * 0.05 }}
                          className="flex items-center gap-3.5 group cursor-pointer py-1"
                        >
                          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800/60 group-hover:bg-zinc-800 group-hover:border-accent/40 text-zinc-400 group-hover:text-accent transition-all duration-300 shadow-inner">
                            <IconComponent size={15} className="stroke-[1.75]" />
                          </div>
                          <span className="text-[13px] sm:text-sm font-semibold tracking-tight text-zinc-300 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                            {item.name}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
