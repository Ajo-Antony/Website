"use client";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface Member { initials: string; name: string; role: string; bio: string; photo?: string }
interface TeamProps { eyebrow?: string; heading?: string; members?: Member[] }
const D = CONTENT_DEFAULTS["about.team"] as Required<TeamProps>;
const GRADS = ["linear-gradient(135deg,var(--accent),var(--accent-2))", "linear-gradient(135deg,var(--accent-teal),#38bdf8)", "linear-gradient(135deg,#f59e0b,#fbbf24)", "linear-gradient(135deg,#f472b6,#fb7185)"];

export default function TeamPageSection({ eyebrow = D.eyebrow, heading = D.heading, members = D.members }: TeamProps) {
  return (
    <section style={{ padding: "6rem 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>{eyebrow}</div>
        <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.1, marginBottom: "3rem" }}>{heading}</h2>

        <div className="team-card-grid">
          {members.map((m, i) => (
            <div className="team-card" key={m.name}>
              <div className="team-card-inner">
                <div className="team-card-photo">
                  {m.photo && m.photo.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} loading="lazy" decoding="async" />
                  ) : (
                    <div className="team-card-photo-fallback" style={{ background: GRADS[i % GRADS.length] }}>
                      {m.initials}
                    </div>
                  )}
                </div>
                <div className="team-card-panel">
                  <div className="team-card-name">{m.name}</div>
                  <p className="team-card-bio">{m.bio}</p>
                </div>
              </div>
              <button className="team-card-arrow" aria-label={`View more about ${m.name}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#0b0b10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .team-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.75rem;
        }
        .team-card {
          position: relative;
          margin-bottom: 26px;
        }
        .team-card-inner {
          border-radius: 22px;
          overflow: hidden;
          background: #0e0e14;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .team-card:hover .team-card-inner {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.28);
        }
        .team-card-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 3.4;
          overflow: hidden;
          background: #1a1a22;
        }
        .team-card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .team-card:hover .team-card-photo img {
          transform: scale(1.05);
        }
        .team-card-photo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
        }
        .team-card-panel {
          background: #12121a;
          padding: 1.25rem 1.25rem 2.75rem;
        }
        .team-card-name {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }
        .team-card-bio {
          font-size: 0.82rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
        }
        .team-card-arrow {
          position: absolute;
          left: 22px;
          bottom: -20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f6e94d;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(0,0,0,0.25);
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .team-card-arrow:hover {
          transform: scale(1.08) rotate(8deg);
          background: #fff34d;
        }
      `}</style>
    </section>
  );
}