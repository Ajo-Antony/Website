import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Milestone { year: string; text: string }
interface StoryProps { eyebrow?: string; heading?: string; paragraph1?: string; paragraph2?: string; timeline?: Milestone[] }
const D = CONTENT_DEFAULTS["about.story"] as Required<StoryProps>;

export default function StoryPageSection({ eyebrow = D.eyebrow, heading = D.heading, paragraph1 = D.paragraph1, paragraph2 = D.paragraph2, timeline = D.timeline }: StoryProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E0FA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.09)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
          <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1a1333", lineHeight: 1.1, marginBottom: "1.5rem" }}>{heading}</h2>
          <p style={{ fontSize: "1rem", color: "#5b5478", lineHeight: 1.8, marginBottom: "1rem" }}>{paragraph1}</p>
          <p style={{ fontSize: "1rem", color: "#5b5478", lineHeight: 1.8 }}>{paragraph2}</p>
        </div>
        <div style={{ background: "#F4F2FE", borderRadius: 24, padding: "2rem", border: "1px solid #E5E0FA", boxShadow: "0 8px 32px rgba(108,99,255,0.08)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#5b5478", marginBottom: "1.25rem" }}>Timeline</div>
          {timeline.map((item, i) => (
            <div key={item.year} style={{ display: "flex", gap: "1.25rem", paddingBottom: i < timeline.length - 1 ? "1.25rem" : 0, marginBottom: i < timeline.length - 1 ? "1.25rem" : 0, borderBottom: i < timeline.length - 1 ? "1px solid rgba(108,99,255,0.12)" : "none" }}>
              <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#6c63ff", minWidth: 40, fontFamily: "Inter, monospace" }}>{item.year}</div>
              <div style={{ fontSize: "0.9rem", color: "#3a3458", fontWeight: 400 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
