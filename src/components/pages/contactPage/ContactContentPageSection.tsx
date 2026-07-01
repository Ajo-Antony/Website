"use client";
import { useState } from "react";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconMail, IconMapPin, IconClock, IconPhone, IconCheckCircle } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface InfoItem { icon: string; label: string; value: string }
interface ContactContentProps { items?: InfoItem[] }
const D = CONTENT_DEFAULTS["contact.info"] as Required<ContactContentProps>;

// SVG icons indexed to match the original emoji order: 📧 📍 ⏰ 📞
const INFO_ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconMail, IconMapPin, IconClock, IconPhone,
];

export default function ContactContentPageSection({ items = D.items }: ContactContentProps) {
  const [form, setForm] = useState({ name:"", email:"", company:"", message:"" });
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = { width:"100%", padding:"0.875rem 1.125rem", borderRadius:14, border:"1.5px solid var(--border)", background:"var(--surface-alt)", fontSize:"0.9rem", color:"var(--text)", fontFamily:"Inter,sans-serif", outline:"none", marginBottom:"1rem", transition:"border-color 0.2s" };
  return (
    <section style={{ background:"var(--surface)", borderTop:"1px solid var(--border)" }} className="py-16 sm:py-20 md:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-16 px-5 sm:px-8" style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:"1.25rem" }}>
          {items.map((item, i) => {
            const Icon = INFO_ICONS[i % INFO_ICONS.length];
            return (
            <div key={item.label} style={{ display:"flex", gap:"1.25rem", padding:"1.25rem", background:"var(--surface-alt)", borderRadius:18, border:"1px solid var(--border)" }}>
              <div style={{ width:44, height:44, minWidth:44, borderRadius:12, background:"var(--shadow)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={20} color="var(--accent)" />
              </div>
              <div><div style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--text-dim)", marginBottom:"0.3rem" }}>{item.label}</div><div style={{ fontSize:"0.95rem", fontWeight:600, color:"var(--text)" }}>{item.value}</div></div>
            </div>
            );
          })}
        </div>
        <div className="p-6 sm:p-10" style={{ background:"var(--surface)", borderRadius:28, border:"1px solid var(--border)", boxShadow:"0 12px 48px var(--shadow)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--accent),var(--accent-2))" }} />
          {sent ? (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ marginBottom:"1rem", display:"flex", justifyContent:"center" }}><IconCheckCircle size={48} color="#22c55e" strokeWidth={1.5} /></div>
              <div style={{ fontSize:"1.25rem", fontWeight:800, color:"var(--text)" }}>Message sent!</div>
              <p style={{ color:"var(--text-muted)", marginTop:"0.5rem" }}>We'll be in touch within 2 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize:"1.25rem", fontWeight:800, color:"var(--text)", marginBottom:"1.5rem" }}>Send us a message</h3>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              <input style={inputStyle} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              <input style={inputStyle} placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              <textarea style={{ ...inputStyle, minHeight:120, resize:"vertical", marginBottom:"1.25rem" }} placeholder="How can we help?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")} />
              <button onClick={()=>form.name&&form.email&&setSent(true)} style={{ width:"100%", padding:"1rem", background:"linear-gradient(135deg,var(--accent),var(--accent-2))", color:"#fff", border:"none", borderRadius:100, fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:"Inter,sans-serif", boxShadow:"0 8px 24px var(--shadow-strong)" }}>Send message →</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
