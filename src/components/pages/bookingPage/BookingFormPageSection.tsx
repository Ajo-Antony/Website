"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconCheckCircle } from "@/components/ui/SvgIcons";
import { createBooking } from "@/lib/actions/bookings";

interface SlotsProps { slots?: string[] }
const D = CONTENT_DEFAULTS["booking.slots"] as Required<SlotsProps>;

export default function BookingFormPageSection({ slots = D.slots }: SlotsProps) {
  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name:"",email:"",company:"",size:"",goal:"" });
  const [booked, setBooked] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid var(--border)", background:"var(--surface-alt)", fontSize:"0.9rem", color:"var(--text)", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem" };

  async function handleConfirm() {
    if (!form.name || !form.email || submitting) return;
    setSubmitting(true);
    setError("");
    const result = await createBooking({
      slot,
      name: form.name,
      email: form.email,
      company: form.company,
      size: form.size,
      goal: form.goal,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong. Please try again.");
      return;
    }
    setEmailSent(result.emailSent !== false);
    setBooked(true);
  }

  return (
    <section style={{ padding:"4rem 0 8rem", background:"var(--surface)", borderTop:"1px solid var(--border)" }}>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 2rem" }}>
        <div style={{ background:"var(--surface)", borderRadius:28, padding:"2.5rem", border:"1px solid var(--border)", boxShadow:"0 16px 56px var(--shadow)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--accent),var(--accent-2))" }} />
          {booked ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ marginBottom:"1rem", display:"flex", justifyContent:"center" }}><IconCheckCircle size={44} color="#22c55e" strokeWidth={1.5} /></div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"var(--text)", marginBottom:"0.75rem" }}>You're booked!</div>
              {emailSent ? (
                <p style={{ color:"var(--text-muted)" }}>Confirmation sent to <strong>{form.email}</strong>. See you at <strong>{slot}</strong>.</p>
              ) : (
                <p style={{ color:"var(--text-muted)" }}>You&apos;re all set for <strong>{slot}</strong>. We couldn&apos;t send a confirmation email right now, but your spot is saved — we&apos;ll reach out at <strong>{form.email}</strong>.</p>
              )}
            </div>
          ) : step === 1 ? (
            <>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"var(--text)", marginBottom:"1.5rem" }}>Step 1 — Pick a time slot</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
                {slots.map(s=>(
                  <button key={s} onClick={()=>setSlot(s)} style={{ padding:"0.75rem", borderRadius:12, fontFamily:"Inter,sans-serif", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", border:slot===s?"2px solid var(--accent)":"1px solid var(--border)", background:slot===s?"var(--glass-bg)":"var(--surface-alt)", color:slot===s?"var(--accent-deep)":"var(--text-muted)", transition:"all 0.2s" }}>{s}</button>
                ))}
              </div>
              <button onClick={()=>slot&&setStep(2)} style={{ fontFamily:"Inter,sans-serif", fontSize:"0.9rem", fontWeight:700, padding:"0.9rem 2rem", background:slot?"linear-gradient(135deg,var(--accent),var(--accent-2))":"var(--glass-bg)", color:slot?"#fff":"var(--text-dim)", border:"none", borderRadius:100, cursor:slot?"pointer":"not-allowed", transition:"all 0.2s", boxShadow:slot?"0 8px 24px var(--shadow-strong)":"none" }}>Continue →</button>
            </>
          ) : (
            <>
              <button onClick={()=>{setStep(1);setError("");}} style={{ fontSize:"0.8rem", color:"var(--accent)", background:"none", border:"none", cursor:"pointer", marginBottom:"1.25rem", fontWeight:600 }}>← Change time</button>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"var(--text)", marginBottom:"1.5rem" }}>Step 2 — About your business</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
              <select style={{ ...inputStyle, cursor:"pointer" }} value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>
                <option value="">Company size</option><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select>
              <textarea style={{ ...inputStyle, minHeight:100, resize:"vertical" }} placeholder="What's your main goal?" value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} />
              {error && (
                <div style={{ marginBottom:"1rem", padding:"0.75rem 1rem", borderRadius:10, background:"#FEF2F2", border:"1px solid #FCA5A5", color:"#B91C1C", fontSize:"0.85rem", fontWeight:600 }}>{error}</div>
              )}
              <button
                onClick={handleConfirm}
                disabled={!form.name || !form.email || submitting}
                style={{
                  width:"100%", padding:"1rem",
                  background: (form.name && form.email && !submitting) ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--glass-bg)",
                  color: (form.name && form.email && !submitting) ? "#fff" : "var(--text-dim)",
                  border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700,
                  cursor: (form.name && form.email && !submitting) ? "pointer" : "not-allowed",
                  fontFamily:"Inter,sans-serif",
                  boxShadow:(form.name && form.email && !submitting) ? "0 8px 24px var(--shadow-strong)" : "none",
                }}
              >
                {submitting ? "Booking…" : "Confirm booking →"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
