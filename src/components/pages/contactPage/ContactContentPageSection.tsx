"use client";
import { useState } from "react";

export default function ContactContentPageSection() {
  const [form, setForm] = useState({ name:"", email:"", company:"", message:"" });
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid #E5E7EB", background:"#D8E8E5", fontSize:"0.9rem", color:"#0F172A", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem", transition:"border-color 0.2s" };
  return (
    <section style={{ padding:"4rem 0 8rem", background:"#fff", borderTop:"1px solid #E5E7EB" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:"1.25rem" }}>
          {[{icon:"📧",label:"Email",value:"hello@strixmind.ai"},{icon:"📍",label:"Location",value:"Kerala, India"},{icon:"⏰",label:"Response time",value:"Within 2 business hours"},{icon:"📞",label:"Office hours",value:"Mon–Fri, 9 AM – 6 PM IST"}].map(item=>(
            <div key={item.label} style={{ display:"flex", gap:"1.25rem", padding:"1.25rem", background:"#D8E8E5", borderRadius:18, border:"1px solid #E5E7EB" }}>
              <div style={{ width:44, height:44, minWidth:44, borderRadius:12, background:"rgba(10,92,104,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>{item.icon}</div>
              <div><div style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#64748B", marginBottom:"0.3rem" }}>{item.label}</div><div style={{ fontSize:"0.95rem", fontWeight:600, color:"#0F172A" }}>{item.value}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:28, padding:"2.5rem", border:"1px solid #E5E7EB", boxShadow:"0 12px 48px rgba(10,92,104,0.08)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#0A5C68,#14b8a6)" }} />
          {sent ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"#0F172A" }}>Message sent!</div>
              <p style={{ color:"#64748B", marginTop:"0.5rem" }}>We'll be in touch within 2 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize:"1.25rem", fontWeight:800, color:"#0F172A", marginBottom:"1.5rem" }}>Send us a message</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={e=>(e.target.style.borderColor="#0A5C68")} onBlur={e=>(e.target.style.borderColor="#E5E7EB")} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={e=>(e.target.style.borderColor="#0A5C68")} onBlur={e=>(e.target.style.borderColor="#E5E7EB")} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} onFocus={e=>(e.target.style.borderColor="#0A5C68")} onBlur={e=>(e.target.style.borderColor="#E5E7EB")} />
              <textarea style={{ ...inputStyle, minHeight:120, resize:"vertical", marginBottom:"1.25rem" }} placeholder="How can we help?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} onFocus={e=>(e.target.style.borderColor="#0A5C68")} onBlur={e=>(e.target.style.borderColor="#E5E7EB")} />
              <button onClick={()=>form.name&&form.email&&setSent(true)} style={{ width:"100%", padding:"1rem", background:"#0A5C68", color:"#fff", border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", boxShadow:"0 8px 24px rgba(10,92,104,0.3)" }}>Send message →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
