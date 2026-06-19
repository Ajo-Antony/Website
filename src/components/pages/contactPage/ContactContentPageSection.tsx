"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface InfoItem { icon: string; label: string; value: string }
interface ContactContentProps { items?: InfoItem[] }
const D = CONTENT_DEFAULTS["contact.info"] as Required<ContactContentProps>;

export default function ContactContentPageSection({ items = D.items }: ContactContentProps) {
  const [form, setForm] = useState({ name:"", email:"", company:"", message:"" });
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid #E5E0FA", background:"#F8F7FF", fontSize:"0.9rem", color:"#1a1333", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem", transition:"border-color 0.2s" };
  return (
    <section style={{ padding:"4rem 0 8rem", background:"#fff", borderTop:"1px solid #E5E0FA" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:"1.25rem" }}>
          {items.map(item=>(
            <div key={item.label} style={{ display:"flex", gap:"1.25rem", padding:"1.25rem", background:"#F8F7FF", borderRadius:18, border:"1px solid #E5E0FA" }}>
              <div style={{ width:44, height:44, minWidth:44, borderRadius:12, background:"rgba(108,99,255,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>{item.icon}</div>
              <div><div style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#9b92c0", marginBottom:"0.3rem" }}>{item.label}</div><div style={{ fontSize:"0.95rem", fontWeight:600, color:"#1a1333" }}>{item.value}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:28, padding:"2.5rem", border:"1px solid #E5E0FA", boxShadow:"0 12px 48px rgba(108,99,255,0.10)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#6c63ff,#a78bfa)" }} />
          {sent ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"#1a1333" }}>Message sent!</div>
              <p style={{ color:"#5b5478", marginTop:"0.5rem" }}>We'll be in touch within 2 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize:"1.25rem", fontWeight:800, color:"#1a1333", marginBottom:"1.5rem" }}>Send us a message</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={e=>(e.target.style.borderColor="#6c63ff")} onBlur={e=>(e.target.style.borderColor="#E5E0FA")} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={e=>(e.target.style.borderColor="#6c63ff")} onBlur={e=>(e.target.style.borderColor="#E5E0FA")} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} onFocus={e=>(e.target.style.borderColor="#6c63ff")} onBlur={e=>(e.target.style.borderColor="#E5E0FA")} />
              <textarea style={{ ...inputStyle, minHeight:120, resize:"vertical", marginBottom:"1.25rem" }} placeholder="How can we help?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} onFocus={e=>(e.target.style.borderColor="#6c63ff")} onBlur={e=>(e.target.style.borderColor="#E5E0FA")} />
              <button onClick={()=>form.name&&form.email&&setSent(true)} style={{ width:"100%", padding:"1rem", background:"linear-gradient(135deg,#6c63ff,#a78bfa)", color:"#fff", border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", boxShadow:"0 8px 24px rgba(108,99,255,0.32)" }}>Send message →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
