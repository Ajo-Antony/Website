import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface HeroProps { eyebrow?: string; heading?: string; headingAccent?: string; paragraph?: string }
const D = CONTENT_DEFAULTS["services.hero"] as Required<HeroProps>;

export default function HeroSectionServicesPage({ eyebrow = D.eyebrow, heading = D.heading, headingAccent = D.headingAccent, paragraph = D.paragraph }: HeroProps) {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", paddingTop: 72, background: "linear-gradient(160deg,#f7f6fd,#eef0fb)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", border: "1px solid var(--glass-bg)", top: -100, right: -80, animation: "rotate-slow 28s linear infinite", pointerEvents: "none" as const }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.5rem" }}>{eyebrow}</div>
        <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "1.5rem", maxWidth: 700 }}>
          {heading}<br/>
          <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{headingAccent}</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--text-muted)", maxWidth: 520, lineHeight: 1.75 }}>{paragraph}</p>
      </div>
    </section>
  );
}
