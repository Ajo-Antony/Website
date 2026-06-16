"use client";
import { StrixmindIcon } from "@/components/ui/StrixmindLogo";

// Full abstract logo with dark background (app icon variant)
function LogoIconDark({ size = 80 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.2,
      background: "#212121",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <StrixmindIcon size={size * 0.65} theme="dark" />
    </div>
  );
}

// Light background variant
function LogoIconLight({ size = 80 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.2,
      background: "#f0f0f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    }}>
      <StrixmindIcon size={size * 0.65} theme="light" />
    </div>
  );
}

// The wordmark in two color variants
function Wordmark({ theme = "dark", size = 48 }: { theme?: "dark" | "light"; size?: number }) {
  return (
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.05em",
      color: theme === "dark" ? "#212121" : "#ffffff",
      lineHeight: 1,
    }}>
      strix<span style={{ color: "#0063E5" }}>mind</span>
    </span>
  );
}

const ELEMENTS = [
  {
    color: "#0063E5",
    label: "Blue Circle",
    tags: "Intelligence • Innovation • Leadership",
    desc: "Represents the core AI intelligence that powers Strixmind's solutions.",
  },
  {
    color: "#ffffff",
    border: "#d1d5db",
    label: "White Circles",
    tags: "Systems • Data • Scalability",
    desc: "Represent interconnected systems, data, and technologies forming a unified digital ecosystem.",
  },
  {
    color: "#212121",
    label: "Black Circles",
    tags: "Integration • Collaboration • Flow",
    desc: "Symbolize the seamless flow of information across multiple technologies.",
  },
];

const ATTRIBUTES = [
  { label: "Memorable", desc: "Distinctive geometric arrangement creates high recognition across all sizes." },
  { label: "Versatile", desc: "Functions effectively across dark, light, and color backgrounds without modification." },
  { label: "Meaningful", desc: "Every element — node, line, color — contributes to telling the brand story." },
  { label: "Timeless", desc: "Avoids trendy design elements for longer-lasting appeal and brand consistency." },
  { label: "Scalable", desc: "Works equally well at 16px favicon resolution and billboard scale." },
];

