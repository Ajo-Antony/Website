"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Member { initials: string; name: string; role: string; bio: string; photo?: string }
interface TeamProps { eyebrow?: string; heading?: string; members?: Member[] }
const D = CONTENT_DEFAULTS["about.team"] as Required<TeamProps>;
const GRADS = ["linear-gradient(135deg,#6c63ff,#a78bfa)", "linear-gradient(135deg,#0ea5e9,#38bdf8)", "linear-gradient(135deg,#f59e0b,#fbbf24)", "linear-gradient(135deg,#f472b6,#fb7185)"];

export default function TeamPageSection({ eyebrow = D.eyebrow, heading = D.heading, members = D.members }: TeamProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E0FA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#4c46c4", background: "rgba(108,99,255,0.09)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1a1333", lineHeight: 1.1, marginBottom: "3rem" }}>{heading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {members.map((m, i) => (
            <div key={m.name} style={{ background: "#F4F2FE", borderRadius: 22, padding: "2rem", border: "1px solid #E5E0FA", textAlign: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 1.25rem", display: "block" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: GRADS[i % GRADS.length], display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{m.initials}</div>
              )}
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1333", marginBottom: "0.25rem", letterSpacing: "-0.01em" }}>{m.name}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6c63ff", marginBottom: "0.75rem" }}>{m.role}</div>
              <p style={{ fontSize: "0.85rem", color: "#5b5478", lineHeight: 1.65 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
