"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface TrustedByProps {
  heading?: string;
  logos?: string[];
}

const D = CONTENT_DEFAULTS["home.trustedBy"] as Required<TrustedByProps>;

export default function TrustedByHomePageSection({ heading = D.heading, logos = D.logos }: TrustedByProps) {
  // Duplicate the list so the marquee loops seamlessly.
  const track = [...logos, ...logos];

  return (
    <section style={{ background: "rgba(255,255,255,0.5)", padding: "3rem 0", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "2rem" }}>
          {heading}
        </div>
      </div>

      {/* Marquee track */}
      <div style={{ position: "relative", width: "100%", maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3.5rem",
            width: "max-content",
            animation: "strix-marquee 28s linear infinite",
          }}
        >
          {track.map((l, i) => (
            <span
              key={`${l}-${i}`}
              style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", letterSpacing: "-0.01em", whiteSpace: "nowrap", userSelect: "none" as const, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", padding: "0.55rem 1.25rem", borderRadius: 100 }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes strix-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}