export default function BrandIdentitySection() {
  return (
    <section id="brand" style={{ background: "#f8f9fa", borderTop: "1px solid #e5e7eb", padding: "7rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            Identity & Branding
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>
            Built on Connected Intelligence.
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            The Strixmind identity unifies technological sophistication with approachable design — a visual system that scales from a mobile icon to enterprise deployments.
          </p>
        </div>

        {/* ── LOGO SHOWCASE ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>

          {/* Dark variant */}
          <div style={{ background: "#212121", borderRadius: 24, padding: "3.5rem 3rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: "-0.5rem" }}>Dark Background</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <LogoIconDark size={88} />
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                <Wordmark theme="dark" size={38} />
                <Wordmark theme="dark" size={24} />
              </div>
            </div>
            {/* Full lockup */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.05)", padding: "1rem 1.75rem", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
              <StrixmindIcon size={32} theme="dark" />
              <Wordmark theme="dark" size={26} />
            </div>
          </div>

          {/* Light variant */}
          <div style={{ background: "#ffffff", borderRadius: 24, padding: "3.5rem 3rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2rem", border: "1.5px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: "-0.5rem" }}>Light Background</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <LogoIconLight size={88} />
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 38, letterSpacing: "-0.05em", color: "#212121", lineHeight: 1 }}>
                  strix<span style={{ color: "#0063E5" }}>mind</span>
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.05em", color: "#212121", lineHeight: 1 }}>
                  strix<span style={{ color: "#0063E5" }}>mind</span>
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f8f9fa", padding: "1rem 1.75rem", borderRadius: 14, border: "1px solid #e5e7eb" }}>
              <StrixmindIcon size={32} theme="light" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.05em", color: "#212121", lineHeight: 1 }}>
                strix<span style={{ color: "#0063E5" }}>mind</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── ABSTRACT LOGO + SYMBOLISM ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "2rem", marginBottom: "2rem" }}>

          {/* Logo symbolism */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "2.75rem", border: "1.5px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", marginBottom: "1rem" }}>Abstract Logo</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>Connected Intelligence</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.8, marginBottom: "2rem" }}>
              The central node symbolises AI-driven intelligence. Surrounding interconnected nodes represent data, machine learning, autonomous agents, and digital systems — Strixmind's ability to unify emerging technologies into scalable solutions.
            </p>

            {/* Logo elements */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
              {ELEMENTS.map((el) => (
                <div key={el.label} style={{ flex: 1, textAlign: "center" as const }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: el.color, border: el.border ? `1.5px solid ${el.border}` : "none", margin: "0 auto 0.6rem", boxShadow: el.color === "#0063E5" ? "0 4px 16px rgba(0,99,229,0.35)" : "0 2px 8px rgba(0,0,0,0.12)" }} />
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.2rem" }}>{el.label}</div>
                  <div style={{ fontSize: "0.6rem", color: "#64748B", lineHeight: 1.5 }}>{el.tags}</div>
                </div>
              ))}
            </div>

            {/* Strix node network illustration */}
            <div style={{ background: "#051A1C", borderRadius: 18, padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem" }}>
              <StrixmindIcon size={72} theme="dark" />
              <StrixmindIcon size={56} theme="dark" />
              <StrixmindIcon size={40} theme="dark" />
            </div>
            <div style={{ textAlign: "center", fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.75rem" }}>Logo at 72px, 56px, and 40px — consistent clarity at every size</div>
          </div>

          {/* Design concept + colour palette */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>

            {/* Concept */}
            <div style={{ background: "#fff", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #e5e7eb", flex: 1 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", marginBottom: "1rem" }}>Design Concept</div>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                The Strixmind wordmark uses custom, interconnected letterforms to symbolise the seamless flow of data, intelligence, and technology. Rounded geometry conveys innovation and accessibility, while the consistent structure reflects reliability and technical precision.
              </p>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.85 }}>
                Blue accent points represent moments of insight and intelligence — reinforcing Strixmind's focus on AI-driven innovation at every visual touchpoint.
              </p>
            </div>

            {/* Colour palette */}
            <div style={{ background: "#fff", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #e5e7eb" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", marginBottom: "1.25rem" }}>Brand Colours</div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { hex: "#212121", name: "Strixmind Black", role: "Primary text & dark surfaces" },
                  { hex: "#0063E5", name: "Intelligence Blue", role: "Primary accent & CTAs" },
                  { hex: "#003E8F", name: "Deep Blue", role: "Depth & brand shadows" },
                ].map(c => (
                  <div key={c.hex} style={{ flex: 1 }}>
                    <div style={{ height: 52, borderRadius: 12, background: c.hex, marginBottom: "0.65rem", boxShadow: c.hex === "#0063E5" ? "0 4px 16px rgba(0,99,229,0.4)" : "0 2px 8px rgba(0,0,0,0.15)" }} />
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.15rem", fontFamily: "monospace" }}>{c.hex}</div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0F172A" }}>{c.name}</div>
                    <div style={{ fontSize: "0.62rem", color: "#64748B" }}>{c.role}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.8 }}>
                  <strong style={{ color: "#0F172A" }}>White:</strong> Clarity, simplicity, and transparency.&nbsp;
                  <strong style={{ color: "#0063E5" }}>Blue:</strong> Intelligence, trust, and innovation.&nbsp;
                  <strong style={{ color: "#0F172A" }}>Together:</strong> Clean technology powered by intelligent thinking.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESIGN ATTRIBUTES ── */}
        <div style={{ background: "#051A1C", borderRadius: 24, padding: "3rem", position: "relative", overflow: "hidden" }}>
          {/* BG glow */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "radial-gradient(ellipse at right center, rgba(0,99,229,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "3rem", flexWrap: "wrap" as const }}>

              {/* Left: heading */}
              <div style={{ maxWidth: 320 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#6aabff", marginBottom: "1rem" }}>Conclusion</div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1rem" }}>
                  A future-ready identity built to last.
                </h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  The Strixmind logo embodies the brand's vision of Connected Intelligence — combining innovation, collaboration, and technological expertise into a distinctive identity.
                </p>
              </div>

              {/* Right: attributes */}
              <div style={{ flex: 1, minWidth: 300, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {ATTRIBUTES.map((attr) => (
                  <div key={attr.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0063E5", display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{attr.label}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{attr.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
