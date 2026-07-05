import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Milestone { year: string; text: string }
interface MissionProps { eyebrow?: string; heading?: string; paragraph1?: string; paragraph2?: string; timeline?: Milestone[] }

const D = CONTENT_DEFAULTS["home.mission"] as Required<MissionProps>;

// Force the correct timeline from registry — overrides any stale Supabase value
const CORRECT_TIMELINE: Milestone[] = [
  { year: "Jun 2026", text: "StrixMind founded in Kerala, India" },
  { year: "Jun 2026", text: "Platform launched — first customers onboarded" },
  { year: "Now", text: "Actively growing — building with early clients" },
];

export default function AboutHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, paragraph1 = D.paragraph1, paragraph2 = D.paragraph2,
}: MissionProps) {
  // Always use the registry timeline — never the DB value (which may be stale)
  const timeline = CORRECT_TIMELINE;

  return (
    <section style={{ borderTop: "1px solid var(--glass-bg)" }} className="py-20 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-20" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem" }}>
        <div>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-deep)", background: "rgba(108,99,255,0.07)", border: "1px solid var(--glass-bg)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>Our story</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text)", marginBottom: "1.5rem", whiteSpace: "pre-line" }}>
            {heading}
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8, marginBottom: "1.25rem" }}>
            {paragraph1}
          </p>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.8, marginBottom: "1.5rem" }}>
            {paragraph2}
          </p>
          <a href="/about" style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--accent-deep)", textDecoration: "none" }}>Learn more about us →</a>
        </div>

        <div className="p-8 sm:p-10" style={{ borderRadius: 24, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 12px 48px rgba(99,88,210,0.14)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18),transparent 70%)", pointerEvents: "none" }} />

          {/* Journey label */}
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "1.5rem" }}>Our journey</div>

          {timeline.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < timeline.length - 1 ? "1.5rem" : 0, marginBottom: i < timeline.length - 1 ? "1.5rem" : 0, borderBottom: i < timeline.length - 1 ? "1px solid var(--glass-bg)" : "none" }}>
              {/* Dot + line */}
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                  background: item.year === "Now" ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--border)",
                  border: item.year === "Now" ? "none" : "2px solid var(--accent)",
                  boxShadow: item.year === "Now" ? "0 0 8px rgba(108,99,255,0.5)" : "none",
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-deep)", marginBottom: "0.25rem", letterSpacing: "0.06em" }}>{item.year}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.6 }}>{item.text}</div>
              </div>
            </div>
          ))}

          {/* "Just getting started" note */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--glass-bg)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em" }}>Just getting started · Built in Kerala 🇮🇳</span>
          </div>
        </div>
      </div>
    </section>
  );
}
