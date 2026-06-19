"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Testimonial { initials: string; name: string; role: string; quote: string; stars: number }
interface TestimonialsProps { eyebrow?: string; heading?: string; items?: Testimonial[] }

const D = CONTENT_DEFAULTS["home.testimonials"] as Required<TestimonialsProps>;
const AVATAR_COLORS = ["#6c63ff", "#0ea5e9", "#f59e0b", "#f472b6"];

export default function TestimonialsHomePageSection({ eyebrow = D.eyebrow, heading = D.heading, items = D.items }: TestimonialsProps) {
  return (
    <section id="testimonials" style={{ background: "#fff", padding: "7rem 0", borderTop: "1px solid var(--divider)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.16)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#1a1333", lineHeight: 1.1, whiteSpace: "pre-line" }}>
            {heading}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
          {items.map((t, i) => (
            <div
              key={t.name}
              style={{ background: "#F8F7FF", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #E5E0FA", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}
            >
              <div style={{ position: "absolute", top: "1rem", right: "1.5rem", fontSize: "3.5rem", color: "rgba(108,99,255,0.08)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none", fontWeight: 700 }}>&quot;</div>

              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1.25rem" }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <svg key={si} width={14} height={14} viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p style={{ fontSize: "0.95rem", color: "#3a3458", lineHeight: 1.8, marginBottom: "1.75rem", fontStyle: "italic" }}>&quot;{t.quote}&quot;</p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a1333" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#5b5478", marginTop: "0.15rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
