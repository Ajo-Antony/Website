import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface HeroProps { eyebrow?: string; heading?: string; headingAccent?: string; paragraph?: string }
const D = CONTENT_DEFAULTS["contact.hero"] as Required<HeroProps>;

export default function ContactHeroPageSection({ eyebrow = D.eyebrow, heading = D.heading, headingAccent = D.headingAccent, paragraph = D.paragraph }: HeroProps) {
  return (
    <section style={{ paddingTop: 120, paddingBottom: "3rem", background: "linear-gradient(160deg,#f7f6fd,#eef0fb)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.5rem" }}>{eyebrow}</div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "1.25rem", maxWidth: 600 }}>
          {heading}{" "}
          <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{headingAccent}</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 460, lineHeight: 1.75 }}>{paragraph}</p>
      </div>
    </section>
  );
}
