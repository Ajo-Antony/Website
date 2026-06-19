"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Member { initials: string; name: string; role: string; bio: string; photo?: string }
interface TeamProps { eyebrow?: string; heading?: string; members?: Member[] }

const D = CONTENT_DEFAULTS["home.team"] as Required<TeamProps>;
const GRADS = ["linear-gradient(135deg,#6c63ff,#a78bfa)", "linear-gradient(135deg,#0ea5e9,#38bdf8)", "linear-gradient(135deg,#f472b6,#fb7185)", "linear-gradient(135deg,#f59e0b,#fbbf24)"];

export default function BarbersTeamHomePageSection({ eyebrow = D.eyebrow, heading = D.heading, members = D.members }: TeamProps) {
  return (
    <section id="team" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", whiteSpace: "pre-line" }}>
            {heading}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
          {members.map((member, i) => (
            <div key={member.name} style={{ padding: "2rem", borderRadius: 22, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(99,88,210,0.10)", textAlign: "center", transition: "transform 0.25s" }}>
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={member.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 1.25rem", display: "block" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: GRADS[i % GRADS.length], display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontFamily: "var(--font-mono, monospace)", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{member.initials}</div>
              )}
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.9rem", fontWeight: 700, color: "#1a1333", marginBottom: "0.25rem" }}>{member.name}</div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6c63ff", marginBottom: "0.75rem" }}>{member.role}</div>
              <p style={{ fontSize: "0.82rem", color: "#5b5478", fontWeight: 300, lineHeight: 1.65 }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
