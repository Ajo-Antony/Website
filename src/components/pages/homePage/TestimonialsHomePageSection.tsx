"use client";
import { useEffect, useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { getApprovedReviews } from "@/lib/actions/reviews";
import type { Review } from "@/lib/actions/reviews";

interface StaticTestimonial { initials: string; name: string; role: string; quote: string; stars: number }
interface TestimonialsProps { eyebrow?: string; heading?: string; items?: StaticTestimonial[] }

const D = CONTENT_DEFAULTS["home.testimonials"] as Required<TestimonialsProps>;
const AVATAR_COLORS = ["#6c63ff", "#0ea5e9", "#f59e0b", "#f472b6", "#22c55e", "#8b5cf6"];

function StarRow({ stars }: { stars: number }) {
  return (
    <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1.25rem" }}>
      {Array.from({ length: 5 }).map((_, si) => (
        <svg key={si} width={14} height={14} viewBox="0 0 24 24"
          fill={si < stars ? "#f59e0b" : "none"}
          stroke={si < stars ? "#f59e0b" : "#e5e7eb"}
          strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ initials, name, role, quote, stars, colorIndex }: {
  initials: string; name: string; role: string; quote: string; stars: number; colorIndex: number;
}) {
  return (
    <div style={{ background: "#F8F7FF", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #E5E0FA", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}>
      <div style={{ position: "absolute", top: "1rem", right: "1.5rem", fontSize: "3.5rem", color: "rgba(108,99,255,0.08)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none", fontWeight: 700 }}>&quot;</div>
      <StarRow stars={stars} />
      <p style={{ fontSize: "0.95rem", color: "#3a3458", lineHeight: 1.8, marginBottom: "1.75rem", fontStyle: "italic" }}>&quot;{quote}&quot;</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a1333" }}>{name}</div>
          <div style={{ fontSize: "0.75rem", color: "#5b5478", marginTop: "0.15rem" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, items = D.items,
}: TestimonialsProps) {
  const [dbReviews, setDbReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    getApprovedReviews()
      .then(setDbReviews)
      .catch(() => setDbReviews([]));
  }, []);

  // Use DB approved reviews if any exist, otherwise fall back to static defaults
  const displayItems: Array<{ initials: string; name: string; role: string; quote: string; stars: number }> =
    dbReviews && dbReviews.length > 0
      ? dbReviews.map(r => ({
          initials: r.initials,
          name: r.name,
          role: [r.role, r.company].filter(Boolean).join(", ") || "",
          quote: r.quote,
          stars: r.stars,
        }))
      : items;

  return (
    <section id="testimonials" style={{ background: "#fff", borderTop: "1px solid var(--divider)" }} className="py-16 sm:py-28">
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="px-5 sm:px-8">

        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.16)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#1a1333", lineHeight: 1.1, whiteSpace: "pre-line" }}>
            {heading}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
          {displayItems.map((t, i) => (
            <TestimonialCard key={t.name + i} {...t} colorIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
