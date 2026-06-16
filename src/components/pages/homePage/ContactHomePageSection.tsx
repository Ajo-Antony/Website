"use client";
import { useState } from "react";

export default function ContactHomePageSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "0.875rem 1.125rem", borderRadius: 14,
    border: "1.5px solid #E5E7EB", background: "#F8FAFF",
    fontSize: "0.9rem", color: "#0F172A",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", marginBottom: "1rem",
    fontFamily: "inherit",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#0063E5";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,99,229,0.08)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#E5E7EB";
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
    <section id="contact" style={{ background: "#EEF4FF", padding: "7rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#0063E5", background: "rgba(0,99,229,0.07)", border: "1px solid rgba(0,99,229,0.14)", padding: "0.35rem 1rem", borderRadius: 100, marginBottom: "1.5rem" }}>
            Get In Touch
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0F172A", lineHeight: 1.1 }}>
            Let's talk about<br />your growth.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* Left: info */}
          <div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: "0.875rem" }}>
              Ready to automate your business?
            </h3>
            <p style={{ fontSize: "0.975rem", color: "#64748B", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              Whether you want a quick product walkthrough, need help choosing the right plan, or want to discuss a custom enterprise setup — our team in Kerala is ready to help.
            </p>

            {[
              { icon: "📧", label: "Email us",        value: "hello@strixmind.ai" },
              { icon: "📍", label: "Our office",      value: "Kerala, India" },
              { icon: "⏱️", label: "Response time",   value: "Within 2 business hours" },
              { icon: "🕐", label: "Office hours",    value: "Mon – Fri, 9 AM – 6 PM IST" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: "1.25rem", padding: "1.25rem", background: "#fff", borderRadius: 18, border: "1.5px solid #E5E7EB", marginBottom: "1rem", alignItems: "center" }}>
                <div style={{ width: 46, height: 46, minWidth: 46, borderRadius: 14, background: "rgba(0,99,229,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94A3B8", marginBottom: "0.25rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.975rem", fontWeight: 600, color: "#0F172A" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div style={{ background: "#fff", borderRadius: 28, padding: "2.75rem", border: "1.5px solid #E5E7EB", boxShadow: "0 16px 56px rgba(0,99,229,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #0063E5, #6aabff)" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🎉</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Message sent!</div>
                <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.7 }}>We'll get back to you within 2 business hours. Check your inbox for a confirmation.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.75rem", letterSpacing: "-0.025em" }}>Send us a message</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                  <input style={inputBase} type="text" placeholder="Full name *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur} />
                  <input style={inputBase} type="email" placeholder="Work email *" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
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
                    width: "100%", padding: "1.05rem", background: form.name && form.email ? "#0063E5" : "#CBD5E1",
                    color: "#fff", border: "none", borderRadius: 100, fontSize: "0.95rem", fontWeight: 700,
                    cursor: form.name && form.email ? "pointer" : "not-allowed",
                    boxShadow: form.name && form.email ? "0 8px 24px rgba(0,99,229,0.28)" : "none",
                    fontFamily: "inherit", transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    if (form.name && form.email) {
                      (e.currentTarget as HTMLButtonElement).style.background = "#0052c2";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = form.name && form.email ? "#0063E5" : "#CBD5E1";
                    (e.currentTarget as HTMLButtonElement).style.transform = "";
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
