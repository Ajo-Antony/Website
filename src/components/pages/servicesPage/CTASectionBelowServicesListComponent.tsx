import Link from "next/link";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface CtaProps { heading?: string; paragraph?: string; primaryCtaLabel?: string; primaryCtaHref?: string; secondaryCtaLabel?: string; secondaryCtaHref?: string }
const D = CONTENT_DEFAULTS["services.cta"] as Required<CtaProps>;

export default function CTASectionBelowServicesListComponent({
  heading = D.heading, paragraph = D.paragraph,
  primaryCtaLabel = D.primaryCtaLabel, primaryCtaHref = D.primaryCtaHref,
  secondaryCtaLabel = D.secondaryCtaLabel, secondaryCtaHref = D.secondaryCtaHref,
}: CtaProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#F4F2FE", borderTop: "1px solid #E5E0FA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ borderRadius: 32, padding: "4.5rem 3rem", textAlign: "center", background: "#fff", border: "1px solid #E5E0FA", boxShadow: "0 24px 80px rgba(108,99,255,0.12)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6c63ff,#a78bfa)" }} />
          <h2 style={{ fontSize: "clamp(1.9rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1a1333", marginBottom: "1rem" }}>{heading}</h2>
          <p style={{ fontSize: "1rem", color: "#5b5478", marginBottom: "2.5rem", fontWeight: 400 }}>{paragraph}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <Link href={primaryCtaHref} style={{ fontSize: "1rem", fontWeight: 700, padding: "0.9rem 2.25rem", background: "linear-gradient(135deg,#6c63ff,#a78bfa)", color: "#fff", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 24px rgba(108,99,255,0.32)" }}>{primaryCtaLabel}</Link>
            <Link href={secondaryCtaHref} style={{ fontSize: "1rem", fontWeight: 600, padding: "0.9rem 2.25rem", background: "#F4F2FE", color: "#4c46c4", borderRadius: 100, textDecoration: "none", border: "1.5px solid rgba(108,99,255,0.2)" }}>{secondaryCtaLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
