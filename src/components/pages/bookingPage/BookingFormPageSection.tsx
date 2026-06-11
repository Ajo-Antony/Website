"use client";
import { useState } from "react";
const SLOTS = ["Mon 9:00 AM","Mon 2:00 PM","Tue 10:00 AM","Tue 3:00 PM","Wed 9:00 AM","Wed 11:00 AM","Thu 2:00 PM","Fri 10:00 AM"];

export default function BookingFormPageSection() {
  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name:"",email:"",company:"",size:"",goal:"" });
  const [booked, setBooked] = useState(false);
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid #E5E7EB", background:"#D8E8E5", fontSize:"0.9rem", color:"#0F172A", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem" };

  return (
    <section style={{ padding:"4rem 0 8rem", background:"#fff", borderTop:"1px solid #E5E7EB" }}>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 2rem" }}>
        <div style={{ background:"#fff", borderRadius:28, padding:"2.5rem", border:"1px solid #E5E7EB", boxShadow:"0 16px 56px rgba(10,92,104,0.10)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#0A5C68,#14b8a6)" }} />
          {booked ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎉</div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"#0F172A", marginBottom:"0.75rem" }}>You're booked!</div>
              <p style={{ color:"#64748B" }}>Confirmation sent to <strong>{form.email}</strong>. See you at <strong>{slot}</strong>.</p>
            </div>
          ) : step === 1 ? (
            <>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"#0F172A", marginBottom:"1.5rem" }}>Step 1 — Pick a time slot</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
                {SLOTS.map(s=>(
                  <button key={s} onClick={()=>setSlot(s)} style={{ padding:"0.75rem", borderRadius:12, fontFamily:"Inter,sans-serif", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", border:slot===s?"2px solid #0A5C68":"1px solid #E5E7EB", background:slot===s?"rgba(10,92,104,0.08)":"#D8E8E5", color:slot===s?"#0A5C68":"#64748B", transition:"all 0.2s" }}>{s}</button>
                ))}
              </div>
              <button onClick={()=>slot&&setStep(2)} style={{ fontFamily:"Inter,sans-serif", fontSize:"0.9rem", fontWeight:700, padding:"0.9rem 2rem", background:slot?"#0A5C68":"rgba(10,92,104,0.2)", color:slot?"#fff":"#9ab5b9", border:"none", borderRadius:100, cursor:slot?"pointer":"not-allowed", transition:"all 0.2s", boxShadow:slot?"0 8px 24px rgba(10,92,104,0.30)":"none" }}>Continue →</button>
            </>
          ) : (
            <>
              <button onClick={()=>setStep(1)} style={{ fontSize:"0.8rem", color:"#0A5C68", background:"none", border:"none", cursor:"pointer", marginBottom:"1.25rem", fontWeight:600 }}>← Change time</button>
              <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"#0F172A", marginBottom:"1.5rem" }}>Step 2 — About your business</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
              <select style={{ ...inputStyle, cursor:"pointer" }} value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>
                <option value="">Company size</option><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select>
              <textarea style={{ ...inputStyle, minHeight:100, resize:"vertical" }} placeholder="What's your main goal?" value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} />
              <button onClick={()=>form.name&&form.email&&setBooked(true)} style={{ width:"100%", padding:"1rem", background:"#0A5C68", color:"#fff", border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", boxShadow:"0 8px 24px rgba(10,92,104,0.3)" }}>Confirm booking →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
