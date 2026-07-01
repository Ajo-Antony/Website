"use client";
import { StrixmindIcon, StrixmindWordmark } from "@/components/ui/StrixmindLogo";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

function LogoIconDark({ size = 80 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.2, background: "linear-gradient(135deg,#003E8F,#0063E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,99,229,0.4)" }}>
      <StrixmindIcon size={size * 0.65} />
    </div>
  );
}
function LogoIconLight({ size = 80 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.2, background: "#eaf2ff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,99,229,0.12)" }}>
      <StrixmindIcon size={size * 0.65} />
    </div>
  );
}
function Wordmark({ theme = "dark", size = 48 }: { theme?: "dark" | "light"; size?: number }) {
  return <StrixmindWordmark theme={theme} height={size} />;
}

interface ColorSwatch { hex: string; name: string; role: string }
interface Attribute { label: string; desc: string }
interface BrandProps {
  eyebrow?: string; heading?: string; subheading?: string;
  conceptParagraph1?: string; conceptParagraph2?: string;
  colors?: ColorSwatch[]; attributes?: Attribute[];
  conclusionHeading?: string; conclusionParagraph?: string;
}

const D = CONTENT_DEFAULTS["home.brand"] as Required<BrandProps>;

export default function BrandIdentitySection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading,
  conceptParagraph1 = D.conceptParagraph1, conceptParagraph2 = D.conceptParagraph2,
  colors = D.colors, attributes = D.attributes,
  conclusionHeading = D.conclusionHeading, conclusionParagraph = D.conclusionParagraph,
}: BrandProps) {
  return (
    <section id="brand" style={{ background: "#fbfaff", borderTop: "1px solid #f1effe", padding: "7rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, marginBottom: "1rem" }}>
            {heading}
          </h2>
          <p data-strix-fade-up style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            {subheading}
          </p>
        </div>

        {/* Logo showcase */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          <div style={{ background: "linear-gradient(165deg,#241c4d,var(--text))", borderRadius: 24, padding: "3.5rem 3rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: "-0.5rem" }}>Dark Background</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <LogoIconDark size={88} />
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                <Wordmark theme="dark" size={38} />
                <Wordmark theme="dark" size={24} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.06)", padding: "1rem 1.75rem", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              <StrixmindIcon size={32} theme="dark" />
              <Wordmark theme="dark" size={26} />
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: 24, padding: "3.5rem 3rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2rem", border: "1.5px solid #f1effe" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "-0.5rem" }}>Light Background</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <LogoIconLight size={88} />
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                <Wordmark theme="light" size={38} />
                <Wordmark theme="light" size={24} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f8f7ff", padding: "1rem 1.75rem", borderRadius: 14, border: "1px solid #f1effe" }}>
              <StrixmindIcon size={32} theme="light" />
              <Wordmark theme="light" size={26} />
            </div>
          </div>
        </div>

        {/* Symbolism + concept + palette */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "2rem", marginBottom: "2rem" }}>
          <div style={{ background: "var(--surface)", borderRadius: 24, padding: "2.75rem", border: "1.5px solid #f1effe" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: "1rem" }}>Abstract Logo</div>
            <h3 data-strix-slide-up style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>Connected Intelligence</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2rem" }}>
              {conceptParagraph1}
            </p>

            <div style={{ background: "linear-gradient(165deg,#241c4d,var(--text))", borderRadius: 18, padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem" }}>
              <StrixmindIcon size={72} theme="dark" />
              <StrixmindIcon size={56} theme="dark" />
              <StrixmindIcon size={40} theme="dark" />
            </div>
            <div style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-dim)", marginTop: "0.75rem" }}>Logo at 72px, 56px, and 40px — consistent clarity at every size</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
            <div style={{ background: "var(--surface)", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #f1effe", flex: 1 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: "1rem" }}>Design Concept</div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.85 }}>
                {conceptParagraph2}
              </p>
            </div>

            <div style={{ background: "var(--surface)", borderRadius: 24, padding: "2.25rem", border: "1.5px solid #f1effe" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: "1.25rem" }}>Brand Colours</div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                {colors.map(c => (
                  <div key={c.hex} style={{ flex: 1 }}>
                    <div style={{ height: 52, borderRadius: 12, background: c.hex, marginBottom: "0.65rem", boxShadow: "0 4px 16px rgba(108,99,255,0.2)" }} />
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.15rem", fontFamily: "monospace" }}>{c.hex}</div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
                    <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{c.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div style={{ background: "linear-gradient(165deg,#241c4d,var(--text))", borderRadius: 24, padding: "3rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "radial-gradient(ellipse at right center, rgba(108,99,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "3rem", flexWrap: "wrap" as const }}>
              <div style={{ maxWidth: 320 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-2)", marginBottom: "1rem" }}>Conclusion</div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1rem" }}>
                  {conclusionHeading}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
                  {conclusionParagraph}
                </p>
              </div>

              <div style={{ flex: 1, minWidth: 300, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {attributes.map((attr) => (
                  <div key={attr.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-2)", display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{attr.label}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{attr.desc}</p>
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
