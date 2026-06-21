import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Milestone { year: string; text: string }
interface MissionProps { eyebrow?: string; heading?: string; paragraph1?: string; paragraph2?: string; timeline?: Milestone[] }

const D = CONTENT_DEFAULTS["home.mission"] as Required<MissionProps>;

export default function AboutHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, paragraph1 = D.paragraph1, paragraph2 = D.paragraph2, timeline = D.timeline,
}: MissionProps) {
  return (
    <section style={{ borderTop: "1px solid rgba(108,99,255,0.08)" }} className="py-20 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-20" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem" }}>
        <div>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", marginBottom: "1.5rem", whiteSpace: "pre-line" }}>
            {heading}
          </h2>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.8, marginBottom: "1.25rem" }}>
            {paragraph1}
          </p>
          <p style={{ fontSize: "1rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.8, marginBottom: "1.5rem" }}>
            {paragraph2}
          </p>
          <a href="/about" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#4c46c4", textDecoration: "none" }}>Learn more about us →</a>
        </div>

        <div className="p-8 sm:p-10" style={{ borderRadius: 24, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 12px 48px rgba(99,88,210,0.14)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18),transparent 70%)", pointerEvents: "none" }} />
          {timeline.map((item, i) => (
            <div key={item.year} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < timeline.length - 1 ? "1.5rem" : 0, marginBottom: i < timeline.length - 1 ? "1.5rem" : 0, borderBottom: i < timeline.length - 1 ? "1px solid rgba(108,99,255,0.08)" : "none" }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", fontWeight: 700, color: "#6c63ff", minWidth: 40, paddingTop: "0.1rem" }}>{item.year}</div>
              <div style={{ fontSize: "0.9rem", color: "#5b5478", fontWeight: 300 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
