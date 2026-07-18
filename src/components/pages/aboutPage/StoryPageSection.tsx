import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Milestone { year: string; text: string }
interface StoryProps { eyebrow?: string; heading?: string; paragraph1?: string; paragraph2?: string; timeline?: Milestone[] }
const D = CONTENT_DEFAULTS["about.story"] as Required<StoryProps>;

// Hardcoded — always reflects real company founding, never stale DB values
const CORRECT_TIMELINE: Milestone[] = [
  { year: "Jun 2026", text: "Founded in Kerala, India" },
  { year: "Jun 2026", text: "Platform launched — first customers onboarded" },
  { year: "Now", text: "Actively growing across industries" },
];

export default function StoryPageSection({
  eyebrow = D.eyebrow, heading = D.heading, paragraph1 = D.paragraph1, paragraph2 = D.paragraph2,
}: StoryProps) {
  const timeline = CORRECT_TIMELINE;
  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }} className="py-16 sm:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10 md:gap-20 px-5 sm:px-8" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
          <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.1, marginBottom: "1.5rem" }}>{heading}</h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1rem" }}>{paragraph1}</p>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{paragraph2}</p>
        </div>
        <div style={{ background: "var(--surface-alt)", borderRadius: 24, padding: "2rem", border: "1px solid var(--border)", boxShadow: "0 8px 32px var(--glass-bg)" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "1.5rem" }}>Our journey</div>
          {timeline.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < timeline.length - 1 ? "1.25rem" : 0, marginBottom: i < timeline.length - 1 ? "1.25rem" : 0, borderBottom: i < timeline.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                  background: item.year === "Now" ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--border)",
                  border: item.year === "Now" ? "none" : "2px solid var(--accent)",
                  boxShadow: item.year === "Now" ? "0 0 8px rgba(108,99,255,0.5)" : "none",
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.75rem", color: "var(--accent-deep)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>{item.year}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 400 }}>{item.text}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.08em" }}>Just getting started · Built in Kerala 🇮🇳</span>
          </div>
        </div>
      </div>
    </section>
  );
}
