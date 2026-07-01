"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconMail, IconMapPin, IconClock, IconCheckCircle } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface InfoItem { icon: string; label: string; value: string }
interface ContactProps { eyebrow?: string; heading?: string; subheading?: string; infoItems?: InfoItem[] }

const D = CONTENT_DEFAULTS["home.contact"] as Required<ContactProps>;

// SVG icons indexed to match the original emoji order: 📧 📍 ⏱️ 🕐
const INFO_ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconMail, IconMapPin, IconClock, IconClock,
];

export default function ContactHomePageSection({
  eyebrow = D.eyebrow, heading = D.heading, subheading = D.subheading, infoItems = D.infoItems,
}: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "0.875rem 1.125rem", borderRadius: 14,
    border: "1.5px solid var(--border)", background: "var(--surface-alt)",
    fontSize: "0.9rem", color: "var(--text)",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", marginBottom: "1rem",
    fontFamily: "inherit",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--shadow)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "";
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <section id="contact" style={{ background: "#F4F2FE", borderTop: "1px solid var(--divider)" }} className="py-20 sm:py-28">
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="px-5 sm:px-8">

        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--accent-deep)", background: "var(--glass-bg)", border: "1px solid var(--border)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            {eyebrow}
          </div>
          <h2 data-strix-slide-up style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text)", lineHeight: 1.1, whiteSpace: "pre-line" }}>
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-20">

          <div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.025em", marginBottom: "0.875rem" }}>
              {subheading}
            </h3>

            {infoItems.map((item, i) => {
              const Icon = INFO_ICONS[i % INFO_ICONS.length];
              return (
              <div key={item.label} style={{ display: "flex", gap: "1.25rem", padding: "1.25rem", background: "var(--surface)", borderRadius: 18, border: "1.5px solid var(--border)", marginBottom: "1rem", alignItems: "center" }}>
                <div style={{ width: 46, height: 46, minWidth: 46, borderRadius: 14, background: "var(--glass-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-dim)", marginBottom: "0.25rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.975rem", fontWeight: 600, color: "var(--text)" }}>{item.value}</div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="p-6 sm:p-11" style={{ background: "var(--surface)", borderRadius: 28, border: "1.5px solid var(--border)", boxShadow: "0 16px 56px var(--shadow)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}><IconCheckCircle size={52} color="#22c55e" strokeWidth={1.5} /></div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Message sent!</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>We'll get back to you within 2 business hours. Check your inbox for a confirmation.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.75rem", letterSpacing: "-0.025em" }}>Send us a message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <input style={inputBase} type="text" placeholder="Full name *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  <input style={inputBase} type="email" placeholder="Work email *" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <input style={inputBase} type="text" placeholder="Company name" value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  <select style={{ ...inputBase, cursor: "pointer" }} value={form.size}
                    onChange={e => setForm({ ...form, size: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur}>
                    <option value="">Team size</option>
                    <option>Just me</option>
                    <option>2–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>200+</option>
                  </select>
                </div>

                <textarea
                  style={{ ...inputBase, minHeight: 120, resize: "vertical", marginBottom: "1.5rem" }}
                  placeholder="Tell us about your automation goals..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={handleFocus} onBlur={handleBlur}
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.email}
                  style={{
                    width: "100%", padding: "1.05rem", background: form.name && form.email ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "#D8D4F5",
                    color: "#fff", border: "none", borderRadius: 100, fontSize: "0.95rem", fontWeight: 700,
                    cursor: form.name && form.email ? "pointer" : "not-allowed",
                    boxShadow: form.name && form.email ? "0 8px 24px var(--shadow-strong)" : "none",
                    fontFamily: "inherit", transition: "all 0.3s ease",
                  }}
                >
                  {loading ? "Sending..." : "Send message →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}