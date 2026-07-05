"use client";
import { useEffect, useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { getApprovedReviews, submitReview } from "@/lib/actions/reviews";
import type { Review } from "@/lib/actions/reviews";

interface StaticTestimonial { initials: string; name: string; role: string; quote: string; stars: number }
interface TestimonialsProps { eyebrow?: string; heading?: string; items?: StaticTestimonial[] }

const D = CONTENT_DEFAULTS["home.testimonials"] as Required<TestimonialsProps>;
const AVATAR_COLORS = ["var(--accent)", "var(--accent-teal)", "#f59e0b", "#f472b6", "#22c55e", "#8b5cf6"];

// ─── Star picker ──────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <svg width={24} height={24} viewBox="0 0 24 24"
            fill={(hovered || value) >= n ? "#f59e0b" : "none"}
            stroke={(hovered || value) >= n ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Star display row ─────────────────────────────────────────
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

// ─── Single testimonial card ──────────────────────────────────
function TestimonialCard({ initials, name, role, quote, stars, colorIndex }: {
  initials: string; name: string; role: string; quote: string; stars: number; colorIndex: number;
}) {
  return (
    <div style={{ background: "var(--surface-alt)", borderRadius: 24, padding: "2.25rem", border: "1.5px solid var(--border)", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}>
      <div style={{ position: "absolute", top: "1rem", right: "1.5rem", fontSize: "3.5rem", color: "var(--glass-bg)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none", fontWeight: 700 }}>&quot;</div>
      <StarRow stars={stars} />
      <p style={{ fontSize: "0.95rem", color: "#3a3458", lineHeight: 1.8, marginBottom: "1.75rem", fontStyle: "italic" }}>&quot;{quote}&quot;</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>{name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Honest empty state (no real reviews yet) ─────────────────
function NoReviewsYet() {
  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: 480,
        margin: "0 auto",
        padding: "3rem 2rem",
        borderRadius: 24,
        border: "1.5px dashed var(--border)",
        background: "var(--surface-alt)",
      }}
    >
      <div style={{ display: "inline-flex", width: 48, height: 48, borderRadius: "50%", background: "var(--glass-bg)", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.6rem" }}>
        We're just getting started
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
        StrixMind launched recently, so we don&apos;t have customer reviews to show yet — we&apos;d rather leave this
        empty than make any up. If you&apos;re one of our early users, be the first to share your experience below.
      </p>
    </div>
  );
}

// ─── Review submission form ───────────────────────────────────
function WriteReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !quote.trim()) { setError("Name and review text are required."); return; }
    if (quote.trim().length < 20) { setError("Please write at least 20 characters."); return; }
    setError("");
    setBusy(true);
    const res = await submitReview({ name: name.trim(), role: role.trim() || undefined, company: company.trim() || undefined, quote: quote.trim(), stars });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      onSubmitted();
    } else {
      setError(res.error ?? "Something went wrong. Please try again.");
    }
  }

  if (!open) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "linear-gradient(135deg,var(--accent),var(--accent-2))", color: "#fff",
            border: "none", borderRadius: 100, padding: "0.75rem 2rem",
            fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px var(--shadow-strong)", transition: "all 0.2s ease",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "3rem", background: "var(--surface)", borderRadius: 24, border: "1.5px solid var(--border)", padding: "2.5rem", maxWidth: 640, margin: "3rem auto 0", boxShadow: "0 8px 40px var(--shadow)" }}>

      {done ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>Thank you for your review!</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            Your review has been submitted and is awaiting approval. Once approved, it will appear here for everyone to see.
          </p>
          <button
            onClick={() => { setOpen(false); setDone(false); setName(""); setRole(""); setCompany(""); setQuote(""); setStars(5); }}
            style={{ marginTop: "1.5rem", background: "var(--glass-bg)", color: "var(--accent-deep)", border: "none", borderRadius: 100, padding: "0.6rem 1.5rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
          >
            Write another review
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--accent-deep)", marginBottom: "0.35rem" }}>Share your experience</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>Write a Review</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "var(--glass-bg)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem" }}
              aria-label="Close"
            >✕</button>
          </div>

          {/* Star rating */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3458", display: "block", marginBottom: "0.5rem" }}>Your rating *</label>
            <StarPicker value={stars} onChange={setStars} />
          </div>

          {/* Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3458", display: "block", marginBottom: "0.4rem" }}>Your name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Rahul Sharma"
              style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.9rem", color: "var(--text)", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
            />
          </div>

          {/* Role + Company */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3458", display: "block", marginBottom: "0.4rem" }}>Role <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>(optional)</span></label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Founder / CEO"
                style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.9rem", color: "var(--text)", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3458", display: "block", marginBottom: "0.4rem" }}>Company <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>(optional)</span></label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Acme Pvt. Ltd."
                style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.9rem", color: "var(--text)", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Review text */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3458", display: "block", marginBottom: "0.4rem" }}>Your review *</label>
            <textarea
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder="Tell us how StrixMind helped your business..."
              rows={4}
              style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: "0.9rem", color: "var(--text)", outline: "none", resize: "vertical", boxSizing: "border-box" as const, fontFamily: "inherit", lineHeight: 1.7 }}
            />
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>{quote.length} characters · minimum 20</div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.82rem", color: "#dc2626", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}

          {/* Note */}
          <div style={{ background: "rgba(108,99,255,0.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.65rem 1rem", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            ✅ Your review will be visible on this page after team approval — usually within 24 hours.
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={busy}
            style={{
              width: "100%", background: busy ? "rgba(108,99,255,0.5)" : "linear-gradient(135deg,var(--accent),var(--accent-2))",
              color: "#fff", border: "none", borderRadius: 12, padding: "0.875rem",
              fontSize: "0.95rem", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
              boxShadow: busy ? "none" : "0 4px 16px var(--shadow-strong)", transition: "all 0.2s ease",
            }}
          >
            {busy ? "Submitting…" : "Submit Review →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────
export default function TestimonialsHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, items = D.items,
}: TestimonialsProps) {
  const [dbReviews, setDbReviews] = useState<Review[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getApprovedReviews()
      .then(setDbReviews)
      .catch(() => setDbReviews([]));
  }, [refreshKey]);

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
    <section id="testimonials" style={{ background: "var(--surface)", borderTop: "1px solid var(--divider)" }} className="py-16 sm:py-28">
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="px-5 sm:px-8">

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, whiteSpace: "pre-line" }}>
            {heading}
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginTop: "1rem", maxWidth: 480, margin: "1rem auto 0", lineHeight: 1.7 }}>
            {dbReviews && dbReviews.length > 0
              ? "Real results from real businesses. Every review is verified before going live."
              : "Every review here will be a real one, verified before it goes live — starting with yours."}
          </p>
        </div>

        {/* Review cards grid */}
        {dbReviews === null ? (
          // Loading skeleton
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "var(--surface-alt)", borderRadius: 24, padding: "2.25rem", border: "1.5px solid var(--border)", minHeight: 200, animation: "pulse 1.5s ease-in-out infinite" }}>
                <div style={{ height: 14, background: "var(--glass-bg)", borderRadius: 8, marginBottom: "1.25rem", width: "60%" }} />
                <div style={{ height: 10, background: "var(--glass-bg)", borderRadius: 8, marginBottom: "0.5rem" }} />
                <div style={{ height: 10, background: "var(--glass-bg)", borderRadius: 8, marginBottom: "0.5rem", width: "80%" }} />
                <div style={{ height: 10, background: "var(--glass-bg)", borderRadius: 8, width: "70%" }} />
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <NoReviewsYet />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
            {displayItems.map((t, i) => (
              <TestimonialCard key={t.name + i} {...t} colorIndex={i} />
            ))}
          </div>
        )}

        {/* Write a review CTA */}
        <WriteReviewForm onSubmitted={() => setRefreshKey(k => k + 1)} />
      </div>
    </section>
  );
}
