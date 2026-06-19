"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface SlotsProps { slots?: string[] }
const D = CONTENT_DEFAULTS["booking.slots"] as Required<SlotsProps>;

export default function BookingFormPageSection({ slots = D.slots }: SlotsProps) {
  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name:"",email:"",company:"",size:"",goal:"" });
  const [booked, setBooked] = useState(false);
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid #E5E0FA", background:"#F8F7FF", fontSize:"0.9rem", color:"#1a1333", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem" };

  return (
    <section style={{ padding:"4rem 0 8rem", background:"#fff", borderTop:"1px solid #E5E0FA" }}>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 2rem" }}>
        <div style={{ background:"#fff", borderRadius:28, padding:"2.5rem", border:"1px solid #E5E0FA", boxShadow:"0 16px 56px rgba(108,99,255,0.10)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#6c63ff,#a78bfa)" }} />
          {booked ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎉</div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"#1a1333", marginBottom:"0.75rem" }}>You're booked!</div>
              <p style={{ color:"#5b5478" }}>Confirmation sent to <strong>{form.email}</strong>. See you at <strong>{slot}</strong>.</p>
            </div>
          ) : step === 1 ? (
            <>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"#1a1333", marginBottom:"1.5rem" }}>Step 1 — Pick a time slot</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
                {slots.map(s=>(
                  <button key={s} onClick={()=>setSlot(s)} style={{ padding:"0.75rem", borderRadius:12, fontFamily:"Inter,sans-serif", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", border:slot===s?"2px solid #6c63ff":"1px solid #E5E0FA", background:slot===s?"rgba(108,99,255,0.08)":"#F8F7FF", color:slot===s?"#4c46c4":"#5b5478", transition:"all 0.2s" }}>{s}</button>
                ))}
              </div>
              <button onClick={()=>slot&&setStep(2)} style={{ fontFamily:"Inter,sans-serif", fontSize:"0.9rem", fontWeight:700, padding:"0.9rem 2rem", background:slot?"linear-gradient(135deg,#6c63ff,#a78bfa)":"rgba(108,99,255,0.18)", color:slot?"#fff":"#a39ecf", border:"none", borderRadius:100, cursor:slot?"pointer":"not-allowed", transition:"all 0.2s", boxShadow:slot?"0 8px 24px rgba(108,99,255,0.32)":"none" }}>Continue →</button>
            </>
          ) : (
            <>
              <button onClick={()=>setStep(1)} style={{ fontSize:"0.8rem", color:"#6c63ff", background:"none", border:"none", cursor:"pointer", marginBottom:"1.25rem", fontWeight:600 }}>← Change time</button>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"#1a1333", marginBottom:"1.5rem" }}>Step 2 — About your business</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
              <select style={{ ...inputStyle, cursor:"pointer" }} value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>
                <option value="">Company size</option><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select>
              <textarea style={{ ...inputStyle, minHeight:100, resize:"vertical" }} placeholder="What's your main goal?" value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} />
              <button onClick={()=>form.name&&form.email&&setBooked(true)} style={{ width:"100%", padding:"1rem", background:"linear-gradient(135deg,#6c63ff,#a78bfa)", color:"#fff", border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", boxShadow:"0 8px 24px rgba(108,99,255,0.32)" }}>Confirm booking →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
